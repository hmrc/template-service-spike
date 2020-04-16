const express = require('express')
const router = express.Router()

const {
  getComponentIdentifier,
  getDataFromFile,
  getDependency,
  getDirectories,
  getNpmDependency,
  getLatestSha
} = require('../util')

const {
  govukDesignSystemRoot,
  hmrcDesignSystemRoot,
  substitutionMap
} = require('../constants')

const orgs = {
  'govuk': {
    name: 'alphagov/govuk-design-system',
    rootPath: govukDesignSystemRoot,
    componentRootPath: `${govukDesignSystemRoot}/src/components`,
    dependencies: ['govuk-frontend']
  },
  'hmrc': {
    name: 'hmrc/design-system',
    rootPath: hmrcDesignSystemRoot,
    componentRootPath: `${hmrcDesignSystemRoot}/src/examples`,
    dependencies: ['govuk-frontend', 'hmrc-frontend']
  }
}

router.get('/:org/:component', async (req, res) => {
  const componentIdentifier = getComponentIdentifier(req.params.component)
  const componentPath = `${(orgs[req.params.org].componentRootPath)}/${substitutionMap[componentIdentifier] || componentIdentifier}`

  const repoName = orgs[req.params.org].name
  const sha = await getLatestSha(repoName)
  await getDependency(
    repoName,
    `https://github.com/${repoName}/tarball/${sha}`,
    sha
  )

  for (const dependency of orgs[req.params.org].dependencies) {
    const version = require(`${(orgs[req.params.org].rootPath)}/package.json`).dependencies[dependency]
    const trimmedVersion = version
      .replace('v', '')
      .replace('^', '')
      .replace('~', '')
    await getNpmDependency(dependency, trimmedVersion)
  }

  try {
    const examples = getDirectories(componentPath)
    const output = []
    examples.forEach(example => {
      output.push(getDataFromFile(`${componentPath}/${example}/index.njk`, {
        name: `${componentIdentifier}/${example}`
      }))
    })

    Promise.all(output).then(result => {
      res.send(result)
    })
  } catch (err) {
    res.status(500).send(err)
  }
})

module.exports = router
