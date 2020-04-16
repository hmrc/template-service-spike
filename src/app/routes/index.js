const express = require('express')

const rootController = require('../controllers/rootController')
const examplesController = require('../controllers/examplesController')
const govukDefaultTemplateController = require('../controllers/govukDefaultTemplateController')
const componentController = require('../controllers/componentController')

const router = express.Router()

router.use('/', rootController)
router.use('/examples-output', examplesController)
router.use('/govuk', govukDefaultTemplateController)
router.use('/govuk', componentController('govuk'))
router.use('/hmrc', componentController('hmrc'))

module.exports = router