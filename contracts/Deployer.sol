// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IGAI} from "./IGAIr.sol";
import {InsightData} from "./InsightData.sol";

contract Deployer {
    InsightData public insightData;

    constructor() {
        IGAI igai = new IGAI();
        insightData = new InsightData();

        /*** Mock USDT, to be remove in deploy ***/
        IGAI usdt = new IGAI();
        usdt.mint(msg.sender, 100 ether);
        /*** End of mock ***/

        insightData.setUSDT(address(usdt));
        insightData.setIGAIr(address(igai));
        igai.mint(address(insightData), 1e10 ether);

        igai.transferOwnership(msg.sender);
        insightData.transferOwnership(msg.sender);
    }
}
