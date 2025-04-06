const Post = require("../models/post.model");


const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, tag } = req.query;
    const filter = tag ? { tags: { $in: [tag] } } : {};

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('author', 'name profilePicture')
      .populate('comments.author', 'name profilePicture');

    const totalPosts = await Post.countDocuments(filter);

    res.status(200).json({
      posts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPosts / parseInt(limit)),
      totalPosts,
    });
  } catch (error) {
    console.error('Get posts error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name profilePicture bio')
      .populate('comments.author', 'name profilePicture');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error('Get post error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// const createPost = async (req, res) => {
//   try {
//     const { title, content, tags, imageUrl } = req.body;

//     const newPost = new Post({
//       title,
//       content,
//       author: req.user._id,
//       tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
//       imageUrl,
//     });

//     await newPost.save();

//     const populatedPost = await Post.findById(newPost._id)
//       .populate('author', 'name profilePicture');

//     res.status(201).json(populatedPost);
//   } catch (error) {
//     console.error('Create post error:', error.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

const createPost = async (req, res) => {
  try {
    const { title, content, tags, imageUrl } = req.body;

    const tagArray = tags && typeof tags === 'string' 
      ? tags.split(',').map(tag => tag.trim()) 
      : [];

    const newPost = new Post({
      title,
      content,
      author: req.user._id,
      tags: tagArray,
      imageUrl,
    });

    await newPost.save();

    const populatedPost = await Post.findById(newPost._id)
      .populate('author', 'name profilePicture');

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Create post error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


const updatePost = async (req, res) => {
  try {
    const { title, content, tags, imageUrl } = req.body;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        title,
        content,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : post.tags,
        imageUrl: imageUrl || post.imageUrl,
      },
      { new: true }
    ).populate('author', 'name profilePicture');

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Update post error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const alreadyLiked = post.likes.includes(req.user._id);
    
    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.status(200).json({ likes: post.likes, likesCount: post.likes.length });
  } catch (error) {
    console.error('Like post error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      text,
      author: req.user._id,
    };

    post.comments.push(newComment);
    await post.save();

    const updatedPost = await Post.findById(req.params.id)
      .populate('comments.author', 'name profilePicture');

    const addedComment = updatedPost.comments[updatedPost.comments.length - 1];

    res.status(201).json(addedComment);
  } catch (error) {
    console.error('Add comment error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate('author', 'name profilePicture');

    res.status(200).json(posts);
  } catch (error) {
    console.error('Get user posts error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {getPosts , getPost , createPost ,updatePost ,deletePost , likePost , addComment ,getUserPosts}
