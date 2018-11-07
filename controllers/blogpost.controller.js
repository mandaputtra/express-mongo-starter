const { to, ReE, ReS } = require('../services/util.service');
const { Blogpost } = require("../models");

// Create blogpost
const create = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let err, blogpost;

  [err, blogpost] = await to(Blogpost.create({
    title: req.body.title,
    author: req.user._id,
    categories: req.body.categories
  }));

  if(err) return ReE(res, err, 422);

  return ReS(res, {
    message: "succesful create blogpost",
    blogpost: blogpost.toWeb()
  }, 200)
};
module.exports.create = create;

const getAll = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  let err, blogpost;

  [err, blogpost] = await to(Blogpost.find());

  if(err) return ReE(res, err, 422);

  return ReS(res, { message: "success get all blogpost", blogpost: blogpost }, 200)

};
module.exports.getAll = getAll;

const get = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  let err, blogpost, blogpostId;

  blogpostId = req.params.blogpostId;

  [err, blogpost] = await to(Blogpost.findOne({ _id: blogpostId })
    .populate('author'));

  if(err) return ReE(res, err, 422);
  if(!blogpost) return ReE(res, "There ir no blogpost with that id");

  // Dont send back the author password! even it hash
  blogpost.author.password = "secret";

  return ReS(res, {
    message: "Success geting blogpost with id: " + blogpostId,
    blogpost: blogpost
  }, 200)
}
module.exports.get = get

const update = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  let err, blogpost, blogpostId;
  blogpostId = req.params.blogpostId;

  // Updating the blogpost
  [err, blogpost] = await to(Blogpost.findOneAndUpdate(
      { _id: blogpostId },
      {
        title: req.body.title,
        categories: req.body.categories
      }
    ));
  if(err) return ReE(res, err, 422);

  // Sentback the blogpost that are updated
  [err, blogpost] = await to(Blogpost.findOne({ _id: blogpost }));
  if(err) return ReE(res, err, 422);

  return ReS(res, {
    message: "Success updating blogpost",
    blogpost: blogpost
  }, 200);
};
module.exports.update = update;

const deleteById = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  let err, blogpost, blogpostId;

  blogpostId = req.params.blogpostId;

  [err, blogpost] = await to(Blogpost.deleteOne({ _id: blogpostId }));
  if(err) return ReE(res, err, 422);

  return ReS(res, { message: "Success deleting article"});
}
module.exports.deleteById = deleteById;