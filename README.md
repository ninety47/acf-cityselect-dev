# Country Selector Widget
Developed to test a widget implementation that will be contributed to the [ACF City Select plugin](https://github.com/Beee4life/acf-city-selector).

## Running it

Once you've cloned or downloaded the repository:

```
$ cd acf-city-select-dev
$ npm install
$ npm start
```

The application listens on the default ExpressJS development port (port 3000). So to see the sample application open your browser and point it to http://localhost:3000.

## Changes need in the 'upstream'
- [ ] Integration of this code into the ACF City Select Javascript assets.
- [ ] Write a new PHP function to return the Country list via an AJAX request rather than hard coded via PHP.
- [ ] Adjust the return JSON formats if needs (the implementation tried to stay as close as possible to the original data format).



