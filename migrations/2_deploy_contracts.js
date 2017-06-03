const Shark = artifacts.require("./Shark.sol")

module.exports = function(deployer) {
  deployer.deploy(Shark);
};
