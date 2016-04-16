var router = require('express').Router();
var multer = require('multer');
var multerS3 = require('multer-s3');

var path = require('path');
var fs = require('fs');

var Scholar = require('../models/scholars');

var upload = multer({
    storage: multerS3({
        dirname: process.env.SCHOLAR_DIRNAME,
        bucket: process.env.S3_BUCKETNAME,
        secretAccessKey: process.env.S3_SECRET,
        accessKeyId: process.env.S3_ACCESS_KEY,
        region: process.env.REGION,
        filename: function (req, file, callback) {
	  	var scholarName = req.body.firstName + req.body.lastName;
	    callback(null, '2015_' + scholarName + '_' + file.fieldname + path.extname(file.originalname));
	  	},
        contentType: multerS3.AUTO_CONTENT_TYPE
    })
}).fields([{name: 'acceptanceEmail', maxCount: 1},{name: 'profilePic', maxCount: 1},{name: 'screenshotOne', maxCount: 1},{name: 'screenshotTwo', maxCount: 1},{name: 'screenshotThree', maxCount: 1},{name: 'screenshotFour', maxCount: 1}]);

//route
router.get('/addscholar', function(req, res, next){
	res.render('addscholarform');
});

router.post('/addscholar', function(req, res, next){
	var scholar = new Scholar();

	//Middleware
	upload(req, res, function(err) {

		var s3BucketURL = process.env.S3_URL;
		var imageNo = 0;

			if (!req.files.acceptanceEmail){

			} else {
				var imageNameAcceptanceEmail = req.files.acceptanceEmail[0].key;
				scholar.acceptanceEmail = s3BucketURL + imageNameAcceptanceEmail;

				imageNo++;
				console.log(imageNo);
			}

			if (!req.files.profilePic){

			} else {
				var imageNameProfilePic = req.files.profilePic[0].key;
				scholar.profilePic = s3BucketURL + imageNameProfilePic;

				imageNo++;
				console.log(imageNo);
			}

			if (!req.files.screenshotOne){

			} else {
				var imageNameScreenshotOne = req.files.screenshotOne[0].key;
				scholar.screenshotOne = s3BucketURL + imageNameScreenshotOne;

				imageNo++;
				console.log(imageNo);
			}


			if (!req.files.screenshotTwo){

			} else {
				var imageNameScreenshotTwo = req.files.screenshotTwo[0].key;
				scholar.screenshotTwo = s3BucketURL + imageNameScreenshotTwo;

				imageNo++;
				console.log(imageNo);
			}

			if (!req.files.screenshotThree){

			} else {
				var imageNameScreenshotThree = req.files.screenshotThree[0].key;
				scholar.screenshotThree = s3BucketURL + imageNameScreenshotThree;

				imageNo++;
				console.log(imageNo);
			}

			if (!req.files.screenshotFour){

			} else {
				var imageNameScreenshotFour = req.files.screenshotFour[0].key;
				scholar.screenshotFour = s3BucketURL + imageNameScreenshotFour;

				imageNo++;
				console.log(imageNo);
			}

			scholar.firstName = req.body.firstName;
			scholar.lastName = req.body.lastName;
			scholar.email = req.body.email;
			scholar.birthday = req.body.birthday;
			scholar.age = req.body.age;
			scholar.gender = req.body.gender;
			scholar.iMessage = req.body.iMessageInfo;

			// Move Longtitude Latitude generator in the Admin Dashboard
			scholar.location = req.body.location;

			if (!req.body.videoLink) {


			} else {

				if (req.body.videoLink.substring(0,4) == 'http') {
					scholar.videoLink = req.body.videoLink;
				} else {
					scholar.videoLink = "http://" + req.body.videoLink;
				}
			}

			if (!req.body.githubLinkApp) {
				
			} else {

				if (req.body.githubLinkApp.substring(0,4) == 'http') {
					scholar.githubLinkApp = req.body.githubLinkApp;
				} else {
					scholar.githubLinkApp = "http://" + req.body.githubLinkApp;
				}
			
			}
			
			if (!req.body.twitter) {
				
			} else {

				if (req.body.twitter.substring(0,4) == 'http') {
					scholar.twitter = req.body.twitter;
				} else {
					scholar.twitter = "http://" + req.body.twitter;
				}

			}

			if (!req.body.facebook) {
				
			} else {

				if (req.body.facebook.substring(0,4) == 'http') {
					scholar.facebook = req.body.facebook;
				} else {
					scholar.facebook = "http://" + req.body.facebook;
				}
				
			}

			if (!req.body.github) {
				
			} else {

				if (req.body.github.substring(0,4) == 'http') {
					scholar.github = req.body.github;
				} else {
					scholar.github = "http://" + req.body.github;
				}

			}
			
			if (!req.body.linkedin) {
				
			} else {

				if (req.body.linkedin.substring(0,4) == 'http') {
					scholar.linkedin = req.body.linkedin;
				} else {
					scholar.linkedin = "http://" + req.body.linkedin;
				}

			}

			if (!req.body.website) {
				
			} else {

				if (req.body.website.substring(0,4) == 'http') {
					scholar.website = req.body.website;
				} else {
					scholar.website = "http://" + req.body.website;
				}

			}
			
			if (!req.body.itunes) {
				
			} else {

				if (req.body.itunes.substring(0,4) == 'http') {
					scholar.itunes = req.body.itunes;
				} else {
					scholar.itunes = "http://" + req.body.itunes;
				}
				
			}

			
			// batchWWDC
			var batchWWDCItemsChecked = req.body.batchWWDC;
			if (batchWWDCItemsChecked.constructor === Array){
				console.log(batchWWDCItemsChecked,batchWWDCItemsChecked.length);
				scholar.batchWWDC = batchWWDCItemsChecked;
				scholar.numberOfTimesWWDCScholar = batchWWDCItemsChecked.length;

			} else {
				var batchWWDCArray = [];
				batchWWDCArray.push(req.body.batchWWDC);
				console.log(batchWWDCArray,batchWWDCArray.length);

				scholar.batchWWDC = batchWWDCItemsChecked;
				scholar.numberOfTimesWWDCScholar = batchWWDCArray.length;
			}
	
			scholar.shortBio = req.body.shortBio;
			scholar.status = "Pending";
			scholar.statusComment = "Submitted: " + Date.now() + '. <br>Admin, do something.';

				scholar.save(function(err){
					if (err) return next (err);
					console.log("Scholar " + req.body.firstName + " " + req.body.lastName + " of Batch " + batchWWDCItemsChecked + " Saved");
					res.redirect('/thankyou');
				});
					
	});
	
});

router.get('/thankyou', function(req, res, next){
	res.render('thankyou');
});

module.exports = router;