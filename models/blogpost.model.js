const mongoose = require('mongoose');
const validate = require('mongoose-validator');
const {TE, to} = require('../services/util.service');

let BlogPostSchema = mongoose.Schema({
  title: { type: String, required:true },
  author: { type: mongoose.Schema.ObjectId, ref : 'User' },
  categories: [ { type: String } ],
  comment: [
    {
      commentAuthor: { type: mongoose.Schema.ObjectId, ref : 'User' },
      body: { type: String },
      date: { type: Date, default: Date.now() },
    }
  ],
  created: { type: Date, default: Date.now()  }
}, {timestamps: true})

BlogPostSchema.methods.toWeb = function(){
  let json = this.toJSON();
  json.id = this._id;//this is for the front end
  return json;
};

let BlogPost = module.exports = mongoose.model('BlogPost', BlogPostSchema);