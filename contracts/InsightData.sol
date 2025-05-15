// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract InsightData is Ownable {
    constructor(address _addr, uint256 _amt) payable Ownable(msg.sender) {
        org[_addr] += _amt;
    }

    uint256 public AmtReward = 10 ether;
    uint256 public AmtReferral = 5 ether;
    uint256 public fee = 5 ether;
    mapping(address => uint256) public org;
    mapping(address => address) public referral;
    IERC20 public igair;

    function pay(uint256 _amt) external payable {
        igair.transferFrom(msg.sender, address(this), _amt);
        org[msg.sender] += _amt;
    }

    function store(address _addr, address _coy) external payable onlyOwner {
        // Transfer to user and referrral
        igair.transfer(_addr, AmtReward);
        address _from = referral[_addr];
        if (_from != address(0)) _from = owner();
        igair.transfer(_from, AmtReferral);

        // Check balance and deduct
        (uint256 _amt, uint256 _fee) = (org[_coy], AmtReward + AmtReferral + fee);
        require(_amt >= _fee, "Insufficient balance");
        org[_coy] -= _fee;
    }

    function setRef(address _to, address _from) external payable onlyOwner {
        require(referral[_to] == address(0), "Record existed");
        referral[_to] = _from;
    }

    function setIGAIr(address _addr) external payable onlyOwner {
        igair = IERC20(_addr);
    }

    function setAmtReward(uint256 _amt) external payable onlyOwner {
        AmtReward = _amt;
    }

    function setAmtReferral(uint256 _amt) external payable onlyOwner {
        AmtReferral = _amt;
    }

    function withdraw(uint256 _amt) external payable onlyOwner {
        igair.transfer(owner(), _amt);
    }
}
