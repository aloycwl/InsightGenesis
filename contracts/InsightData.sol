// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract InsightData is Ownable {
    constructor() payable Ownable(msg.sender) {}

    uint256 public count;
    uint256 public rewardAmountFree = 10 ether;
    uint256 public rewardAmountPaid = 100 ether;
    uint256 public fee = 5 ether;
    uint256 public referralAmountFree = 5 ether;
    uint256 public referralAmountPaid = 50 ether;
    mapping(address => string) public data;
    mapping(uint256 => address) public user;
    mapping(address => address) public referral;
    mapping(address => uint256) public userCount;
    mapping(address => bool) public paid;
    IERC20 public igair;
    IERC20 public iusdt;
    event NewData(uint256 indexed, string, address);

    function store(string calldata _data, address _account) external payable {
        if (paid[_account]) {
            paid[_account] = false;

            _sendRewards(_account, rewardAmountPaid, referralAmountPaid);
        } else {
            // Free user can only do once
            require(bytes(data[_account]).length == 0, "Record existed");

            _sendRewards(_account, rewardAmountFree, referralAmountFree);
        }
        _storage(_data, _account);
    }

    function pay() external payable {
        iusdt.transferFrom(msg.sender, owner(), fee);
        paid[msg.sender] = true;
    }

    function _sendRewards(
        address _account,
        uint256 _amountRewards,
        uint256 _amountReferral
    ) private {
        igair.transfer(_account, _amountRewards);
        address _referral = referral[_account];
        if (_referral != address(0))
            igair.transfer(referral[_account], _amountReferral);
    }

    function _storage(string calldata _data, address _account) private {
        unchecked {
            uint256 _count = ++count;
            (data[_account], user[_count]) = (_data, _account);

            ++userCount[_account];
            emit NewData(_count, _data, _account);
        }
    }

    function setReferral(address _referee, address _referral)
        external
        payable
        onlyOwner
    {
        require(referral[_referee] == address(0), "Record existed");
        referral[_referee] = _referral;
    }

    function setIGAIr(address _address) external payable onlyOwner {
        igair = IERC20(_address);
    }

    function setUSDT(address _address) external payable onlyOwner {
        iusdt = IERC20(_address);
    }

    function setRewardFree(uint256 _amount) external payable onlyOwner {
        rewardAmountFree = _amount;
    }

    function setRewardPaid(uint256 _amount) external payable onlyOwner {
        rewardAmountPaid = _amount;
    }

    function setReferralFree(uint256 _amount) external payable onlyOwner {
        referralAmountPaid = _amount;
    }

    function setReferralPaid(uint256 _amount) external payable onlyOwner {
        referralAmountFree = _amount;
    }

    function setPaid(address _address) external payable onlyOwner {
        paid[_address] = true;
    }
}
