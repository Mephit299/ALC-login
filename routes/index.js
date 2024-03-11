const express = require('express')
const router = express.Router()

router.get('/', async function (req, res) {
    res.render('index.njk')
})



module.exports = router