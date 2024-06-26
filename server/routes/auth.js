const express = require('express')
const router = express.Router()
const user = require('../models/User')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator')
const jwtSecret = process.env.JWT_SECRET
const jwt = require('jsonwebtoken')
const fetchUser = require('../middleware/fetchUserData')
const validator = require('validator')

// create a user(signup module)

router.post('/signup', [
    body('userName', 'User name must comtain atleat 3 character').isAlpha().isLength({min: 3}),
    body('password', 'Password must contain atleast 8 character').isAlphanumeric().isLength({min: 8}),
    body('email', 'Enter a valid user email').isEmail()
], async (req, res) => {
    const error = validationResult(req)
    if(!error.isEmpty()) return res.status(402).json({error: error.array()})
    if(req.body.password !== req.body.confirmPassword) return res.status(400).send("password don't match")
    try {
        const existingUser = await user.findOne({userName: req.body.userName})
        if(existingUser) return res.status(400).json({message: "User allready exist"})
        const existingEmail = await user.findOne({email: req.body.email})
        if(existingEmail) return res.status(400).json({message: "E-mail allready taken"})
        const salt = await bcrypt.genSalt(10)
        const hashedPass =  await bcrypt.hash(req.body.password, salt)
        req.body.password = hashedPass
        const newUser = new user(req.body)
        await newUser.save()
        const data = {
            user: {
                id: newUser.id
            }
        }
        const authToken = jwt.sign(data, jwtSecret)
        res.json({authToken})
    }
    catch (error) {
        res.status(500).send("Some ERROR occur")
        console.log(error)
    }
})

// create a user(signup module)

router.post('/login',[
    body('email', 'Enter a valid user email').isEmail(),
    body('password', 'Password canno\'t be blank').isLength({min: 8})
], async (req, res) => {
    const error = validationResult(req)
    if(!error.isEmpty()) res.status(400).json({error: error.array()})
    const {email, password, confirmPassword} = req.body
    if(password !== confirmPassword) return res.status(401).send('Password don\'t match')
    try{   
        let existingUser = await user.findOne({email})
        if(!existingUser) return res.status(401).send("Invalid credentails.")
        const passwordCompare = await bcrypt.compare(password, existingUser.password)
        if(!passwordCompare) return res.status(401).send("Invalid pass.")
        const data = {
            user: {
                id: existingUser.id
            }
        }
        const authToken = jwt.sign(data, jwtSecret)
        res.json({authToken})
    } catch (error) {
        res.status(500).send("Some ERROR occur")
        console.log(error)
    }
})

// getting user data

router.get('/getuser',fetchUser, async (req, res) =>{
    try {
        const reqUser = await user.findById(req.user.id).select('-password').select('-_id').select('-__v')
        res.json(reqUser)
    } catch (error) {
        res.status(500).send("Some ERROR occur")
        console.log(error)
    }
})

module.exports = router