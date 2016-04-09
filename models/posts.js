var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
	postNumber: Number,
	title: String,
	content: String,
	images: String,
	videoLink: String,
	scholarName: String,
	scholarLink: String,
	// To be transferred, once site uses the new db: scholar: { type: Schema.Types.ObjectId, ref: 'Scholar'},
	scholar: String,
	email: String,
	tags: [],
	createdAt: {type: Date, default:Date.now},
    updateAt: {type: Date, default:Date.now}

});

module.exports = mongoose.model('Post', postSchema);