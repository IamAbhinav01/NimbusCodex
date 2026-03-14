import Docker from 'dockerode';
import path from 'path';

export const docker = new Docker({ socketPath: '/var/run/docker.sock' });

interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

/**
 * Executes code inside a running container.
 */
export async function executeCode(
  containerId: string,
  code: string,
  language: string
): Promise<ExecutionResult> {
  const container = docker.getContainer(containerId);
  if (!container) throw new Error('Container instance not found');

  const filenameMap: Record<string, string> = {
    python: 'main.py',
    typescript: 'main.ts',
    javascript: 'main.js',
    cpp: 'main.cpp',
    java: 'Main.java',
    go: 'main.go',
    rust: 'main.rs',
  };

  const filename = filenameMap[language] || 'script.txt';
  const filePath = path.join('/tmp', filename);

  // 1. Write file to container
  // We'll use a safer approach: echo into the file.
  // Using a base64 encoded string avoids escaping issues with the code content.
  const base64Code = Buffer.from(code).toString('base64');
  console.log(`[Executor] Writing ${language} code to ${filePath} (${code.length} bytes)...`);
  
  const writeExec: any = await container.exec({
    Cmd: ['sh', '-c', `echo "${base64Code}" | base64 -d > ${filePath}`],
    AttachStdout: true,
    AttachStderr: true,
  });
  
  const writeStream = await writeExec.start({});
  await new Promise((resolve) => {
    writeStream.on('end', resolve);
    writeStream.on('error', resolve);
    // Safety timeout
    setTimeout(resolve, 2000);
  });

  // 2. Command mapping
  const commandMap: Record<string, string[]> = {
    python: ['python3', filePath],
    typescript: ['npx', 'ts-node', filePath],
    javascript: ['node', filePath],
    cpp: ['sh', '-c', `g++ -o /tmp/run_binary ${filePath} && /tmp/run_binary`],
    java: ['sh', '-c', `javac ${filePath} && java -cp /tmp Main`],
    go: ['go', 'run', filePath],
    rust: ['sh', '-c', `rustc ${filePath} -o /app/run_binary && /app/run_binary`],
  };

  const cmd: string[] = commandMap[language] || ['cat', filePath];

  // 3. Exec the actual code
  console.log(`[Executor] Executing: ${cmd.join(' ')}`);
  const execOptions: any = {
    Cmd: cmd,
    AttachStdout: true,
    AttachStderr: true,
  };
  
  const exec = await container.exec(execOptions);
  const stream: any = await exec.start({ hijack: true, Detach: false });

  if (!stream || typeof stream.on !== 'function') {
    throw new Error('Failed to attach to execution stream');
  }

  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    stream.on('data', (chunk: any) => {
      // Docker socket stream multiplexing: [header 8 bytes][data]
      if (!chunk || chunk.length < 8) {
          stdout += String(chunk);
          return;
      }
      
      try {
        let offset = 0;
        while (offset < chunk.length) {
          if (offset + 8 > chunk.length) break;
          const type = chunk.readUInt8(offset);
          const length = chunk.readUInt32BE(offset + 4);
          const end = offset + 8 + length;
          const data = chunk.toString('utf8', offset + 8, Math.min(end, chunk.length));
          
          if (type === 1) stdout += data;
          else if (type === 2) stderr += data;
          
          offset = end;
        }
      } catch (e) {
        stdout += chunk.toString();
      }
    });

    stream.on('end', async () => {
      try {
        const inspect = await exec.inspect();
        resolve({
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          exitCode: inspect.ExitCode || 0,
        });
      } catch (err) {
        resolve({ stdout: stdout.trim(), stderr: stderr.trim(), exitCode: 0 });
      }
    });

    stream.on('error', (err: any) => reject(err));
    
    // Safety timeout for long-running scripts (can be increased later)
    setTimeout(() => {
        resolve({
            stdout: stdout.trim() + '\n[Timeout: Execution exceeded 10s]',
            stderr: stderr.trim(),
            exitCode: 124
        });
    }, 10000);
  });
}
