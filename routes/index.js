const express = require('express')
const router = express.Router()

const {query, validationResult} = require('express-validator')

const bcrypt = require('bcrypt');
const saltRounds = 10;

const pool = require('../db')
const session = require('express-session')


router.get('/', async function (req, res) {
    res.render('index.njk')
})

router.get('/login', async function (req, res) {
    res.render('login.njk')
})

router.post('/login', 
query('username').isLength({min: 4, max: 30}), 
query('password').isLength({min: 4, max: 30}),  
async function(req, res){
    const result = validationResult
    
    try{
        const [user] = await pool.promise().query(`SELECT * FROM alea_lacta_est_user WHERE alea_lacta_est_user.\`name\` = '${req.body.username}'`)
        console.log(user)
        console.log(user[0])
        console.log(user[0].password)
        console.log(encryptPassword('test'))
        console.log(encryptPassword(req.body.password))

        bcrypt.hash(password, saltRounds, function(err, hash) {
            let encryptPassword = hash
        })
        
        //if (user[0].password === encryptPassword(req.body.password)){
        //    req.session.name = req.body.username
        //    res.redirect(`/user/:${req.body.username}`, {name: req.body.username})
        //} else {
            res.json({user, encrypted:encryptPassword(req.body.password)})
        //}

     } catch (error){
        console.log(error)
        res.redirect('/')
    }

    //req.session.name = req.body.username
    //res.redirect(`user/:${req.body.name}`)
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
    
    const myPlaintextPassword = 'test';
    const someOtherPlaintextPassword = 'not_bacon';

    bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
        console.log(hash)
        return res.json(hash)
    })

})


module.exports = router