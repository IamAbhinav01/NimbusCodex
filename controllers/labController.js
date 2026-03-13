const dockerService = require("../services/dockerService");

const launchLab = async (req, res) => {
  try {
    const lab = await dockerService.startLab();

    res.json({
      message: "Lab started",
      containerId: lab.containerId,
      url: lab.url
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  launchLab
};