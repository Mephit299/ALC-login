const express = require('express')
const router = express.Router()

const pool = require('../db')

router.get('/', async function (req, res) {
    res.render('index.njk')
})

router.get('/login', async function (req, res) {
    res.render('login.njk')
})

router.post('/login', async function(req, res){

    res.redirect('/user')
})




module.exports = router