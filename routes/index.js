const express = require('express')
const router = express.Router()

const {body, validationResult} = require('express-validator')

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
body('username').isLength({min: 4, max: 32}), 
body('password').isLength({min: 4, max: 32}),  
async function(req, res){
    const result = validationResult(req);
    if (!result.isEmpty()){
        return res.render('login.njk', {error: 'Username and password must be 4-32 characters long.'})
    }
    try{
        const [user] = await pool.promise().query(`SELECT * FROM alea_lacta_est_user WHERE alea_lacta_est_user.\`name\` = '${req.body.username}'`)
        console.log(user)
        console.log(user[0])
        console.log(user[0].password)

        
        bcrypt.compare(req.body.password, user[0].password, function(err, result) {
            console.log(result)
            if (result){
                req.session.name = req.body.username
                res.redirect(`user/:${req.body.username}`)
            } else {
                res.render('login.njk', {username:req.body.username, error: 'wrong password'})
            }
        })
     } catch (error){
        console.log(error)
        res.render('login.njk', {error: 'wrong username'})
    }
})
router.get('/user/:name', async function (req, res) {
    if (req.session.name === undefined){
        return res.redirect('/login')
    }
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