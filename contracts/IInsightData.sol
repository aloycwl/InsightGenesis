// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IInsightData {
    function data(uint256) external view returns (string calldata);
    function user(uint256) external view returns (address);
    function userCount(address) external view returns (uint256);
    function count() external view returns (uint256);
    event NewData(uint256 indexed, bytes, address);
    function store(string calldata, address) external;
}