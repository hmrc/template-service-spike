const express = require('express')

const rootController = require('../controllers/rootController')
const examplesController = require('../controllers/examplesController')
const componentController = require('../controllers/componentController')

const router = express.Router()

router.use('/example-usage', examplesController)
router.use('/component', componentController)
router.use(rootController)

module.exports = router