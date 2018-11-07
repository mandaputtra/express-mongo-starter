const { User, Blogpost } = require("../models");
const authService = require("../services/auth.service");
const { to, ReE, ReS } = require("../services/util.service");
const consola = require('consola')

const create = async function(req, res) {
  res.setHeader("Content-Type", "application/json");
  const body = req.body;
  if (!body.unique_key && !body.email && !body.phone) {
    return ReE(res, "Please enter an email or phone number to register.");
  } else if (!body.password) {
    return ReE(res, "Please enter a password to register.");
  } else {
    let err, user;

    [err, user] = await to(authService.createUser(body));

    if (err) return ReE(res, err, 422);
    // For some reason dont send password back to users event it hash
    user.password = "";
    return ReS(
      res,
      {
        message: "Successfully created new user.",
        user: user.toWeb(),
        token: user.getJWT()
      },
      201
    );
  }
};
module.exports.create = create;

const get = async function(req, res) {
  res.setHeader("Content-Type", "application/json");
  let user = req.user;

  return ReS(res, { user: user.toWeb() });
};
module.exports.get = get;

const update = async function(req, res) {
  let err, user, data;
  user = req.user;
  data = req.body;
  user.set(data);

  [err, user] = await to(user.save());
  if (err) {
    consola.error(err, user);

    if (err.message.includes("E11000")) {
      if (err.message.includes("phone")) {
        err = "This phone number is already in use";
      } else if (err.message.includes("email")) {
        err = "This email address is already in use";
      } else {
        err = "Duplicate Key Entry";
      }
    }

    return ReE(res, err);
  }
  return ReS(res, { message: "Updated User: " + user.email });
};
module.exports.update = update;

const remove = async function(req, res) {
  let user, err;
  user = req.user;

  [err, user] = await to(user.destroy());
  if (err) return ReE(res, "error occured trying to delete user");

  return ReS(res, { message: "Deleted User" }, 204);
};
module.exports.remove = remove;

const login = async function(req, res) {
  const body = req.body;
  let err, user;

  [err, user] = await to(authService.authUser(req.body));

  if (err) return ReE(res, err, 422);

  return ReS(res, { token: user.getJWT(), user: user.toWeb() });
};
module.exports.login = login;

const getUserAndBlogPost = async (req, res) => {
  let err, user, blogpost;

  [err, user] = await to(User.findOne({ _id: req.params.id }));
  if(err) return ReE(res, err, 422);

  [err, blogpost] = await to(Blogpost.find({ author: user._id }));
  if(err) return ReE(res, "This user doesnt had any blog post yet");

  return ReS(res, {
    message: "Success finding user with blogpost",
    user: user,
    blogpost: blogpost
  })
}
module.exports.getUserAndBlogPost = getUserAndBlogPost;

const getUserAndBlogPostTest = async (req, res) => {
  let err, blogpost;

  // [err, user] = await to(User.findOne({ _id: req.params.id }));
  // if(err) return ReE(res, err, 422);

  [err, blogpost] = await to(Blogpost.findOne({ title: "Laravel" })
    .populate('author'));
  if(err) return ReE(res, "This user doesnt had any blog post yet");

  if(!blogpost) return ReE(res, "This user doesnt had any blog post yet");

  return ReS(res, {
    message: "Success finding user with blogpost",
    blogpost: blogpost
  })
}
module.exports.getUserAndBlogPostTest = getUserAndBlogPostTest;
