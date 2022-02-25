import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

task("transferFrom", "Transfer from")
  .addParam("contract", "Contract")
  .addParam("sender", "Sender")
  .addParam("recipient", "Recipient")
  .addParam("amount", "Amount")
  .setAction(async (args, hre) => {
    const { contract, sender, recipient, amount } = args;
    const Contract = await hre.ethers.getContractFactory("DevbulatERC20");
    const accounts = await hre.ethers.getSigners();
    const signer = accounts[0];

    const devbulatERC20Contract = await new hre.ethers.Contract(
      contract,
      Contract.interface,
      signer
    );

    await devbulatERC20Contract
      .transferFrom(sender, recipient, amount)
      .then(() => {
        console.log(`${amount} transfered from ${sender} to ${recipient}`);
      });
  });

export default {};
