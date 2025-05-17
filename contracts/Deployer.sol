// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IGAI} from "./IGAIr.sol";
import {InsightData} from "./InsightData.sol";

contract Deployer {
    InsightData public insightData;

    constructor() {
        (IGAI _igai, uint _amt) = (new IGAI(), 1e7 ether);
        insightData = new InsightData();
        insightData.setIGAIr(address(_igai));

        _igai.mint(address(this), _amt);
        _igai.approve(address(insightData), _amt);
        insightData.topup(_amt, msg.sender);

        _igai.transferOwnership(msg.sender);
        insightData.transferOwnership(msg.sender);
    }
}
