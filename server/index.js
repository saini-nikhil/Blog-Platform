const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")

const authRoutes = require("./routes/auth.route")
const postRoutes = require("./routes/posts.route")
const userRoutes = require("./routes/user.route")

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())



mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));


app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Blog Platform API is running');
  });

const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 