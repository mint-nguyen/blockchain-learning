require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
	solidity: "0.8.0",
	networks: {
		goerli: {
			url: `${process.env.POKT_URL}`,
			accounts: [`${process.env.PRIVATE_KEY}`],
		},
	},
};
