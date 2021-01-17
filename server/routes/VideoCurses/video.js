const express = require('express')
const router = express.Router()
const multer = require('multer')

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(ffmpegPath)

const { Video } = require('../../models/Video')
//const { Subscriber } = require('../../models/Subscriber')
const { auth } = require('../../middleware/auth')
let myDate = new Date().toISOString().replace(/:/g, '-')
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'server/uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, `${myDate}_${file.originalname}`)
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    if (ext !== '.mp4') {
      return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false)
    }
    cb(null, true)
  }
})

var upload = multer({ storage: storage }).single('file')

//=================================
//             Video
//=================================

router.post('/uploadfiles', (req, res) => {
  upload(req, res, err => {
    if (err) {
      return res.json({ success: false, err })
    }
    return res.json({
      success: true,
      filePath: res.req.file.path,
      fileName: res.req.file.filename
    })
  })
})

router.post('/thumbnail', (req, res) => {
  let thumbsFilePath = ''
  let fileDuration = ''
  console.log(thumbsFilePath, fileDuration)
  ffmpeg.ffprobe(req.body.filePath, function(err, metadata) {
    console.log(err)
    fileDuration = metadata.format.duration
  })

  ffmpeg(req.body.filePath)
    .on('filenames', function(filenames) {
      thumbsFilePath = 'server/uploads/thumbnails/' + filenames[0]
    })
    .on('end', function() {
      console.log('Screenshots taken')
      return res.json({
        success: true,
        thumbsFilePath: thumbsFilePath,
        fileDuration: fileDuration
      })
    })
    .screenshots({
      // Will take screens at 20%, 40%, 60% and 80% of the video
      count: 3,
      folder: 'server/uploads/thumbnails',
      size: '320x240',
      // %b input basename ( filename w/o extension )
      filename: 'thumbnail-%b.png'
    })
})

router.get('/getVideos', (req, res) => {
  Video.find()
    .populate('_id')
    .exec((err, videos) => {
      if (err) return res.status(400).send(err)
      res.status(200).json({ success: true, videos })
    })
})

router.post('/uploadVideo', (req, res) => {
  const video = new Video({
    title: req.body.title,
    description: req.body.description,
    privacy: req.body.privacy,
    filePath: 'uploads/Curso_Basico_Utensillos.mp4',
    category: req.body.category,
    views: req.body.views,
    duration: req.body.duration,
    thumbnail: 'uploads/thumbnails/CocinaBasica.png'
  })

  video.save((err, video) => {
    if (err) return res.status(400).json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })
})
///////
router.post('/getVideo', (req, res) => {
  console.log(req.body)
  Video.findById(req.body._id).exec((err, video) => {
    if (err) return res.status(400).send(err)
    res.status(200).json({ success: true, video })
  })
})
/*
router.post('/getSubscriptionVideos', (req, res) => {
  //Need to find all of the Users that I am subscribing to From Subscriber Collection

  Subscriber.find({ userFrom: req.body.userFrom }).exec((err, subscribers) => {
    if (err) return res.status(400).send(err)

    let subscribedUser = []

    subscribers.map((subscriber, i) => {
      subscribedUser.push(subscriber.userTo)
    })

    //Need to Fetch all of the Videos that belong to the Users that I found in previous step.
    Video.find({ writer: { $in: subscribedUser } })
      .populate('writer')
      .exec((err, videos) => {
        if (err) return res.status(400).send(err)
        res.status(200).json({ success: true, videos })
      })
  })
})
*/
module.exports = router
