# stock-fetching-app

### Usage

Run API in one terminal
```bash
$ cd api
$ npm install
$ npm start
```

Run frontend in another terminal
```bash
$ cd client
$ npm install
$ npm start
$ open http://localhost:4200/stocks
```

Now you can place an URL in the input field, or use the frontend "sdk" in the terminal, for example:
```javascript
ng
  .getComponent(document.querySelector("body > app-root > app-stocks"))
  .createPool({
    pullURL: 'http://api.marketstack.com/v1/intraday?access_key=YOUR_ACCESS_KEY&symbols=aapl&limit=1',
    stockVariationThreshold: 0,
    highFrequencyPoolingInterval: 2000,
    lowFrequencyPoolingInterval: 15000,
  });
```

### Examples
<p align="center">
  <img src="https://user-images.githubusercontent.com/3648665/114493385-da308000-9bf0-11eb-8098-c837265224a9.png" alt="First page" width="240">
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/3648665/114493450-f92f1200-9bf0-11eb-847e-08b95fb16d5f.png" alt="Fetching results" width="240">
</p>
