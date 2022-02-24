"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
let tokenFactory, token, value;
beforeEach(async () => {
    tokenFactory = await hardhat_1.ethers.getContractFactory("DevbulatERC20");
    token = await tokenFactory.deploy("DevbulatERC20", "ERC20", 10);
    value = hardhat_1.ethers.utils.parseUnits("2", "wei");
    await token.deployed();
});
describe("DevbulatERC20 token", function () {
    it("Should return token name", async function () {
        chai_1.expect(await token.name()).to.equal("DevbulatERC20");
    });
    it("Should return token symbol", async function () {
        chai_1.expect(await token.symbol()).to.equal("ERC20");
    });
    it("Should return token decimals", async function () {
        chai_1.expect(await token.decimals()).to.equal(10);
    });
    it("Should return totalSupply", async function () {
        const [owner] = await hardhat_1.ethers.getSigners();
        await token.connect(owner).mint(owner.address, value);
        chai_1.expect(await token.totalSupply()).to.equal(value);
    });
    it("Should mint balance for owner", async function () {
        const [owner] = await hardhat_1.ethers.getSigners();
        await token.connect(owner).mint(owner.address, value);
        chai_1.expect(await token.balanceOf(owner.address)).to.equal(value);
    });
    it("Shouldn't mint balance because is not owner", async function () {
        const [, addr1] = await hardhat_1.ethers.getSigners();
        chai_1.expect(token.connect(addr1).mint(addr1.address, value)).to.be.revertedWith("You are not owner");
    });
    it("Should burn balance for owner", async function () {
        const [owner] = await hardhat_1.ethers.getSigners();
        await token.connect(owner).mint(owner.address, value);
        chai_1.expect(await token.balanceOf(owner.address)).to.equal(value);
        await token.connect(owner).burn(owner.address, value);
        chai_1.expect(await token.balanceOf(owner.address)).to.equal(hardhat_1.ethers.utils.parseUnits("0", "wei"));
    });
    it("Shouldn't burn balance because is not owner", async function () {
        const [owner, addr1] = await hardhat_1.ethers.getSigners();
        await token.connect(owner).mint(owner.address, value);
        chai_1.expect(await token.balanceOf(owner.address)).to.equal(value);
        chai_1.expect(token.connect(addr1).burn(addr1.address, value)).to.be.revertedWith("You are not owner");
    });
    it("Should transfer amount", async function () {
        const [owner, addr1] = await hardhat_1.ethers.getSigners();
        const connected = await token.connect(owner);
        await connected.mint(owner.address, value);
        await connected.transfer(addr1.address, hardhat_1.ethers.utils.parseUnits("1", "wei"));
        chai_1.expect(await token.balanceOf(owner.address)).to.equal(hardhat_1.ethers.utils.parseUnits("1", "wei"));
        chai_1.expect(await token.balanceOf(addr1.address)).to.equal(hardhat_1.ethers.utils.parseUnits("1", "wei"));
    });
    it("Shouldn't transfer amount", async function () {
        const [owner, addr1] = await hardhat_1.ethers.getSigners();
        const connected = await token.connect(owner);
        await connected.mint(owner.address, value);
        chai_1.expect(connected.transfer(addr1.address, hardhat_1.ethers.utils.parseUnits("10", "wei"))).to.be.revertedWith("Not enough tokens");
    });
    it("Should add approve", async function () {
        const [owner, addr1] = await hardhat_1.ethers.getSigners();
        const connected = await token.connect(owner);
        await connected.approve(addr1.address, value);
        chai_1.expect(await connected.allowance(owner.address, addr1.address)).to.be.equal(value);
    });
    it("Should increase allowance", async function () {
        const [owner, addr1] = await hardhat_1.ethers.getSigners();
        const connected = await token.connect(owner);
        await connected.approve(addr1.address, value);
        chai_1.expect(await connected.allowance(owner.address, addr1.address)).to.be.equal(value);
        await connected.increaseAllowance(addr1.address, value);
        chai_1.expect(await connected.allowance(owner.address, addr1.address)).to.be.equal(hardhat_1.ethers.utils.parseUnits("4", "wei"));
    });
    it("Should decrease allowance", async function () {
        const [owner, addr1] = await hardhat_1.ethers.getSigners();
        const connected = await token.connect(owner);
        await connected.approve(addr1.address, value);
        chai_1.expect(await connected.allowance(owner.address, addr1.address)).to.be.equal(value);
        await connected.decreaseAllowance(addr1.address, hardhat_1.ethers.utils.parseUnits("1", "wei"));
        chai_1.expect(await connected.allowance(owner.address, addr1.address)).to.be.equal(hardhat_1.ethers.utils.parseUnits("1", "wei"));
    });
    it("Should transferFrom", async function () {
        const [owner, addr1] = await hardhat_1.ethers.getSigners();
        const connected = await token.connect(owner);
        await connected.mint(owner.address, value);
        await connected.approve(addr1.address, value);
        await connected.transferFrom(owner.address, addr1.address, hardhat_1.ethers.utils.parseUnits("1", "wei"));
        chai_1.expect(await token.balanceOf(owner.address)).to.equal(hardhat_1.ethers.utils.parseUnits("1", "wei"));
        chai_1.expect(await token.balanceOf(addr1.address)).to.equal(hardhat_1.ethers.utils.parseUnits("1", "wei"));
        chai_1.expect(await connected.allowance(owner.address, addr1.address)).to.be.equal(hardhat_1.ethers.utils.parseUnits("1", "wei"));
    });
    it("Shouldn't transferFrom because of approval", async function () {
        const [owner, addr1] = await hardhat_1.ethers.getSigners();
        const connected = await token.connect(owner);
        await connected.mint(owner.address, value);
        chai_1.expect(connected.transferFrom(owner.address, addr1.address, hardhat_1.ethers.utils.parseUnits("1", "wei"))).to.be.revertedWith("Not approved");
    });
    it("Shouldn't transferFrom because not enough tokens", async function () {
        const [owner, addr1] = await hardhat_1.ethers.getSigners();
        const connected = await token.connect(owner);
        await connected.approve(addr1.address, value);
        chai_1.expect(connected.transferFrom(owner.address, addr1.address, value)).to.be.revertedWith("Not enough tokens");
    });
});
