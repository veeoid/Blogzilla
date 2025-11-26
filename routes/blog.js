const express = require('express');
const Blog = require('../models/blog');

const router = express.Router();

router.get('/add-new', (req, res) => {
    return res.render('addBlog', {
        user: req.user
    })
})

router.post('/add-new', async (req, res) => {
    console.log(req.body);
    const {title, body} = req.body;

    await Blog.create({
        title,
        body,
    })
    return res.redirect('/')
})
module.exports = router;



