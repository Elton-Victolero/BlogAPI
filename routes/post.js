// [SECTION] Dependencies and Modules
const express = require("express");
const postController = require("../controllers/post.js");
const { verify, verifyAdmin } = require("../auth.js");

const router = express.Router();

// [SECTION] add-post
router.post("/addPost", verify, postController.addPost);

//[SECTION] get-all-posts
router.get("/getPosts", postController.getAllPosts);

//[SECTION] get-single-post
router.get("/getPost/:postId", verify, postController.getPost);

//[SECTION] update Post
router.patch("/updatePost/:postId", verify, postController.updatePost);

//[SECTION] delete Post
router.delete("/deletePost/:postId", verify, postController.deletePost);

//[SECTION] add comment
router.post("/addComment/:postId", verify, postController.addPostComment);

//[SECTION] delete comment
router.delete("/deleteComment/:postId/:commentId", verify, postController.deletePostComment);

//[SECTION] get comment
router.get("/getComments/:postId", verify, postController.getPostComments);



module.exports = router;