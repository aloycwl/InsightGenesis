// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract InsightData is Ownable {
    constructor() payable Ownable(msg.sender) {}

    uint256 public count;
    uint256 public rewardAmount = 1 ether;
    mapping(address => string) public data;
    mapping(uint256 => address) public user;
    mapping(address => uint256) public userCount;
    IERC20 public igair;
    event NewData(uint256 indexed, string, address);

    function store(string calldata _data, address _account) external {
        // Per user can only do once
        require(
            keccak256(bytes(data[_account])) == keccak256(bytes("")),
            "Record existed"
        );

        igair.transfer(_account, rewardAmount);

        _storage(_data, _account);
    }

    function update(string calldata _data) external {
        _storage(_data, msg.sender);
    }

    function _storage(string calldata _data, address _account) private {
        unchecked {
            uint256 _count = ++count;
            (data[_account], user[_count]) = (_data, _account);

            ++userCount[_account];
            emit NewData(_count, _data, _account);
        }
    }

    function setIGAIr(address _address) external onlyOwner {
        igair = IERC20(_address);
    }

    function setAmount(uint256 _rewardAmount) external onlyOwner {
        rewardAmount = _rewardAmount;
    }
}
