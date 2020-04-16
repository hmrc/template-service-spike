const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

const jsonParser = bodyParser.json()

const orgs = require('../constants').orgs

const {
  getNpmDependency,
  renderNunjucks
} = require('../util')

const addSetters = (params) => [
  'htmlClasses',
  'htmlLang',
  'pageTitleLang',
  'mainLang',
  'assetPath',
  'assetUrl',
  'themeColor',
  'bodyClasses',
  'mainClasses',
  'containerClasses'
].map(key => params[key] !== undefined ? `{% set ${key} = "${params[key]}" %}` : '').join('')

const addBlocks = (params) => [
  'pageTitle',
  'headIcons',
  'head',
  'bodyStart',
  'skipLink',
  'header',
  'main',
  'beforeContent',
  'content',
  'footer',
  'bodyEnd'
].map(key => params[key] !== undefined ? `{% block ${key} %}${params[key]}{% endblock %}` : '').join('')

const govukTemplateNunjucks = (params) => `
{% extends 'govuk/template.njk' %}
${addSetters(params)}
${addBlocks(params)}`



router.post('/:version/templates/default', jsonParser, async (req, res) => {
  const nunjucksString = govukTemplateNunjucks(req.body)

  await renderNunjucks(req.params.version, orgs.govuk, res, nunjucksString)
})

module.exports = router
