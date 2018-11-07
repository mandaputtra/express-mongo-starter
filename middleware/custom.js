const { User, Blogpost } = require("../models");
const { to, ReE, ReS } = require("../services/util.service");

let blogpostAuthor = async (req, res, next) => {
  let blogpostId, err, blogpost;

  blogpostId = req.params.blogpostId;

  [err, blogpost] = await to(Blogpost.findOne({ _id: blogpostId }));
  if(err) return ReE(res, "error blogpost not found");

  if(!blogpost) return ReE(res, "blogpost not found with id: " + blogpostId );

  let author;
  author = req.user._id;

  // If comparing the Object schema Id you should use to string
  // If not it is will throw false
  if(author.toString() != blogpost.author.toString())
    return ReE(res, "User does not had permission to update " + blogpost.title);

  req.blogpost = blogpost;
  next()
}
module.exports.blogpostAuthor = blogpostAuthor;

let isLogedInUser = async (req, res, next) => {
  let err, user;

  [err, user] = await to(User.findOne({ _id: req.user._id }));
  if(err) return ReE(res, "error user not found");

  if(!user) return ReE(res, "User not found");

  userLogin = req.user._id;
  if(userLogin.toString() != user._id.toString())
    return ReE(res, "you dont had permission to update");

  req.user = user;
  next();
}
module.exports.isLogedInUser = isLogedInUser;
