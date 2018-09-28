var Fbethorder = artifacts.require("./Fbethorder.sol");
var fborderaddress = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1";
var ntimestamp = Date.now()/1000;

module.exports = function(deployer) {
  deployer.deploy(Fbethorder, fborderaddress, 
    5, ntimestamp).then(() => console.log(Fbethorder.address));
};