var router = require('express').Router();
var multer = require('multer');
var multerS3 = require('multer-s3');

var path = require('path');
var url  = require('url');

var Post = require('../models/posts');

var upload = multer({
    storage: multerS3({
        dirname: process.env.POST_DIRNAME,
        bucket: process.env.S3_BUCKETNAME,
        secretAccessKey: process.env.S3_SECRET,
        accessKeyId: process.env.S3_ACCESS_KEY,
        region: process.env.REGION,
        filename: function (req, file, callback) {
	  	var blogPost = req.body.title;
	    callback(null, '2016_' + blogPost + path.extname(file.originalname));
	  	},
        contentType: multerS3.AUTO_CONTENT_TYPE
    })
}).fields([{name: 'images', maxCount: 1}]);

//route
router.get('/addpost', function(req, res, next){
	res.render('addpostform');
});

router.post('/addpost', function(req, res, next){
	var post = new Post();

	upload(req, res, function(err) {

		var s3BucketURL = process.env.S3_URL;
		var imageNo = 0;

			if (!req.files.images){

			} else {
				var imageNameImages = req.files.images[0].key;
				post.images = s3BucketURL + imageNameImages;

				imageNo++;
				console.log(imageNo);
			}

		post.title = req.body.title;
		post.content = req.body.content;
		post.videoLink = req.body.videoLink;
		post.scholarName = req.body.scholarName;

		post.scholarLink = req.body.scholarLink;

		var parsingURL = req.body.scholarLink;
		var partsURL = url.parse(parsingURL, true);
		post.scholar = partsURL.query.page;

		post.email = req.body.email;

		var tagStrings = req.body.tags;
		var splitCondition = /\s*,\s*/;
		var tagsArray = tagStrings.split(splitCondition);
		post.tags = tagsArray;


		post.save(function(err){
		if (err) return next (err);
		res.redirect('/thankyou');
		});

	});

});

router.get('/thankyou', function(req, res, next){
	res.render('thankyou');
	//check out 2015, want to contribute.... ?
});

module.exports = router;
