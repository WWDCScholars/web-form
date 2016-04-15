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
    age: { type: Number, min: 12, max: 65 },
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
    updatedAt: {type: Date, default:Date.now}
});

module.exports = mongoose.model('Scholar', scholarSchema);