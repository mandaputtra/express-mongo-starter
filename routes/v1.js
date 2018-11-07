/* eslint-disable */

const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user.controller');
const HomeController = require('../controllers/home.controller');
const BlogPostController = require('../controllers/blogpost.controller');


const custom = require('./../middleware/custom');

const passport = require('passport');
const path = require('path');

require('./../middleware/passport')(passport)
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({status:"success", message:"Parcel Pending API", data:{"version_number":"v1.0.0"}})
});

router.post('/users', UserController.create);                                                     // C
router.get('/users', passport.authenticate('jwt', { session:false }), UserController.get);        // R
router.put('/users', passport.authenticate('jwt', { session:false }), custom.isLogedInUser, UserController.update);     // U
router.delete('/users', passport.authenticate('jwt', { session:false }), custom.isLogedInUser, UserController.remove);  // D
router.get('/users/:id/blog', UserController.getUserAndBlogPost);  // R
router.get('/userstest', UserController.getUserAndBlogPostTest);  // R
router.post('/users/login', UserController.login);

router.post('/blogpost', passport.authenticate('jwt', { session:false }), BlogPostController.create); // C
router.get('/blogpost', BlogPostController.getAll); // R
router.get('/blogpost/:blogpostId', passport.authenticate('jwt', { session:false }), BlogPostController.get); // R
router.put('/blogpost/:blogpostId', passport.authenticate('jwt', { session:false }), custom.blogpostAuthor, BlogPostController.update); // U
router.delete('/blogpost/:blogpostId', passport.authenticate('jwt', { session:false }), custom.blogpostAuthor, BlogPostController.deleteById); // D


router.get('/dash', passport.authenticate('jwt', {session:false}), HomeController.Dashboard);


//********* API DOCUMENTATION **********
module.exports = router;
