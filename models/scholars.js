var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var scholarSchema = new Schema({
    number: Number,
    
    batchWWDC: [],

    //based on batch (is this still needed)
    numberOfTimesWWDCScholar: Number,

    //About the scholar
    firstName: String,
    lastName: String,
    email: {type: String, lowercase: true},
    profilePic: String,
    smallPicture: String,
    birthday: Date,

    //based on birthday (is this still needed)
    age: { type: Number, min: 12, max: 65 },
    gender: String,
    location: String,
    latitude: Number,
    longtitude: Number,
    shortBio: String,

    //per batch - initial but will change and remove in the future
    acceptanceEmail: String,

    acceptanceEmail2016: String,
    acceptanceEmail2015: String,
    acceptanceEmail2014: String,
    acceptanceEmail2013: String,
    acceptanceEmail2012: String,
    acceptanceEmailEarlier: String,
    
    //app-related
    //initial but willbe changed and remove in the future
    appType: String,
    appStoreSubmissionLink: String,
    
    //per batch 
    //initial but will be changed and removed in the future
    screenshotOne: String,
    screenshotTwo: String,
    screenshotThree: String,
    screenshotFour: String,

    videoLink: String,
    githubLinkApp: String,

    //2016
    appType2016: String,
    appStoreSubmissionLink2016: String,
    screenshotOne2016: String,
    screenshotTwo2016: String,
    screenshotThree2016: String,
    screenshotFour2016: String,

    videoLink2016: String,
    githubLinkApp2016: String,
    
    //2015
    screenshotOne2015: String,
    screenshotTwo2015: String,
    screenshotThree2015: String,
    screenshotFour2015: String,

    videoLink2015: String,
    githubLinkApp2015: String,

    //2014
    screenshotOne2014: String,
    screenshotTwo2014: String,
    screenshotThree2014: String,
    screenshotFour2014: String,

    videoLink2014: String,
    githubLinkApp2014: String,

    //2013
    screenshotOne2013: String,
    screenshotTwo2013: String,
    screenshotThree2013: String,
    screenshotFour2013: String,

    videoLink2013: String,
    githubLinkApp2013: String,

    //2012
    screenshotOne2012: String,
    screenshotTwo2012: String,
    screenshotThree2012: String,
    screenshotFour2012: String,

    videoLink2012: String,
    githubLinkApp2012: String,

    //Earlier
    screenshotOneEarlier: String,
    screenshotTwoEarlier: String,
    screenshotThreeEarlier: String,
    screenshotFourEarlier: String,

    videoLinkEarlier: String,
    githubLinkAppEarlier: String,

    //how you can connect
    twitter: String,
    facebook: String,
    github: String,
    linkedin: String,
    website: String,
    itunes: String,
    iMessage: String,

    //for the chat password
    password: { type: String, required: true, default: 'a1003c2f07c09d4ea39e7a72efa786bbc6d6ba6ab90b8a6604c20c15501cbf88' },

    status: String,
    statusComment: String,
    createdAt: {type: Date, default:Date.now},
    approvedOn: {type: Date},
    approvedBy: String,
    updatedBy: String,
    updatedAt: {type: Date, default:Date.now}
});

module.exports = mongoose.model('Scholar', scholarSchema);
