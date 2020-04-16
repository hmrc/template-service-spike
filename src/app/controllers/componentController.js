const express = require('express')
const bodyParser = require('body-parser')

const jsonParser = bodyParser.json()

const orgs = require('../../constants').orgs

const {
  getComponentIdentifier,
  renderNunjucks
} = require('../../util')

const createRouterForOrg = (orgString) => {
  const router = express.Router()

  router.post('/:version/components/:component', jsonParser, async (req, res) => {

    const {
      body = {},
      params: {
        version,
        component
      }
    } = req

    const org = orgs[orgString];
    const params = JSON.stringify(body, null, 2)
    const nunjucksString = `{% from '${getComponentIdentifier(component)}/macro.njk' import ${component} %}{{${component}(${params})}}`
    await renderNunjucks(version, org, res, nunjucksString);
  })

  return router
}

module.exports = createRouterForOrg
