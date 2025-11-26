const express = require('express');
const User = require('../models/user')

const router = express.Router();

router.get('/signin', (req, res) => {
    return res.render('signin');
})

router.get('/signup', (req, res) => {
    return res.render('signup');
})

router.post('/signin', async (req, res) => {
    const {email, password} = req.body;
    try{
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie('token', token).redirect('/');
    }catch(error){
        return res.render('signin', {
            error: 'Invalid email/password'
        })
    }

})

router.post('/signup', async (req, res) => {
    const {firstName, lastName, username, email, password} = req.body;
    await User.create({
        firstName,
        lastName,
        username,
        email,
        password,
    });
    return res.redirect('/');
});


router.get('/signout', async (req, res) => {
    res.clearCookie('token');
    return res.redirect('/')
})

module.exports = router;