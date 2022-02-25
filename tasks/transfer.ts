import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

task("transfer", "Transfer")
  .addParam("contract", "Contract")
  .addParam("address", "Address")
  .addParam("amount", "Amount")
  .setAction(async (args, hre) => {
    const { contract, address, amount } = args;
    const Contract = await hre.ethers.getContractFactory("DevbulatERC20");
    const accounts = await hre.ethers.getSigners();
    const signer = accounts[0];

    const devbulatERC20Contract = await new hre.ethers.Contract(
      contract,
      Contract.interface,
      signer
    );

    await devbulatERC20Contract.transfer(address, amount).then(() => {
      console.log(`${amount} transfered to ${address}`);
    });
  });

export default {};
