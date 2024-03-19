const express = require('express')
const router = express.Router()

const {query, validationResult} = require('express-validator')

const bcrypt = require('bcrypt');
const saltRounds = 10;

const pool = require('../db')
const session = require('express-session')


router.get('/', async function (req, res) {
    res.render('index.njk', req.session.user)
})

router.get('/login', async function (req, res) {
    res.render('login.njk', req.session.user)
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

        
        bcrypt.compare(req.body.password, user[0].password, function(err, result) {
            console.log(result)
            if (result){
                req.session.name = req.body.username
                res.redirect(`user/:${req.body.username}`)
            } else {
                res.render('login.njk', {username:req.body.username, error: 'wrong password', ...req.session.user})
            }
        })
     } catch (error){
        console.log(error)
        res.render('login.njk', {error: 'wrong username', ...req.session.user})
    }
})
router.get('/user/:name', async function (req, res) {
    if (req.session.name === undefined){
        return res.redirect('/login')
    }
    console.log(req.session.name)
    let user = {
        username: req.session.name,
        loggedIn: true,
    }
    req.session.user = user
    console.log(req.session.user)
    console.log({username: req.session.name})
    res.render('user.njk', req.session.user)
})

router.get('/user/:name/new', async function (req, res) {
    res.render('create_tweep.njk', req.session.user)
})
router.post('/tweeps', async function (req, res) {
    const time = new Date().toISOString().slice(0, 19).replace('T', ' ')
    console.log(time)
    res.redirect('/')
})

router.get('/tweeps', async function (req, res) {
    const [tweeps] = await pool.promise().query('SELECT * FROM alea_leacta_est_tweep JOIN alea_lacta_est_user ON alea_leacta_est_tweep.user_id = alea_lacta_est_user.id')
    res.render('tweeps.njk', {...req.session.user, tweeps})
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
    res.render('create_account.njk')
})

router.post('/create_account', async function (req, res) {
    //kanske borde gå till index istället
    res.redirect(`/user/:${req.body.username}`)
})

router.get('/uppdate_user', async function (req, res) {
    res.render('/uppdate_user')
})

router.post('/uppdate_user', async function (req, res){

    res.redirect(`/user/:${req.session.username}`)
})

router.post('/user/:name/delete', async function (req, res){
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