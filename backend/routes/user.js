const express = require("express");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config");
const {authMiddleware} = require("../middleware");


const zod = require("zod");
const { User, Account } = require("../db");

const router = express.Router();

const signUpSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
    firstName: zod.string(),
    lastName : zod.string()
});

const signInSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

const updateSchema = zod.object({

    password:zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
});

router.post("/signup", async (req, res) => {
    
    const {success} = signUpSchema.safeParse(req.body);

    if(!success){
        return res.json({
            message: "Email already taken /incorrect inputs"
        });
    }

    const user = User.findOne({
        username: req.body.username
    })
    
    if(user){
        return res.json({
            meassage:"email already taken/incorrect"
        });
    }

    const dbUser = await User.create(body);
    await Account.create({
        userId: dbUser._id,
        balance: 1 + Math.random()*10000

    })

    const  token = jwt.sign({
        userId: dbUser._id
    }, JWT_SECRET);

    res.json({
        message: "user created successfully",
        token:token
    });
});

router.post("/signin", async (req,res) => {
    const {success} = signInSchema.safeParse(req.body);

    if(!success){
        return res.status(411).json({
            meassage: "Incorrect inputs"
        });
    }

    const user = await User.findOne({
        username: req.body.username,
        password:req.body.password
    });

    if(user){
        const token = jwt.sign({
            userId: user._id
        },JWT_SECRET);

        res.json({
            token: token
        });

        return;
    }

    res.status(411).json({
        message:"Error wile logging in"
    });
})

router.put("/", authMiddleware, async (req, res) => {

    const {success} = updateSchema.safeParse(req.body);

    if(!success){
        res.status(411).json({
            message: "error while updating information"
        });
    }

    await User.updateOne({_id: req.userId}, req.body);

    res.json({
        message: "Updated successfully"
    });
})

router.get("/bulk", async(req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or:[{
            firstName: {
                "$regex": filter
            }
        },{
            lastName:{
                "$regex":filter
            }
        }]
    })

    res.json({
        users: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
});



module.exports = router;