const router = require('express').Router()
let Entry = require('../models/entry.model.js')

router.route('/').get((req, res) => {
  Entry.find()
    .then(entries => res.json(entries))
    .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/create').post((req, res) => {
  const name = req.body.name
  const time = req.body.time
  const newEntry = new Entry({ name, time })

  newEntry
    .save()
    .then(() => res.json('Entry created!'))
    .catch(err => res.status(400).json('Error: ' + err))
})

module.exports = router