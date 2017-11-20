[![Circle CI](https://circleci.com/gh/richardstevens/whynopadlock/tree/master.svg?style=shield)](https://circleci.com/gh/richardstevens/whynopadlock/tree/master)

# HTTPS Crawler from WhyNoPadlock

### Setup
```
npm i whynopadlock --save
```

### Project setup
You will need to create a new file for your project `example.js` and then from in there you will need to add a basic setup structure to take in pages to test as an array, look at the Usage instructions below.

*Usage*
*whynopadlock*
```
import { whynopadlock } from 'whynopadlock';

var pages = [
  'https://www.example.com/'
];

whynopadlock( pages );
```

*insecurity*
import { insecurity } from 'whynopadlock';

var pages = [
  'https://www.example.com/'
];

insecurity({
  pages,
  cb: () => {},
  whitelist: [
    /w3\.com/
  ],
  timeout: 2000
});
```

You can now run either of these in the console with `node example.js`

Thanks
