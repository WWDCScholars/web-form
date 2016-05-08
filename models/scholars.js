var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var scholarSchema = new Schema({
    number: Number,
    batchWWDC: [],
    firstName: String,
    lastName: String,
    acceptanceEmail: String,
    email: {type: String, lowercase: true},
    profilePic: String,
    smallPicture: String,
    birthday: Date,
    gender: String,
    location: String,
    latitude: Number,
    longtitude: Number,
    shortBio: String,
    videoLink: String,
    githubLinkApp: String,
    twitter: String,
    facebook: String,
    github: String,
    linkedin: String,
    website: String,
    itunes: String,
    iMessage: String,
    numberOfTimesWWDCScholar: Number,
    screenshotOne: String,
    screenshotTwo: String,
    screenshotThree: String,
    screenshotFour: String,
    status: String,
    statusComment: String,
    createdAt: {type: Date, default:Date.now},
    approvedOn: {type: Date},
    approvedBy: String,
    updatedAt: {type: Date, default:Date.now},
    password: { type: String, required: true, default: 'a1003c2f07c09d4ea39e7a72efa786bbc6d6ba6ab90b8a6604c20c15501cbf88' }
});

module.exports = mongoose.model('Scholar', scholarSchema);
