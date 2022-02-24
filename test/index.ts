import { expect } from "chai";
import { BigNumber, Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";

let tokenFactory: ContractFactory, token: Contract, value: BigNumber;

beforeEach(async () => {
  tokenFactory = await ethers.getContractFactory("DevbulatERC20");
  token = await tokenFactory.deploy("DevbulatERC20", "ERC20", 10);
  value = ethers.utils.parseUnits("2", "wei");
  await token.deployed();
});

describe("DevbulatERC20 token", function () {
  it("Should return token name", async function () {
    expect(await token.name()).to.equal("DevbulatERC20");
  });

  it("Should return token symbol", async function () {
    expect(await token.symbol()).to.equal("ERC20");
  });

  it("Should return token decimals", async function () {
    expect(await token.decimals()).to.equal(10);
  });

  it("Should return totalSupply", async function () {
    const [owner] = await ethers.getSigners();
    await token.connect(owner).mint(owner.address, value);

    expect(await token.totalSupply()).to.equal(value);
  });

  it("Should mint balance for owner", async function () {
    const [owner] = await ethers.getSigners();
    await token.connect(owner).mint(owner.address, value);

    expect(await token.balanceOf(owner.address)).to.equal(value);
  });

  it("Shouldn't mint balance because is not owner", async function () {
    const [, addr1] = await ethers.getSigners();

    expect(token.connect(addr1).mint(addr1.address, value)).to.be.revertedWith(
      "You are not owner"
    );
  });

  it("Should burn balance for owner", async function () {
    const [owner] = await ethers.getSigners();
    await token.connect(owner).mint(owner.address, value);

    expect(await token.balanceOf(owner.address)).to.equal(value);

    await token.connect(owner).burn(owner.address, value);

    expect(await token.balanceOf(owner.address)).to.equal(
      ethers.utils.parseUnits("0", "wei")
    );
  });

  it("Shouldn't burn balance because is not owner", async function () {
    const [owner, addr1] = await ethers.getSigners();
    await token.connect(owner).mint(owner.address, value);

    expect(await token.balanceOf(owner.address)).to.equal(value);
    expect(token.connect(addr1).burn(addr1.address, value)).to.be.revertedWith(
      "You are not owner"
    );
  });

  it("Should transfer amount", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const connected = await token.connect(owner);
    await connected.mint(owner.address, value);
    await connected.transfer(
      addr1.address,
      ethers.utils.parseUnits("1", "wei")
    );

    expect(await token.balanceOf(owner.address)).to.equal(
      ethers.utils.parseUnits("1", "wei")
    );
    expect(await token.balanceOf(addr1.address)).to.equal(
      ethers.utils.parseUnits("1", "wei")
    );
  });

  it("Shouldn't transfer amount", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const connected = await token.connect(owner);
    await connected.mint(owner.address, value);

    expect(
      connected.transfer(addr1.address, ethers.utils.parseUnits("10", "wei"))
    ).to.be.revertedWith("Not enough tokens");
  });

  it("Should add approve", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const connected = await token.connect(owner);
    await connected.approve(addr1.address, value);

    expect(await connected.allowance(owner.address, addr1.address)).to.be.equal(
      value
    );
  });

  it("Should increase allowance", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const connected = await token.connect(owner);
    await connected.approve(addr1.address, value);

    expect(await connected.allowance(owner.address, addr1.address)).to.be.equal(
      value
    );

    await connected.increaseAllowance(addr1.address, value);

    expect(await connected.allowance(owner.address, addr1.address)).to.be.equal(
      ethers.utils.parseUnits("4", "wei")
    );
  });

  it("Should decrease allowance", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const connected = await token.connect(owner);
    await connected.approve(addr1.address, value);

    expect(await connected.allowance(owner.address, addr1.address)).to.be.equal(
      value
    );

    await connected.decreaseAllowance(
      addr1.address,
      ethers.utils.parseUnits("1", "wei")
    );

    expect(await connected.allowance(owner.address, addr1.address)).to.be.equal(
      ethers.utils.parseUnits("1", "wei")
    );
  });

  it("Should transferFrom", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const connected = await token.connect(owner);

    await connected.mint(owner.address, value);
    await connected.approve(addr1.address, value);
    await connected.transferFrom(
      owner.address,
      addr1.address,
      ethers.utils.parseUnits("1", "wei")
    );

    expect(await token.balanceOf(owner.address)).to.equal(
      ethers.utils.parseUnits("1", "wei")
    );
    expect(await token.balanceOf(addr1.address)).to.equal(
      ethers.utils.parseUnits("1", "wei")
    );
    expect(await connected.allowance(owner.address, addr1.address)).to.be.equal(
      ethers.utils.parseUnits("1", "wei")
    );
  });

  it("Shouldn't transferFrom because of approval", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const connected = await token.connect(owner);
    await connected.mint(owner.address, value);

    expect(
      connected.transferFrom(
        owner.address,
        addr1.address,
        ethers.utils.parseUnits("1", "wei")
      )
    ).to.be.revertedWith("Not approved");
  });

  it("Shouldn't transferFrom because not enough tokens", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const connected = await token.connect(owner);
    await connected.approve(addr1.address, value);

    expect(
      connected.transferFrom(owner.address, addr1.address, value)
    ).to.be.revertedWith("Not enough tokens");
  });
});
