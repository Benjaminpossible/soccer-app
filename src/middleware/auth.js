
const jwt = require('jsonwebtoken')
const Admin = require('../models/admin')
const url = require('url')
const auth = async (req, res, next) => {
    try {
        const token = req.cookies['auth_token']
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findOne({ _id: decoded._id, 'tokens.token': token})
        if (!admin) {
            throw new Error()
        }
        req.token = token
        req.admin = admin
        next()
    } catch (e) {
        res.redirect(url.format({ 
            pathname: '/admin/login',
            query: {
                feedback: 'Please Login'
            }
        }))
    }
}        

module.exports = auth