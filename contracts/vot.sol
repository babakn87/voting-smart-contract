// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Voting {

    uint public votingEndTime;
    address public owner;

    constructor(uint _durationInSeconds) {
        owner = msg.sender;
        votingEndTime = block.timestamp + _durationInSeconds;
    }

    enum Status {
        current,
        stopped
    }

    struct Candidate {
        address id;
        string name;
        uint votes;
        Status status;
    }

    Candidate[] public candidates;

    mapping(address => bool) public hasVoted;
    mapping(address => bool) public registered;

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner.");
        _;
    }

    modifier onlyRegistered() {
        require(registered[msg.sender], "Please register first.");
        _;
    }

    modifier votingOpen() {
        require(block.timestamp < votingEndTime, "Voting period has ended.");
        _;
    }

    function register() external votingOpen {
        require(!registered[msg.sender], "Already registered.");
        registered[msg.sender] = true;
    }

    function addCandidate(address _id, string memory _name) external onlyOwner votingOpen {
        candidates.push(Candidate(_id, _name, 0, Status.current));
    }

    function changeCandidateStatus(uint _id, Status _status) external onlyOwner votingOpen {
        require(_id < candidates.length, "Invalid candidate ID.");
        candidates[_id].status = _status;
    }

    function vote(uint _id) external onlyRegistered votingOpen {
        require(!hasVoted[msg.sender], "You have already voted.");
        require(_id < candidates.length, "Invalid candidate ID.");
        require(candidates[_id].status != Status.stopped, "Voting stopped for this candidate.");
        candidates[_id].votes += 1;
        hasVoted[msg.sender] = true;
    }

    function getWinner() public view returns (Candidate memory) {
        require(candidates.length > 0, "No candidates available.");

        uint maxVotes = candidates[0].votes;
        Candidate memory winner = candidates[0];

        for (uint i = 1; i < candidates.length; i++) {
            if (candidates[i].votes > maxVotes) {
                maxVotes = candidates[i].votes;
                winner = candidates[i];
            }
        }

        return winner;
    }

    function deleteCandidate(uint index) public onlyOwner {
        require(index < candidates.length, "Index out of bounds.");
        candidates[index] = candidates[candidates.length - 1];
        candidates.pop();
    }

    function getAllCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function isVotingOpen() public view returns (bool) {
        return block.timestamp < votingEndTime;
    }
}
