const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');
const express = require('express');
const router = new express.Router();
const cors = require('cors');
const group =require('../Model/Group/group')
router.use(cors());

router.post("/creategroup",(req,res)=>{
    let newGroup = {
        maxLimit: req.body.maxLimit,
        language: req.body.language,
        level: req.body.level,
        info: req.body.info
    }
    newGroup = new group(newGroup);
    newGroup.save().then((result) => {
        res.send({"message":"group created","group": result});
    }).catch((err) => {
        res.status(400).send({"error":"User set is failed"});
    });
});
router.get("/allgroups",(req,res)=>{
    group.find().then(result =>
    res.send(result)
    )
    .catch(err=>{
        console.log(err);
        res.status(400).send({message:"Something went wrong"});
    })
})

module.exports = router;