const express = require('express');
const app = express();
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const authRoute = require("./routes/auth");
const userRoute = require('./routes/users');
const { route } = require('./routes/auth');
const postRouter = require('./routes/posts');
const categoryRouter = require('./routes/categories');
const path = require("path");
const multer = require('multer');


const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './files' )
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '--' + file.originalname)
  }
});

const upload = multer({ storage: fileStorageEngine });

app.post('/single',upload.single('pdf'), (req,res) => {
  console.log(req.file);
  res.send("Single file uplaoded")

})
app.post('/multiple',upload.array('pdf',3), (req,res) => {
  console.log(req.file);
  res.send("multiple file uplaoded")

})





dotenv.config();
app.use(express.json());
// app.use("/images", express.static(path.join(__dirname, "/images")));


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(console.log("Connected to MongoDB")).catch(err => console.log(err));


app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRouter);
app.use("/api/categories", categoryRouter);



app.listen("5000", () => {
    console.log("Backend is running")
})

