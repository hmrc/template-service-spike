const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

const jsonParser = bodyParser.json()

const orgs = require('../constants').orgs

const {
  renderNunjucks
} = require('../util')

function convertToNunjucks(variables, callback) {
  return Object.keys(variables).map(key => variables[key] !== undefined ? callback(key, variables[key]) : '').join('');
}

const govukTemplateNunjucks = (params) => `
{% extends 'govuk/template.njk' %}
${params.variables ? convertToNunjucks(params.variables, (key, value) => `{% set ${key} = "${value}" %}`) : ''}
${params.blocks ? convertToNunjucks(params.blocks, (key, value) => `{% block ${key} %}${value}{% endblock %}`) : ''}`

router.post('/:version/templates/default', jsonParser, async (req, res) => {
  const nunjucksString = govukTemplateNunjucks(req.body)

  console.log(nunjucksString)

  await renderNunjucks(req.params.version, orgs.govuk, res, nunjucksString)
})

module.exports = router
