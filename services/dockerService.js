const Docker = require("dockerode");

const docker = new Docker({
  socketPath: "//./pipe/docker_engine"
});

async function startLab() {

  const container = await docker.createContainer({
    Image: "python-lab",

    ExposedPorts: {
      "8080/tcp": {}
    },

    HostConfig: {
      PortBindings: {
        "8080/tcp": [
          {
            HostPort: ""
          }
        ]
      },

      Memory: 1024 * 1024 * 1024,
      NanoCpus: 1000000000
    }
  });

  await container.start();

  const info = await container.inspect();

  const port = info.NetworkSettings.Ports["8080/tcp"][0].HostPort;

  return {
    containerId: container.id,
    url: `http://localhost:${port}`
  };
}

module.exports = { startLab };