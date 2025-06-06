# Insight Genesis Upload Analysis

This project enables users to upload files and associate them with specific addresses for further analysis on the Insight Genesis platform.

You can connect via either with Metamask or Magic Link.

If there is a referral querystring, it will be automatically applied for the user.

Once a wallet address is acquired, it will redirect you to the facial scanning page (voice and digital footprint coming soon).

Upon completion it will store the analysed results as CID on IPFS, reward the scanner and the referrer with some IGAIr.

For more information, please visit [Insight Genesis's Tech Presentation](https://insightgenesis.my.canva.site/)

Please visit our [example page](https://api.insightgenesis.ai/example) in simple HTML form on how to use our API

![Current Architecture](https://raw.githubusercontent.com/aloycwl/insightgenesis/refs/heads/main/currentarch.png)

## Activate the Server (for self-hosting)

To start the server, run:

```bash
npm install && cd frontend && npm install && cd .. && npm run build
npm start
```

## 1. Call the login popup (to get the wallet address)
```bash
https://api.insightgenesis.ai/lg?t=<TYPE>
```
TYPE - can be different kinds of login method (metamask, google, facebook, apple, github, linkedin, twitter, bitbucket, gitlab, twitch, microsoft, discord)<br><br>
If you choose not to use our login, you can manually set local storage of the browser with a BIP44 wallet address.
```javascript
localStorage.setItem('a', '<ADDRESS>');
// example
localStorage.setItem('a', '0x2e0aCE0129E66A36cee92c5146C73Ec4874d0109');
```
ADDRESS - wallet address of the user who will be used for scanning

## 2. Populating the necessary list element
For all the scanning there are additional fields to be populated to ensure high accuracy and the right scanning type, user will need to select the options accordingly. Using the similar field IDs from our [example page](https://api.insightgenesis.ai/example), import the script below and all the necessary fields will be populated.
```html
<script src="https://cdn.jsdelivr.net/gh/aloycwl/insightgenesis@main/frontend/build/igai.min.js"></script>
```

## 3. Start the face scanning
```curl
curl -X GET https://api.insightgenesis.ai/iframe?g=<GENDER>&y=<AGE> \
  -H "auth: <SECRET_KEY>"
```
GENDER - male or female<br>
AGE - numerical number<br>
SECRET_KEY - the key issued to you<br><br>
Once the url is generated, you can attached using HTML iframe element

```html
<iframe allow="camera;microphone;fullscreen;display-capture" src=<URL> />
```
URL - the iframe acquired from above

## 4. Start the voice scanning
Record the voice in wma, mp3 or webm format for 45 seconds and upload to the following url
```curl
curl -X POST https://api.insightgenesis.ai/v \
-H "auth: <SECRET_KEY>" \
-F "audio=@/path/to/audio.webm;type=audio/webm;filename=<FILE_PATH>" \
-F "v=<VOICE_TYPE>" \
-F "a=<ADDRESS>"
```
SECRET_KEY - the key issued to you<br>
FILE_PATH - the local path of the voice file<br>
VOICE_TYPE - see the example page for the list of selectable voice type<br>
ADDRESS - wallet address of the scanner

## 5. Start the digital footprint scanning
```curl
curl -X GET "https://api.insightgenesis.ai/foot?e=<EMAIL>&c=<COUNTRY_CODE>&n=<MOBILE_NUMBER>" \
-H "auth: <SECRET_KEY>"
```
SECRET_KEY - the key issued to you<br>
COUNTRY_CODE - country code of the mobile number in numeric<br>
MOBILE_NUMBER - mobile number in numeric<br>
SECRET_KEY - the key issued to you

## Deployed in L1X
Insight contract: [0x7d1fe42532cEE53A23cc266c06Ac55e65b0797a9](https://l1xapp.com/explorer/address/v2/0x7d1fe42532cee53a23cc266c06ac55e65b0797a9)\
IGAIr contract: [0x0C1A6816C7C59C2876624d0AdBd53Eb9bb6291bc](https://l1xapp.com/explorer/address/v2/0x0C1A6816C7C59C2876624d0AdBd53Eb9bb6291bc)