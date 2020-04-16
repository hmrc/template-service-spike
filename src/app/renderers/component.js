const express = require('express')
const bodyParser = require('body-parser')

const jsonParser = bodyParser.json()

const orgs = require('../constants').orgs

const {
  getComponentIdentifier,
  renderNunjucks
} = require('../util')

const createRouterForOrg = (orgString) => {
  const router = express.Router()

  router.post('/:version/components/:component', jsonParser, async (req, res) => {
    const component = req.params.component

    const org = orgs[orgString];
    const params = JSON.stringify(req.body, null, 2)
    const nunjucksString = `{% from '${getComponentIdentifier(component)}/macro.njk' import ${component} %}{{${component}(${params})}}`
    await renderNunjucks(req.params.version, org, res, nunjucksString);
  })

  return router
}

module.exports = createRouterForOrg
