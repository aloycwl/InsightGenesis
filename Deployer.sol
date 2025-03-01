// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IGAI} from "./IGAI.sol";
import {InsightData} from "./InsightData.sol";
import {Rewards} from "./Rewards.sol";

contract Deployer {
    IGAI public igai;
    InsightData public insightData;
    Rewards public rewards;

    constructor() {
        (igai, insightData, rewards) = (
            new IGAI(),
            new InsightData(),
            new Rewards()
        );

        igai.mint(address(rewards), 1e10 ether);
        rewards.setIGAI(address(igai));
        rewards.setInsightData(address(insightData));
        rewards.setAmount(1 ether);

        igai.transferOwnership(msg.sender);
        rewards.transferOwnership(msg.sender);
    }
}
