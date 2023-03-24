

var express = require('express');
var router = express.Router();
​
router.get('/upload', function(req, res, next) {
    res.send('I am blog API');
});
​
module.exports = router;
