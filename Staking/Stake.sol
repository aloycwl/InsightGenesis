// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenStaking is Ownable {
    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 lastClaimed;
    }

    IERC20 public stakingToken;
    uint256 public rewardRate = 10; // 0.1% per day (10000 = 100%)
    uint256 public lockPeriod = 365 days;

    mapping(address => Stake) public stakes;

    constructor() Ownable(msg.sender) {}

    function setStakingToken(address _token) external onlyOwner {
        stakingToken = IERC20(_token);
    }

    function setRewardRate(uint256 _rate) external onlyOwner {
        rewardRate = _rate;
    }

    function setLockPeriod(uint256 _period) external onlyOwner {
        rewardRate = _period;
    }

    function stake(uint256 _amount) external {
        stakingToken.transferFrom(msg.sender, address(this), _amount);
        stakes[msg.sender].amount += _amount;
        stakes[msg.sender].startTime = stakes[msg.sender].lastClaimed = block.timestamp;
    }

    function claimRewards() public {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount > 0, "No active stake");

        uint256 timeElapsed = block.timestamp - userStake.lastClaimed;
        require(timeElapsed >= 1 days, "Can only claim once per day");

        uint256 reward = (userStake.amount * rewardRate * timeElapsed) /
            (100000 * 1 days);
            stakingToken.transfer(msg.sender, reward);

        userStake.lastClaimed = block.timestamp;
    }

    function redeem() external {
        Stake storage userStake = stakes[msg.sender];
        require(
            block.timestamp >= userStake.startTime + lockPeriod,
            "Lock period not over"
        );

        uint256 amount = userStake.amount;
        userStake.amount = 0;

        stakingToken.transfer(msg.sender, amount);
    }
}
