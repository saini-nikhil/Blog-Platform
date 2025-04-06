const mongoose = require("mongoose")


const UserScehem = new mongoose.Schema({
    
        name: {
          type: String,
          required: true,
          trim: true,
        },
        email: {
          type: String,
          required: true,
          unique: true,
          trim: true,
          lowercase: true,
        },
        password: {
          type: String,
          required: true,
          minlength: 6,
        },
        profilePicture: {
          type: String,
          default: '',
        },
        bio: {
          type: String,
          default: '',
        },
      },
      { timestamps: true }
    );


module.exports = mongoose.model("User" , UserScehem)