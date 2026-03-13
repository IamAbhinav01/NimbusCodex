import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Layers } from 'lucide-react';
import type { Environment } from '../../data/environments';
import CodeEditor from '../CodeEditor/CodeEditor';
import Terminal, { type TerminalHandle } from '../Terminal/Terminal';
import MetricsPanel from '../MetricsPanel/MetricsPanel';
import RunButton from '../RunButton/RunButton';
import styles from './Workspace.module.css';

interface Props {
  environment: Environment;
}

function getExecutionLines(language: string): string[] {
  const langMap: Record<string, string> = {
    python: 'python3 main.py',
    typescript: 'ts-node main.ts',
    javascript: 'node main.js',
    cpp: 'g++ -o main main.cpp && ./main',
    java: 'javac Main.java && java Main',
    go: 'go run main.go',
    rust: 'rustc main.rs && ./main',
  };
  return [
    `\x1b[32m$\x1b[0m \x1b[33m${langMap[language] ?? 'run main'}\x1b[0m`,
    '\x1b[90m> Connecting to CloudLab runtime…\x1b[0m',
    '\x1b[90m> Container ready.\x1b[0m',
    '\x1b[90m> Running code...\x1b[0m',
    '',
  ];
}

function getOutputLines(code: string, language: string): string[] {
  // Simulate output extraction from code
  const printMatches = language === 'python'
    ? code.match(/print\(([^)]+)\)/g) ?? []
    : code.match(/console\.log\(([^)]+)\)/g) ??
      code.match(/System\.out\.println\(([^)]+)\)/g) ??
      code.match(/fmt\.Println\(([^)]+)\)/g) ??
      code.match(/println!\(([^)]+)\)/g) ??
      code.match(/std::cout\s*<<\s*"([^"]+)"/g) ?? [];

  const outputs = printMatches.slice(0, 3).map((m) => {
    const inner = m.replace(/^print\(|^console\.log\(|^System\.out\.println\(|^fmt\.Println\(|^println!\(/, '').replace(/\)$/, '');
    return `\x1b[32m${inner.replace(/["'`]/g, '').trim()}\x1b[0m`;
  });

  if (outputs.length === 0) {
    outputs.push('\x1b[32mProcess finished with exit code 0\x1b[0m');
  }

  return [
    ...outputs,
    '',
    `\x1b[90m✓ Done in 0.${Math.floor(Math.random() * 9) + 1}s\x1b[0m`,
  ];
}

export default function Workspace({ environment }: Props) {
  const navigate = useNavigate();
  const [code, setCode] = useState(environment.template);
  const [isRunning, setIsRunning] = useState(false);
  const [isLaunching, setIsLaunching] = useState(true);
  const terminalRef = useRef<TerminalHandle>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    let activeSessionId: string | null = null;
    let isMounted = true;

    const launchEnvironment = async () => {
      try {
        const response = await fetch('http://localhost:4002/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ env: environment.id })
        });
        
        if (!response.ok) throw new Error('Failed to launch');
        
        const data = await response.json();
        
        if (!isMounted) {
          // If unmounted during fetch, clean up the orphaned session
          fetch(`http://localhost:4002/sessions/${data.session_id}`, { method: 'DELETE' }).catch(console.error);
          return;
        }

        activeSessionId = data.session_id;
        setSessionId(data.session_id);
        
        setIsLaunching(false);
        terminalRef.current?.writeln('\x1b[90m> Connected to CloudLab Runtime via Orchestrator\x1b[0m');
        terminalRef.current?.writeln('\x1b[32m✓ Environment ready.\x1b[0m');
        terminalRef.current?.writeln('');
        terminalRef.current?.write('\x1b[32m$\x1b[0m ');
      } catch (error) {
        if (isMounted) {
          setIsLaunching(false);
          terminalRef.current?.writeln('\x1b[31m✗ Failed to connect to Orchestrator service.\x1b[0m');
        }
      }
    };
    
    launchEnvironment();
    
    return () => {
      isMounted = false;
      if (activeSessionId) {
        fetch(`http://localhost:4002/sessions/${activeSessionId}`, {
          method: 'DELETE',
        }).catch(console.error);
      }
    };
  }, [environment.id]);

  const handleRun = useCallback(async () => {
    if (isRunning || isLaunching) return;
    setIsRunning(true);

    const execLines = getExecutionLines(environment.language);
    for (const line of execLines) {
      terminalRef.current?.writeln(line);
      await new Promise((r) => setTimeout(r, 150));
    }

    // 1 second execution delay
    await new Promise((r) => setTimeout(r, 1000));

    const outputLines = getOutputLines(code, environment.language);
    for (const line of outputLines) {
      terminalRef.current?.writeln(line);
      await new Promise((r) => setTimeout(r, 80));
    }

    terminalRef.current?.write('\x1b[32m$\x1b[0m ');
    setIsRunning(false);
  }, [code, environment.language, isRunning, isLaunching]);

  // Ctrl+Enter shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleRun();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleRun]);

  return (
    <div className={styles.workspace}>
      {/* Top bar */}
      <div className={styles.topbar}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>
          <ArrowLeft size={14} />
          Home
        </button>
        <div className={styles.envInfo}>
          <span className={styles.envIcon}>{environment.icon}</span>
          <span className={styles.envName}>{environment.name}</span>
          <span
            className={styles.envStatus}
            style={{ color: isLaunching ? '#eab308' : '#22c55e' }}
          >
            {isLaunching ? '⟳ Launching…' : '● Running'}
          </span>
        </div>
        <div className={styles.topRight}>
          <Layers size={14} className={styles.topIcon} />
          <span>{environment.libraries.length} packages</span>
        </div>
      </div>

      {/* Launching overlay */}
      {isLaunching && (
        <div className={styles.launchOverlay}>
          <div className={styles.launchCard}>
            <div className={styles.launchIcon}>{environment.icon}</div>
            <h2 className={styles.launchTitle}>Launching environment…</h2>
            <p className={styles.launchSub}>{environment.name}</p>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} />
            </div>
          </div>
        </div>
      )}

      {/* Main grid */}
      <div className={styles.grid}>
        <div className={styles.editorArea}>
          <CodeEditor
            language={environment.language}
            value={code}
            onChange={setCode}
          />
        </div>
        <div className={styles.metricsArea}>
          <MetricsPanel />
        </div>
        <div className={styles.terminalArea}>
          <Terminal ref={terminalRef} language={environment.language} />
        </div>
        <div className={styles.runArea}>
          <RunButton onRun={handleRun} isRunning={isRunning} />
        </div>
      </div>
    </div>
  );
}
