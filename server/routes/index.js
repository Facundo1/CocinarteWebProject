const express = require('express')
const recipe = require('./Recipe')
const user = require('./Users/users')
const favorite = require('./Recipe/favorite')
const pay = require('./Pays/Pays')
const video = require('./VideoCurses/video')
const job = require('./Jobs')
const axiosJob = require('./Jobs/jobs')
const adminFuncctions = require('./AdminFunctions/AdminFunctions')
//const backup = require('../Backup/backup')

const router = express.Router()

router.use('/public/uploads', express.static('server/public/uploads'))
router.use('/uploads', express.static('server/uploads'))
router.use('/public/uploads/Works', express.static('server/uploads'))

router.use('/api/users', user)
router.use('/api/recipes', recipe)
router.use('/api/favorite', favorite)
router.use('/api/checkout', pay)
router.use('/api/jobs', job)
router.use('/api/axiosJobs', axiosJob)
router.use('/api/video', video)
router.use('/api/admin', adminFuncctions)
//router.use('/api/backup', backup)
module.exports = router
