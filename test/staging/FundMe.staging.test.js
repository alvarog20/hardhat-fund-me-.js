const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { Signer } = require("ethers")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe
          let deployer, deployerSigner
          const sendValue = ethers.parseEther("0.05")
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              deployerSigner = await ethers.getSigner(deployer)
              fundMe = await ethers.getContractAt(
                  "FundMe",
                  (
                      await deployments.get("FundMe")
                  ).address,
                  deployerSigner
              )
          })

          it("allows people to fund and withdraw", async function () {
              await fundMe.fund({ value: sendValue })
              await fundMe.withdraw({ gasLimit: 3000000 })
              const endingBalance = await ethers.provider.getBalance(
                  fundMe.target
              )
              assert.equal(endingBalance.toString(), "0")
              console.log(
                  await ethers.provider.getBalance(deployerSigner.address)
              )
          })
      })
