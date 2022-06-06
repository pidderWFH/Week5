var express = require('express');
var router = express.Router();

const handleErrorAsync = require("../service/handleErrorAsync");
const PostsControllers = require("../controllers/posts");



router.get('/posts', handleErrorAsync(PostsControllers.getAllPosts));

router.post('/post', handleErrorAsync(PostsControllers.createdPosts));

router.delete('/posts', handleErrorAsync(PostsControllers.deleteAllPosts));

router.delete('/post/:id', handleErrorAsync(PostsControllers.deleteOnePosts));

router.patch('/post/:id', handleErrorAsync(PostsControllers.patchPosts));

module.exports = router;
