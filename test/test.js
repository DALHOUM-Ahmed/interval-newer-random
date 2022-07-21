const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("NewerRandom", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.
  async function deployOneYearLockFixture() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const ONE_GWEI = 1_000_000_000;

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const NewerRandom = await ethers.getContractFactory("newerRandom");
    const NR = await NewerRandom.deploy();

    return { owner, otherAccount, NR };
  }
  it("Should generate 100 different random numbers from 1 to 100", async function () {
    const { owner, NR } = await loadFixture(deployOneYearLockFixture);
    let testObj = {};
    for (let i = 0; i < 100; i++) {
      await NR.connect(owner).getNextRandom();
      let genNumber = await NR.generatedNumber();
      expect(genNumber).to.be.lte(100);
      expect(genNumber).to.be.gte(1);
      expect(testObj[genNumber]).to.be.eq(undefined);
      testObj[genNumber] = true;
      // console.log("newRandom", genNumber);
    }
    console.log("dictionary", testObj);
  });

  it("Should revert if all numbers are generated", async function () {
    const { owner, NR } = await loadFixture(deployOneYearLockFixture);
    for (let i = 0; i < 100; i++) {
      await NR.connect(owner).getNextRandom();
    }
    expect(NR.connect(owner).getNextRandom()).to.be.revertedWith(
      "Used every index"
    );
  });
});
