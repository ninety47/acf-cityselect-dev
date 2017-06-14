/* jshint esversion: 6 */

let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ACF development', prefix: req.app.locals.prefix});
});

module.exports = router;
