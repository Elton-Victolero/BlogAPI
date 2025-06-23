//[SECTION] Activity: Dependencies and Modules
const Post = require("../models/Posts.js");
const { errorHandler } = require("../auth.js") ;

//reformat date
const formatDate = date => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  });
};

const formatPost = post => ({
  ...post.toObject(),
  createdAt: formatDate(post.createdAt),
  updatedAt: formatDate(post.updatedAt)
});


// [SECTION] create-post
module.exports.addPost = (req, res) => {
  const { title, content, coverImage } = req.body;

  if (!title || !content) {
    return res.status(400).send({ error: "Title and content are required" });
  }

  const newPost = new Post({
    title,
    content,
    coverImage,
    author: req.user.id
  });

  newPost.save()
    .then(result => res.status(201).send(formatPost(result)))
    .catch(error => errorHandler(error, req, res));
};


//[SECTION] retrieve-all-posts
module.exports.getAllPosts = (req, res) => {
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10;

  let totalCount;

  Post.countDocuments()
    .then(count => {
      totalCount = count;
      return Post.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    })
    .then(posts => {
      const hasMore = skip + posts.length < totalCount;
      const formattedPosts = posts.map(formatPost);

      res.status(200).send({ posts: formattedPosts, hasMore });
    })
    .catch(error => errorHandler(error, req, res));
};


//[SECTION] retrieve-single-post
module.exports.getPost = (req, res) => {
  Post.findById(req.params.postId)
    .then(post => {
      if (!post) {
        return res.status(404).send({ error: "Post not found" });
      }
      return res.status(200).send(formatPost(post));
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.updatePost = (req, res) => {
  const { title, content, coverImage } = req.body;

  Post.findById(req.params.postId)
    .then(post => {
      if (!post) {
        return res.status(404).send({ error: "Post not found" });
      }

      if (post.author.toString() !== req.user.id) {
        return res.status(403).send({ error: "Unauthorized to update this post" });
      }

      if (title !== undefined) post.title = title;
      if (content !== undefined) post.content = content;
      if (coverImage !== undefined) post.coverImage = coverImage;

      return post.save();
    })
    .then(updatedPost => {
      if (updatedPost) {
        res.status(200).send({
          success: true,
          message: "Post updated successfully",
          post: formatPost(updatedPost)
        });
      }
    })
    .catch(error => errorHandler(error, req, res));
};


module.exports.deletePost = (req, res) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then(post => {
      if (!post) {
        return res.status(404).send({ error: "Post not found" });
      }

      if (post.author.toString() !== req.user.id && !req.user.isAdmin) {
        return res.status(403).send({ error: "Unauthorized to delete this post" });
      }

      return Post.findByIdAndDelete(postId);
    })
    .then(() => {
      res.status(200).send({
        success: true,
        message: "Post deleted successfully"
      });
    })
    .catch(error => errorHandler(error, req, res));
};


// [SECTION] add-post-comment
module.exports.addPostComment = (req, res) => {
    if (!req.user) {
        return res.status(401).send({
            auth: "Failed",
            message: "User authentication required"
        });
    }

    const postId = req.params.postId;
    const commentData = {
        userId: req.user.id,
        comment: req.body.comment
    };

    Post.findById(postId)
        .then(post => {
            if (!post) {
                return res.status(404).send({ error: "Post not found" });
            }

            post.comments.push(commentData);
            return post.save();
        })
        .then(updatedPost => {
            res.status(200).send({
                message: "Comment added successfully",
                comments: updatedPost.comments
            });
        })
        .catch(error => errorHandler(error, req, res));
};

module.exports.deletePostComment = (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;

  Post.findById(postId)
    .then(post => {
      if (!post) {
        return res.status(404).send({ error: "Post not found" });
      }

      const comment = post.comments.id(commentId);
      if (!comment) {
        return res.status(404).send({ error: "Comment not found" });
      }

      if (comment.userId.toString() !== req.user.id && !req.user.isAdmin) {
        return res.status(403).send({ error: "Unauthorized to delete this comment" });
      }

      post.comments.pull(commentId);
      return post.save();
    })
    .then(updatedPost => {
      res.status(200).send({
        success: true,
        message: "Comment deleted successfully",
        comments: updatedPost.comments
      });
    })
    .catch(error => errorHandler(error, req, res));
};


// [SECTION] get-post-comments
module.exports.getPostComments = (req, res) => {
    if (!req.user) {
        return res.status(401).send({
            auth: "Failed",
            message: "User authentication required"
        });
    }

    const postId = req.params.postId;

    Post.findById(postId)
        .then(post => {
            if (!post) {
                return res.status(404).send({ error: "Post not found" });
            }

            res.status(200).send({
                success: true,
                comments: post.comments
            });
        })
        .catch(error => errorHandler(error, req, res));
};

