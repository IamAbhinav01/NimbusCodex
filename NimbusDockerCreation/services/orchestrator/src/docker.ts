import Docker from 'dockerode';

import { getResourceLimits } from './resourceConfig';

// Connect to the local docker daemon via the socket
// The socket will be mounted at /var/run/docker.sock in docker-compose
export const docker = new Docker({ socketPath: '/var/run/docker.sock' });

/**
 * Creates and starts a container for the given environment (e.g. 'python-basic')
 * Returns the container ID.
 */
export async function startEnvironmentContainer(env: string): Promise<string> {
  const imageName = `nimbuscodex/${env}:latest`;
  const limits = getResourceLimits(env);

  // Create container using the specific image
  const container = await docker.createContainer({
    Image: imageName,
    Tty: true,
    Cmd: ['tail', '-f', '/dev/null'],
    HostConfig: {
      AutoRemove: false, // We will manually remove it on session end
      Memory: limits.memory,
      MemoryReservation: limits.memoryReservation,
      MemorySwap: limits.memory, // Disable swap to keep resources predictable
      NanoCpus: limits.nanoCpus,
    },
  });

  await container.start();
  return container.id;
}

/**
 * Stops and removes a container by ID
 */
export async function stopAndRemoveContainer(
  containerId: string
): Promise<void> {
  try {
    const container = docker.getContainer(containerId);

    // Check if it's already stopped
    const data = await container.inspect();
    if (data.State.Running) {
      await container.stop();
    }

    await container.remove({ force: true });
  } catch (error) {
    console.error(
      `[Docker] Failed to stop/remove container ${containerId}:`,
      error
    );
    throw error;
  }
}

/**
 * Fetches real-time stats for a container
 */
export async function getContainerStats(containerId: string): Promise<{ cpuPercent: number; memPercent: number }> {
  try {
    const container = docker.getContainer(containerId);
    const stats = await container.stats({ stream: false });

    // CPU calculation (Docker stats formula)
    const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
    const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
    const cpuPercent = systemDelta > 0 ? (cpuDelta / systemDelta) * stats.cpu_stats.online_cpus * 100.0 : 0;

    // Memory calculation
    const memUsage = stats.memory_stats.usage;
    const memLimit = stats.memory_stats.limit;
    const memPercent = (memUsage / memLimit) * 100.0;

    return {
      cpuPercent: Math.round(cpuPercent * 10) / 10,
      memPercent: Math.round(memPercent * 10) / 10,
    };
  } catch (error) {
    console.error(`[Docker] Failed to fetch stats for ${containerId}:`, error);
    return { cpuPercent: 0, memPercent: 0 };
  }
}
