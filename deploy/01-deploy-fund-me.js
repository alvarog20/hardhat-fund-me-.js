const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUSDPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUSDPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUSDPriceFeedAddress = networkConfig[chainId]["ethUSDPriceFeed"]
    }

    const args = [ethUSDPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, //put price feed address,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_TOKEN
    ) {
        await verify(fundMe.address, args)
    }

    log("--------------------")
}

module.exports.tags = ["all", "FundMe"]
