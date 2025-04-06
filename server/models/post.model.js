const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
      },
      content: {
        type: String,
        required: true,
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      tags: {
        type: [String],
        default: [],
      },
      likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: [],
      },
      comments: [
        {
          text: {
            type: String,
            required: true,
          },
          author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      imageUrl: {
        type: String,
        default: '',
      },
    },
    { timestamps: true }
)


module.exports = mongoose.model("Post" , PostSchema)