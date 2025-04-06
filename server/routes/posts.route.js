const express = require("express")

const {getPosts , getPost , createPost ,updatePost ,deletePost , likePost , addComment ,getUserPosts} = require("../controllers/posts.controller")

const auth = require("../middleware/auth.middileware")



const router = express.Router()

router.get("/" , getPosts)
router.get("/:id", getPost)

router.post("/" , auth, createPost )


router.put("/:id" , auth , updatePost)

router.delete("/:id" , auth , deletePost)


router.post("/:id/like" , auth , likePost) 


router.post ("/:id/comments" , auth , addComment)

router.get("/user/:userId" , getUserPosts)

router.get("/my-posts/all" , auth , getUserPosts)


module.exports  = router