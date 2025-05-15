// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IGAI} from "./IGAIr.sol";
import {InsightData} from "./InsightData.sol";

contract Deployer {
    InsightData public insightData;

    constructor() {
        (IGAI _igai, uint _amt) = (new IGAI(), 1e4 ether);
        insightData = new InsightData(msg.sender, _amt);

        insightData.setIGAIr(address(_igai));
        _igai.mint(address(insightData), 1e3 ether);

        _igai.transferOwnership(msg.sender);
        insightData.transferOwnership(msg.sender);
    }
}
