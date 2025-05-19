# Insight Genesis Upload Analysis

This project enables users to upload files and associate them with specific addresses for further analysis on the Insight Genesis platform.

You can connect via either with Metamask or Magic Link.

If there is a referral querystring, it will be automatically applied for the user.

Once a wallet address is acquired, it will redirect you to the facial scanning page (voice and digital footprint coming soon).

Upon completion it will store the analysed results as CID on IPFS, reward the scanner and the referrer with some IGAIr.

For more information, please visit [Insight Genesis's Tech Presentation](https://insightgenesis.my.canva.site/)

To see button examples: please visit [Current Githug Page Example](https://aloycwl.github.io/insightgenesis/example.html)

![Current Architecture](https://raw.githubusercontent.com/aloycwl/insightgenesis/refs/heads/main/currentarch.png)

## Activate the Server

To start the server, run:

```bash
npm start
```

## 1. To load from Metamask

Copy and paste the following HTML code:

```html
<!doctype html>
<html lang="en">
<body>
  <form id="m" action="/mm">
    <button type="submit">Example 2: Scan with Metamask</button>
  </form>

  <script>
    const r = new URLSearchParams(window.location.search).get('ref');
    a('m');
    function a(i) {
      const f = document.getElementById(i);
      f.addEventListener('submit', (e) => {
        e.preventDefault();
        const u = new URL(f.action, window.location.origin),
          c = document.getElementById('c');
        if (c.value) u.searchParams.set('email', c.value);
        if (r) u.searchParams.set('ref', r);
        f.action = u.toString();
        window.open(f.action, '_blank');
      });
    }
  </script>
</body>
</html>
```

## 2. To load from Magic Link

Copy and paste the following HTML code:

```html
<!doctype html>
<html lang="en">
<body>
  <form id="l" action="/ml" method="get">
    <button type="submit">Example 1: Scan with Magic Link</button>
    <input id="c" placeholder="Enter your email" required />
  </form>
  
  <script>
    const r = new URLSearchParams(window.location.search).get('ref');
    a('l');
    function a(i) {
      const f = document.getElementById(i);
      f.addEventListener('submit', (e) => {
        e.preventDefault();
        const u = new URL(f.action, window.location.origin),
          c = document.getElementById('c');
        if (c.value) u.searchParams.set('email', c.value);
        if (r) u.searchParams.set('ref', r);
        f.action = u.toString();
        window.open(f.action, '_blank');
      });
    }
  </script>
</body>
</html>

```

## 3. Topup credit to produce reports

### URL: https://insightgenesis.onrender.com/topup{?amt=AMT}

Description:
- For organisation to top up using IGAI token as the credit to use our services
- Connect to the user's EVM wallet.
- Approve IGAIr contract spending.
- Complete the payment process securely.
- Default top up is 100 IGAIr
- Optional, if querystring amt is specific, the top up amount will be changed to AMT

## Deploy Live @ L1X
Insight contract: [0x7d1fe42532cEE53A23cc266c06Ac55e65b0797a9](https://l1xapp.com/explorer/address/v2/0x7d1fe42532cee53a23cc266c06ac55e65b0797a9)\
IGAIr contract: [0x0C1A6816C7C59C2876624d0AdBd53Eb9bb6291bc](https://l1xapp.com/explorer/address/v2/0x0C1A6816C7C59C2876624d0AdBd53Eb9bb6291bc)