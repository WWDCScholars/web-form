var router = require('express').Router();

//route
router.get('/', function(req, res, next){
	res.render('formhomepage');
});


module.exports = router;