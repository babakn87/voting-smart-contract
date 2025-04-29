# Voting Smart Contract 🗳️

This is a simple voting system written in Solidity for the Ethereum Virtual Machine (EVM).  
It includes basic functionalities like user registration, candidate management, voting, and winner selection.

## Features
- Register voters
- Add and remove candidates (owner-only)
- Vote for active candidates
- Prevent double voting
- Track voting deadline
- Get the current winner

## Tech Stack
- Language: Solidity `^0.8.28`
- Platform: EVM-compatible chains (tested on Remix)

## How to Use
1. Deploy the contract with a duration (in seconds) for voting.
2. Register voters before the deadline.
3. Add candidates (only owner).
4. Voters can cast their vote once.
5. View the current winner using `getWinner()`.

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Author
👤 Babak
