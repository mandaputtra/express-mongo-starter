// const Company = require("../models/company.model");
const { Blogpost } = require("../models");
const { to, ReE, ReS } = require("../services/util.service");

// let company = async function(req, res, next) {
//   let company_id, err, company;
//   company_id = req.params.company_id;

//   [err, company] = await to(Company.findOne({ _id: company_id }));
//   if (err) return ReE(res, "err finding company");

//   if (!company) return ReE(res, "Company not found with id: " + company_id);
//   let user, users_array;
//   user = req.user;
//   users_array = company.users.map(obj => String(obj.user));

//   if (!users_array.includes(String(user._id)))
//     return ReE(
//       res,
//       "User does not have permission to read app with id: " + app_id
//     );

//   req.company = company;
//   next();
// };
// module.exports.company = company;

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
