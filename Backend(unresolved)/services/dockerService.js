const Docker = require("dockerode");
const labConfigs = require("./labConfig");

const docker = new Docker(
  process.platform === "win32"
    ? { socketPath: "//./pipe/docker_engine" }
    : { socketPath: "/var/run/docker.sock" }
);

async function startLab(labType) {

  const config = labConfigs[labType];

  if (!config) {
    throw new Error("Invalid lab type");
  }

  const container = await docker.createContainer({

    Image: config.image,

    ExposedPorts: {
      "8080/tcp": {}
    },

    HostConfig: {

      PortBindings: {
        "8080/tcp": [{ HostPort: "" }]
      },

      Memory: config.memory === "512m" ? 512 * 1024 * 1024 :
              config.memory === "1g" ? 1024 * 1024 * 1024 :
              config.memory === "1.5g" ? 1536 * 1024 * 1024 :
              2 * 1024 * 1024 * 1024,

      NanoCpus: config.cpu * 1000000000
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