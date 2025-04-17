// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IGAI} from "./IGAIr.sol";
import {InsightData} from "./InsightData.sol";

contract Deployer {
    IGAI public igai;
    InsightData public insightData;

    constructor() {
        (igai, insightData) = (new IGAI(), new InsightData());

        igai.mint(address(insightData), 1e10 ether);
        insightData.setIGAIr(address(igai));

        igai.transferOwnership(msg.sender);
        insightData.transferOwnership(msg.sender);
    }
}
