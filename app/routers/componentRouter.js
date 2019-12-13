const express = require('express')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const router = express.Router()

const nunjucks = require('../../lib/nunjucks')

const {
  getComponentIdentifier,
  getGovukFrontend,
  getHmrcFrontend
} = require('../../util')

const govukComponentController = async (req, res) => {
  const {
    body = {},
    params: {
      version,
      component
    }
  } = req

  if (parseFloat(version) < 3) {
    res.status(500).send('This version of govuk-frontend is not supported')
  } else {
    await getGovukFrontend(version)

    const params = JSON.stringify(body, null, 2)
    try {
      const nunjucksString = `{% from '${getComponentIdentifier(component)}/macro.njk' import ${component} %}{{${component}(${params})}}`
      res.send(nunjucks.renderString(nunjucksString))
    } catch (err) {
      res.status(500).send(err)
    }
  }
}


const hmrcComponentController = async (req, res) => {
  const {
    body = {},
    params: {
      version,
      component
    }
  } = req

  if (parseFloat(version) < 1) {
    res.status(500).send('This version of hmrc-frontend is not supported')
  } else {
    await getHmrcFrontend(version)

    const params = JSON.stringify(body, null, 2)
    try {
      const nunjucksString = `{% from '${getComponentIdentifier(component)}/macro.njk' import ${component} %}{{${component}(${params})}}`
      res.send(nunjucks.renderString(nunjucksString))
    } catch (err) {
      res.status(500).send(err)
    }
  }
}



router.post('/govuk/:version/components/:component', jsonParser, govukComponentController)
router.post('/hmrc/:version/components/:component', jsonParser, hmrcComponentController)

module.exports = router
