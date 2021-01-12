const express = require('express')
const router = new express.Router()

router.get('', (req, res) => {
    res.render('index', {
        title: 'SUPREME DLO ',
        name: 'Benjamin Possible'
    })
})

router.get('/teams', (req, res) => {
    res.render('teams', {
        title: 'SUPREME TEAMS',
        name: 'Benjamin Possible'
    })
})

router.get('/league', (req, res) => {
    res.render('league', {
        title: 'Supreme League',
        name: 'Benjamin Possible'
    })
})

router.get('/scl', (req, res) => {
    res.render('scl', {
        title:  'Supreme Champions League',
        name: 'Benjamin Possible'
    })
})

router.get('/logo', (req, res) => {
    res.render('logo-form', {
        title:  'Supreme Champions League',
        name: 'Benjamin Possible'
    })
})

router.get('/admin', (req, res) => {
    res.render('404', {
        title: 'Page Not Found!',
        name: 'Benjamin Possible'
    })
})
router.get('/admin/login', (req, res) => {
    res.render('login', {
        title: 'Supreme Admin Board!',
        name: 'Benjamin Possible',
        feedback: req.query.feedback
    })
})
router.get('/backdoor', (req, res) => {
    res.render('100', {
        title: 'Supreme Back Office!',
        name: 'Benjamin Possible'
    })
})
module.exports = router