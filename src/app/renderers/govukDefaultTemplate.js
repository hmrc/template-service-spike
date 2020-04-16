const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

const jsonParser = bodyParser.json()

const orgs = require('../constants').orgs

const {
  getNpmDependency,
  renderNunjucks
} = require('../util')

const govukTemplateNunjucks = ({
                                 htmlClasses,
                                 htmlLang,
                                 pageTitleLang,
                                 mainLang,
                                 assetPath,
                                 assetUrl,
                                 themeColor,
                                 bodyClasses,
                                 containerClasses,
                                 pageTitle,
                                 headIcons,
                                 head,
                                 bodyStart,
                                 skipLink,
                                 header,
                                 mainClasses,
                                 main,
                                 beforeContent,
                                 content,
                                 footer,
                                 bodyEnd
                               }) => `
{% extends 'govuk/template.njk' %}
${htmlClasses !== undefined ? `{% set htmlClasses = "${htmlClasses}" %}` : ''}
${htmlLang !== undefined ? `{% set htmlLang = "${htmlLang}" %}` : ''}
${pageTitleLang !== undefined ? `{% set pageTitleLang = "${pageTitleLang}" %}` : ''}
${mainLang !== undefined ? `{% set mainLang = "${mainLang}" %}` : ''}
${assetPath !== undefined ? `{% set assetPath = "${assetPath}" %}` : ''}
${assetUrl !== undefined ? `{% set assetUrl = "${assetUrl}" %}` : ''}
${themeColor !== undefined ? `{% set themeColor = "${themeColor}" %}` : ''}
${bodyClasses !== undefined ? `{% set bodyClasses = "${bodyClasses}" %}` : ''}
${containerClasses !== undefined ? `{% set containerClasses = "${containerClasses}" %}` : ''}
${pageTitle !== undefined ? `{% block pageTitle %}${pageTitle}{% endblock %}` : ''}
${headIcons !== undefined ? `{% block headIcons %}${headIcons}{% endblock %}` : ''}
${head !== undefined ? `{% block head %}${head}{% endblock %}` : ''}
${bodyStart !== undefined ? `{% block bodyStart %}${bodyStart}{% endblock %}` : ''}
${skipLink !== undefined ? `{% block skipLink %}${skipLink}{% endblock %}` : ''}
${header !== undefined ? `{% block header %}${header}{% endblock %}` : ''}
${mainClasses !== undefined ? `{% set mainClasses = "${mainClasses}" %}` : ''}
${main !== undefined ? `{% block main %}${main}{% endblock %}` : ''}
${beforeContent !== undefined ? `{% block beforeContent %}${beforeContent}{% endblock %}` : ''}
${content !== undefined ? `{% block content %}${content}{% endblock %}` : ''}
${footer !== undefined ? `{% block footer %}${footer}{% endblock %}` : ''}
${bodyEnd !== undefined ? `{% block bodyEnd %}${bodyEnd}{% endblock %}` : ''}
`

router.post('/:version/templates/default', jsonParser, async (req, res) => {
  const {
    body = {},
    params: {
      version
    }
  } = req


  const nunjucksString = govukTemplateNunjucks(body)

  await renderNunjucks(version, orgs.govuk, res, nunjucksString)
})

module.exports = router
