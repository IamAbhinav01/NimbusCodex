import Docker from 'dockerode';

// Connect to the local docker daemon via the socket
// The socket will be mounted at /var/run/docker.sock in docker-compose
export const docker = new Docker({ socketPath: '/var/run/docker.sock' });

/**
 * Creates and starts a container for the given environment (e.g. 'python-basic')
 * Returns the container ID.
 */
export async function startEnvironmentContainer(env: string): Promise<string> {
  const imageName = `NIMBUSCODEX/${env}:latest`;

  // Create container using the specific image
  const container = await docker.createContainer({
    Image: imageName,
    Tty: true,
    Cmd: ['tail', '-f', '/dev/null'],
    HostConfig: {
      AutoRemove: false, // We will manually remove it on session end
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
