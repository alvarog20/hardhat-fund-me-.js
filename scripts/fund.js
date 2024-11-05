const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts()
    const { deployerSigner } = await ethers.getSigner(deployer)
    const fundMe = await ethers.getContractAt(
        "FundMe",
        (
            await deployments.get("FundMe")
        ).address,
        deployerSigner
    )
    console.log("Funding contract....")
    const transactionResponse = await fundMe.fund({
        value: ethers.parseEther("0.05"),
    })
    await transactionResponse.wait(1)
    console.log("Funded!")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
