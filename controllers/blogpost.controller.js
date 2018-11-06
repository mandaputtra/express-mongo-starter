const { to, ReE, ReS } = require('../services/util.service');
const { Blogpost } = require("../models");

const create = async function(req, res) {
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
