const express = require('express')

const rootController = require('./renderers/root')
const examplesController = require('./renderers/example')
const govukDefaultTemplateController = require('./renderers/govukDefaultTemplate')
const componentController = require('./renderers/component')

const router = express.Router()

router.use('/', rootController)
router.use('/examples-output', examplesController)
router.use('/govuk', govukDefaultTemplateController)
router.use('/govuk', componentController('govuk'))
router.use('/hmrc', componentController('hmrc'))

module.exports = router