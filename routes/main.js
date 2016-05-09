var router = require('express').Router();

//route
router.get('/main', function(req, res, next){
	res.render('formhomepage');
});


module.exports = router;