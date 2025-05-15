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
- type — Either audio, faceScan or digitalFootprint
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

### URL: https://insightgenesis.onrender.com/topup

Description:
- For organisation to top up using IGAI token as the credit to use our services
- Connect to the user's EVM wallet.
- Approve IGAIr contract spending.
- Complete the payment process securely.


For more information, please visit: https://insightgenesis.my.canva.site/