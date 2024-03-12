const express = require('express')
const router = express.Router()

const [query, result] = require('express-validator')

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

router.get('/user', async function (req, res) {
    res.render('/user.njk')
})

router.get('/create_account', async function (req, res) {
    res.render('/create_account.njk')
})

router.post('/create_account', async function (req, res) {
    //kanske borde gå till index istället
    res.redirect('/user')
})

router.get('/uppdate_user', async function (req, res) {
    res.render('/uppdate_user')
})

router.post('/uppdate_user', async function (req, res){

    res.redirect('/user')
})

router.post('/delete_user', async function (req, res){
    res.redirect('/')
})



module.exports = router