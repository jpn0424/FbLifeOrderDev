/* 
  Use Metamask web3 provider to deploy. 
*/
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
    networks: {
      development: {
        host: "192.168.109.135",
        port: 3001,
        network_id: "*" // Match any network id
      }
    }
};
