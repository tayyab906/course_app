const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');
const Post = require("../models/Post");

// create new post
router.post("/", async (req,res) => {
    const newPost =  new Post(req.body);

    try{
        const savePost = await newPost.save();
        res.status(200).json(savePost);

    } catch(err){
        res.status(500).json(err);
    }

   
});


//UPDATE POST
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.username === req.body.username){

        try{
            const updatedPost = await Post.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },    
                    {new: true}
                
            );
            res.status(200).json(updatedPost);

        }catch(err){
            res.status(500).json(err)

        }

    }else{
        res.status(401).json("you can updated only youe post!")
    } 

    } catch(err){
        res.status(500).json(err)
    }
  });

  // DELETE POST

  router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.username === req.body.username){

        try{
            await Post.findByIdAndUpdate(req.params.id);
            res.status(200).json("post has been deleted")

        }catch(err){
            res.status(500).json(err)

        }

    }else{
        res.status(401).json("you can delete only youe post!")
    } 

    } catch(err){
        res.status(500).json(err)
    }
  });


  // get user

router.get("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch(err){
        res.status(500).json(err)
    }
})

// get all posts

router.get("/", async (req, res) => {
    const username = req.query.user;
    const catName = req.query.cat;
    try{
        let posts;
        if(username){
            posts = await Post.find({username: username})
        }else if(catName){
            posts = await Post.find({categories:{
                $in:[catName]
            }})

        } else{
            posts = await Post.find();
        }
        res.status(200).json(posts)
    } catch(err){
        res.status(500).json(err)
    }
})





module.exports = router;