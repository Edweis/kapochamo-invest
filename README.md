# kapochamo-invest

# Ressources
[Install and setup Charles](https://medium.com/@daptronic/the-android-emulator-and-charles-proxy-a-love-story-595c23484e02)

```bash
curl -H 'Host: www.binance.com' -H 'clienttype: android' -H 'versioncode: 3163' -H 'versionname: 1.21.1' -H 'bnc-time-zone: America/New_York' -H 'bnc-uuid: 779b562f851f102ff2ba3819b0d8c383' -H 'lang: en' -H 'referer: https://www.binance.com/' -H 'cache-control: no-cache, no-store' -H 'user-agent: okhttp/3.12.6' --compressed 'https://www.binance.com/gateway-api/v1/public/market/all?page=1&rows=3'
```

```bash
curl -H 'Host: www.binance.com' -H 'clienttype: android' -H 'versioncode: 3163' -H 'versionname: 1.21.1' -H 'imei: denied' -H 'os: Android_vbox86p' -H 'lang: en' -H 'buildsdkint: 23' -H 'referer: https://www.binance.com/' -H 'cache-control: no-cache, no-store' -H 'user-agent: okhttp/3.12.6' --compressed 'https://www.binance.com/gateway-api/v1/public/common/config/android-version'
```
returns
```
{
	"code": "000000",
	"message": null,
	"messageDetail": null,
	"data": {
		"updateContent": "V1.21.1 update : #- Buy Crypto with Visa & Mastercard credit & debit cards #- Support Options Trading #- Improve the network environment #- Support Futures Hedge Mode #Please upgrade immediately for better experience.",
		"versionCode": "3163",
		"versionName": "1.21.1",
		"downloadUrl": "https://binance-1259603563.file.myqcloud.com/pack/Binance.apk",
		"ifUpdate": "false"
	},
	"success": true
}
```
---------
```curl -H 'Host: www.binance.com' -H 'clienttype: android' -H 'versioncode: 3163' -H 'versionname: 1.21.1' -H 'bnc-time-zone: America/New_York' -H 'bnc-uuid: 779b562f851f102ff2ba3819b0d8c383' -H 'lang: en' -H 'referer: https://www.binance.com/' -H 'cache-control: no-cache, no-store' -H 'user-agent: okhttp/3.12.6' --compressed 'https://www.binance.com/exchange-api/v1/public/asset-service/product/get-products'```

returns
```
{
	"code": "000000",
	"message": null,
	"messageDetail": null,
	"data": [{
		"s": "BNBBTC",
		"st": "TRADING",
		"b": "BNB",
		"q": "BTC",
		"ba": "",
		"qa": "฿",
		"i": 0.01000000,
		"ts": 0.0000001,
		"an": "BNB",
		"qn": "Bitcoin",
		"o": 0.0020615,
		"h": 0.0022055,
		"l": 0.0020480,
		"c": 0.0021826,
		"v": 2091080.4200000,
		"qv": 4483.27608046,
		"y": 0.0,
		"as": 2091080.42,
		"pm": "BTC",
		"pn": "BTC",
		"cs": 152665937
	}, ...
	```
