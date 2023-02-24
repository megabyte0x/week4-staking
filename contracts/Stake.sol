// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

import "./Megabyte.sol";

contract Stake is Ownable {
    Megabyte public megabyteToken;

    uint256 public poolValue;

    uint256 public rewardAmount;

    uint256 public startOfStakeTimestamp;

    constructor(uint256 _rewardAmount) {
        rewardAmount = _rewardAmount;
        startOfStakeTimestamp = block.timestamp;
        megabyteToken = new Megabyte();
    }

    mapping(address => uint256) stakedBalances;
    mapping(address => StakeDetails) stakedDetails;

    struct StakeDetails {
        uint256 value;
        uint256 stakedTimestamp;
        uint256 rewardAmountClaimed;
    }

    function stake() public payable {
        uint256 _value = msg.value;
        require(_value > 0, "ERR:ZV");

        if (stakedBalances[msg.sender] == 0) {
            megabyteToken.transferFrom(msg.sender, address(this), _value);

            poolValue += _value;

            StakeDetails memory _stakeDetails = StakeDetails({
                value: _value,
                stakedTimestamp: block.timestamp,
                rewardAmountClaimed: 0
            });
            stakedDetails[msg.sender] = _stakeDetails;
        } else {
            megabyteToken.transferFrom(msg.sender, address(this), _value);

            poolValue += _value;
            stakedDetails[msg.sender].value += _value;
        }
        stakedBalances[msg.sender] += _value;
    }

    function unstake() public {
        uint256 stakedBalance = stakedBalances[msg.sender];
        require(stakedBalance > 0, "ERR:NS");

        stakedBalances[msg.sender] = 0;

        megabyteToken.transferFrom(address(this), msg.sender, stakedBalance);

        delete stakedDetails[msg.sender];
        delete stakedBalances[msg.sender];
    }

    function sendReward() public payable {
        require(rewardAmount > 0, "ERR:RE");
        require(stakedBalances[msg.sender] > 0, "ERR:NS");
        uint256 _rewardAmount = calculateReward(msg.sender);

        if (_rewardAmount < rewardAmount) {
            rewardAmount -= _rewardAmount;
            megabyteToken.mint(msg.sender, _rewardAmount);
        } else {
            megabyteToken.mint(msg.sender, rewardAmount);
        }
    }

    function getRewardAmount() public view returns (uint256) {
        return calculateReward(msg.sender);
    }

    function getCurrentTimestamp() public view returns (uint256) {
        return block.timestamp;
    }

    function getStakedDetails() public view returns (StakeDetails memory) {
        return stakedDetails[msg.sender];
    }

    function getBalanceOf() public view returns (uint256) {
        return megabyteToken.balanceOf(msg.sender);
    }

    function calculateReward(address _user) internal view returns (uint256) {
        StakeDetails memory _stakeDetails = stakedDetails[_user];

        console.log("StakedTimestamp: %s", _stakeDetails.stakedTimestamp);
        console.log("StakedValue: %s", _stakeDetails.value);
        console.log(
            "Reward Already Claimed: %s",
            _stakeDetails.rewardAmountClaimed
        );

        uint256 timeFactor = ((block.timestamp -
            _stakeDetails.stakedTimestamp) * (10 ** 18)) /
            ((block.timestamp - startOfStakeTimestamp));
        console.log("Time Factor: %s", timeFactor);
        uint256 stakeFactor = (_stakeDetails.value * 10 ** 18) / (poolValue);
        console.log("Stake Factor: %s", stakeFactor);
        uint256 rewardAmountLeft = rewardAmount -
            _stakeDetails.rewardAmountClaimed;
        console.log("Reward Amount left: %s", rewardAmountLeft);

        uint256 _rewardAmount = (rewardAmountLeft *
            (timeFactor) *
            stakeFactor) / (10 ** 36);
        console.log("Reward Amount: %s", _rewardAmount);
        return _rewardAmount;
    }

    receive() external payable {}

    fallback() external payable {}
}
