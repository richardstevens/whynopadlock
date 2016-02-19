# HTTPS Crawler from WhyNoPadlock

### Setup
```
npm i whynopadlock --save
```

### Project setup
You will need to create a new file for your project `example.js` and then from in there you will need to add a basic setup structure to take in pages to test as an array, look at the Usage instructions below.

*Usage*
```
import WhyNoPadlock from 'whynopadlock';

var pages = [
  'https://www.example.com/'
];

WhyNoPadlock( pages );
```
You can now run this in the console with `node example.js`

Thanks
