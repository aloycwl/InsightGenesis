// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InsightData {
    mapping(uint256 => bytes) public data;
    mapping(uint256 => address) public user;
    mapping(address => uint256) public userCount;
    uint256 public count;
    event NewData(uint256 indexed, bytes, address);

    function store(bytes memory _data) public {
        unchecked {
            (data[count], user[count]) = (_data, msg.sender);
            ++userCount[msg.sender];
            ++count;
            emit NewData(count, _data, msg.sender);
        }
    }
}
