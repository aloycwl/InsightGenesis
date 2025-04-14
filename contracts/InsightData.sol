// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InsightData {
    mapping(address => string) public data;
    mapping(uint256 => address) public user;
    mapping(address => uint256) public userCount;
    uint256 public count;
    event NewData(uint256 indexed, string, address);

    function store(string calldata _data, address _account) external {
        unchecked {
            uint _count = ++count;
            (data[_account], user[_count]) = (_data, _account);
            ++userCount[_account];
            emit NewData(_count, _data, _account);
        }
    }
}
