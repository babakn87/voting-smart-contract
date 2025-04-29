const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting Contract", function () {
  let Voting, voting;
  let owner, voter1, voter2, candidate1, candidate2;

  beforeEach(async function () {
    [owner, voter1, voter2, candidate1, candidate2] = await ethers.getSigners();

    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy(3600); // 1 ساعت

    await voting.connect(owner).addCandidate(candidate1.address, "Alice");
    await voting.connect(owner).addCandidate(candidate2.address, "Bob");
  });

  it("should allow users to register", async function () {
    await voting.connect(voter1).register();
    await voting.connect(voter2).register();

    // تلاش برای ثبت‌نام مجدد
    await expect(voting.connect(voter1).register()).to.be.revertedWith("You are already registered.");
  });

  it("should allow registered user to vote", async function () {
    await voting.connect(voter1).register();

    await voting.connect(voter1).voting(0); // رأی به Alice

    const candidate = await voting.can(0);
    expect(candidate.vots).to.equal(1);

    await expect(voting.connect(voter1).voting(1)).to.be.revertedWith("You have already voted.");
  });

  it("should not allow unregistered users to vote", async function () {
    await expect(voting.connect(voter1).voting(0)).to.be.revertedWith("Register now");
  });

  it("only owner can add candidate", async function () {
    await expect(
      voting.connect(voter1).addCandidate(voter1.address, "Test")
    ).to.be.revertedWith("you are not owner");
  });

  it("should return correct winner", async function () {
    await voting.connect(voter1).register();
    await voting.connect(voter2).register();;
    await voting.connect(voter1).voting(0); // Alice
    await voting.connect(voter2).voting(0); // Alice again

    const winner = await voting.connect(voter1).getWinner();
    expect(winner.name).to.equal("Alice");
    expect(winner.vots).to.equal(2);
  });

  it("should delete candidate correctly", async function () {
    await voting.connect(owner).delCondidate(1);
    const candidates = await voting.can(0);
    expect(candidates.name).to.exist;
    await expect(voting.can(1)).to.be.reverted;
  });

});
