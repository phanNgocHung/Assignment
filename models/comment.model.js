const mongoose = require('mongoose');
const db = require('./db');

const commentSchema = new mongoose.Schema({
    user:{
        type: db.mongoose.Schema.Types.ObjectId, ref: 'User'
    }, // User binh luan
    comic:{
        type: db.mongoose.Schema.Types.ObjectId, ref: 'Comic'
    },// Comic duoc binh luan
    admin:{
        type: db.mongoose.Schema.Types.ObjectId, ref: 'Admin'
    }, 
    content: String, // Noi dung
    commentDate: Date, // Ngay
});
const Comment = mongoose.model('Comment', commentSchema,'Comment');
module.exports = Comment;
