const express = require('express')

const router = express.Router()
const Recipe = require('../../models/Recipe')
const Video = require('../../models/Video')
const Job = require('../../models/Jobs')
const LoginAuditory = require('../../models/LoginAuditory')

router.post('/addVideo', (req, res) => {
  const video = new Video({
    title: req.body.title,
    description: req.body.description,
    privacy: req.body.privacy,
    filePath: req.body.filePath,
    category: req.body.category,
    views: req.body.views,
    duration: req.body.duration,
    thumbnail: req.body.thumbnail
  })

  video.save((err, doc) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })
})

router.post('/addRecipe', (req, res) => {
  const recipe = new Recipe(req.body)

  recipe.save((err, doc) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })
})

router.post('/addUserAuditory', (req, res) => {
  console.log('Aca esta el body de auditoria', req.body)
  const loginAuditori = new LoginAuditory(req.body)

  loginAuditori.save((err, doc) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })
})

router.post('/addJob', (req, res) => {
  const job = new Job(req.body)

  job.save((err, doc) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })
})

router.get('/getUsersAuditory', (req, res) => {
  LoginAuditory.find()
    .populate('_id')
    .exec((err, data) => {
      if (err) return res.status(400).send(err)
      res.status(200).json({ success: true, data })
    })
})

module.exports = router
