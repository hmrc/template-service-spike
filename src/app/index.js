const express = require('express')

const rootController = require('./renderers/root')
const examplesController = require('./renderers/example')
const govukDefaultTemplateController = require('./renderers/govukDefaultTemplate')
const componentController = require('./renderers/component')

const app = express()

app.use('/', rootController)
app.use('/examples-output', examplesController)
app.use('/govuk', govukDefaultTemplateController)
app.use('/govuk', componentController('govuk'))
app.use('/hmrc', componentController('hmrc'))

module.exports = app