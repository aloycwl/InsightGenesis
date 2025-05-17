# Insight Genesis Upload Analysis

This project enables users to upload files and associate them with specific addresses for further analysis on the Insight Genesis platform.

![Current Architecture](https://raw.githubusercontent.com/aloycwl/insightgenesis/refs/heads/main/currentarch.png)

## Activate the Server

To start the server, run:

```bash
npm start
```

## 1. Upload User Report
```bash
curl -X POST https://insightgenesis.onrender.com/upload \
  -H "Content-Type: application/json" \
  -H "Authorization: <key>" \
  -H "type: <type>" \
  -H "addr: <addr>" \
  -d "dataJson"
```

Description:
- Uploads a user's report file to IPFS and stores the resulting CID on-chain, linked to the given <ADDRESS>.
- key - The API key to use this service.
- type — Either 0: digitalFootprint, 1: faceScan, 2+: audio
- addr — The wallet address associated with the report.
- dataJson - The data file returned from Insight Genie


## 2. Set Referral
```bash
curl -X POST https://insightgenesis.onrender.com/referral \
-H "Authorization: <key>" \
-H "to: <to>" \
-H "from: <from>" 
```

Description:
- Permanently assigns <from> as the referrer of <to>.
- key - The API key to use this service.
- to — The address of the referee.
- from — The address of the referral.

## 3. Topup credit to produce reports

### URL: https://insightgenesis.onrender.com/topup{?amt=<amt>}

Description:
- For organisation to top up using IGAI token as the credit to use our services
- Connect to the user's EVM wallet.
- Approve IGAIr contract spending.
- Complete the payment process securely.
- Default top up is 100 IGAIr
- [Optional] if querystring amt is specific, the top up amount will be changed to <amt>


For more information, please visit: https://insightgenesis.my.canva.site/

Deploy Live @ L1X
Insight contract: 0x7d1fe42532cEE53A23cc266c06Ac55e65b0797a9
IGAIr contract: 0x0C1A6816C7C59C2876624d0AdBd53Eb9bb6291bc