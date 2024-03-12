const express = require('express')
const router = express.Router()

const {query, result} = require('express-validator')

const pool = require('../db')
const session = require('express-session')


router.get('/', async function (req, res) {
    res.render('index.njk')
})

router.get('/login', async function (req, res) {
    res.render('login.njk')
})

router.post('/login', async function(req, res){
    req.session.name = req.body.username
    res.redirect(`user/:${req.body.name}`)
})
router.get('/user/:name', async function (req, res) {
    console.log(req.session.name)
    res.render('user.njk', {username: req.session.name})
})

router.get('/users', async function (req, res) {
    try{
    const [users] = await pool.promise().query('SELECT * FROM alea_lacta_est_user')
    res.json(users)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

router.get('/create_account', async function (req, res) {
    res.render('/create_account.njk')
})

router.post('/create_account', async function (req, res) {
    //kanske borde gå till index istället
    res.redirect(`/user/:${req.body.username}`)
})

router.get('/uppdate_user', async function (req, res) {
    res.render('/uppdate_user')
})

router.post('/uppdate_user', async function (req, res){

    res.redirect(`/user/:${session.username}`)
})

router.post('/delete_user', async function (req, res){
    res.redirect('/')
})

router.get('/hashtest', async function (req, res){
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const myPlaintextPassword = 's0/\/\P4$$w0rD';
    const someOtherPlaintextPassword = 'not_bacon';

})



module.exports = router