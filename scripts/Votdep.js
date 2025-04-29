const hre = require("hardhat");

async function main() {
  
  const Voting = await hre.ethers.getContractFactory("Voting");

  const durationInSeconds = 3600;

  const voting = await Voting.deploy(durationInSeconds);

  await voting.deployed();

  console.log(`✅ Voting deployed at: ${voting.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
