const dockerService = require("../services/dockerService");

exports.launchLab = async (req, res) => {

  try {

    const { labType } = req.body;

    const lab = await dockerService.startLab(labType);

    res.json({
      message: "Lab started",
      containerId: lab.containerId,
      url: lab.url
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

};