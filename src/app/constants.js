const path = require('path')

const pathFromRoot = (...parts) => path.join(__dirname, '..', ...parts)

const constants = {
  govukFrontendRoot: path.resolve('src/dependencies/govuk-frontend'),
  hmrcFrontendRoot: path.resolve('src/dependencies/hmrc-frontend'),
  govukDesignSystemRoot: path.resolve('src/dependencies/alphagov/govuk-design-system'),
  hmrcDesignSystemRoot: path.resolve('src/dependencies/hmrc/design-system'),
  pathFromRoot,
  readMe: path.resolve('README.md'),
  substitutionMap: {
    'input': 'text-input'
  }
}

constants.orgs = {
  'govuk': {
    label: 'govuk-frontend',
    minimumSupported: 3,
    paths: [
      `${constants.govukFrontendRoot}/govuk/components`,
    ]
  },
  'hmrc': {
    label: 'hmrc-frontend',
    minimumSupported: 1,
    paths: [
      `${constants.hmrcFrontendRoot}/hmrc/components`
    ]
  }
}

module.exports = constants