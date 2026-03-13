const labConfigs = {

  "python-basic": {
    image: "python-basic",
    cpu: 1,
    memory: "512m"
  },

  "python-ml": {
    image: "python-ml",
    cpu: 2,
    memory: "2g"
  },

  "python-ds": {
    image: "python-ds",
    cpu: 2,
    memory: "2g"
  },

  "cpp": {
    image: "cpp-lab",
    cpu: 1,
    memory: "512m"
  },

  "java": {
    image: "java-lab",
    cpu: 1,
    memory: "1g"
  },

  "node-ts": {
    image: "node-ts-lab",
    cpu: 1,
    memory: "1g"
  },

  "node-frontend": {
    image: "node-frontend-lab",
    cpu: 2,
    memory: "1.5g"
  }

};

module.exports = labConfigs;