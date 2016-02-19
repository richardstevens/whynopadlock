# HTTPS Crawler

### Setup
```
git clone git@github.com:richardstevens/https_crawler.git
cd https_crawler
npm i
```

### Project setup
You will need to create a new file for your project `example.js` and then from in there you will need to add a basic setup structure to take in pages to test as an array, look at the Usage instructions below.

*Usage*
```
var pages = [
	'https://www.example.com/'
]

var Crawler = require( './crawler.js' )( pages )
```
You can now run this in the console with `node example.js`

Thanks
