import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

task("approve", "Approve")
  .addParam("contract", "Contract")
  .addParam("spender", "Address")
  .addParam("amount", "Amount")
  .setAction(async (args, hre) => {
    const { contract, spender, amount } = args;
    const Contract = await hre.ethers.getContractFactory("DevbulatERC20");
    const accounts = await hre.ethers.getSigners();
    const signer = accounts[0];

    const devbulatERC20Contract = await new hre.ethers.Contract(
      contract,
      Contract.interface,
      signer
    );

    await devbulatERC20Contract.approve(spender, amount).then(() => {
      console.log(`${amount} approve for ${spender}`);
    });
  });

export default {};
