const request = require("supertest")
const fs = require('fs')
const marked = require('marked')

const { readMe } = require('../constants')

const app = require("./")

expectHtmlToMatch = (expected, actual) => {
  const normalise = str => str.replace(/\s+/g, "\n").trim()
  expect(normalise(expected)).toBe(normalise(actual))
}

describe("Templates as a service... again!", () => {

  describe('HMRC component endpoint', () => {
    it("should return 500 and an error if the version requested is older than 1.0.0", () => {
      return request(app)
        .post("/component/hmrc/0.1.2/hmrcPageHeading")
        .send({ text: "Page heading from an unsupported version" })
        .expect(500)
        .then(response => {
          expect(response.text).toBe('This version of hmrc-frontend is not supported')
        })
    })

    it("should return a hmrc page heading", () => {
      const expected = `<header class="hmrc-page-heading">
  <h1 class="govuk-heading-xl">This heading</h1><p class="govuk-caption-xl hmrc-caption-xl"><span class="govuk-visually-hidden">This section is </span>That section</p></header>
`
      return request(app)
        .post("/component/hmrc/1.4.0/hmrcPageHeading")
        .send({
          text: "This heading",
          section: 'That section'
        })
        .expect(200)
        .then(response => {
          expect(response.text).toBe(expected)
        })
    })

  })

  describe('GOVUK component', () => {
    it("should return 500 and an error if the version requested is older than 3.0.0", () => {
      return request(app)
        .post("/component/govuk/2.3.4/govukButton")
        .send({ text: "Button from an unsupported version" })
        .expect(500)
        .then(response => {
          expect(response.text).toBe('This version of govuk-frontend is not supported')
        })
    })

    it("should return an older version of govukbutton", () => {
      const expected = `<button type="submit" class="govuk-button" data-module="govuk-button">
  Button from an older version
</button>`

      return request(app)
        .post("/component/govuk/3.0.0/govukButton")
        .send({ text: "Button from an older version" })
        .expect(200)
        .then(response => {
          expect(response.text).toBe(expected)
        })
    })

    it("should return a govukbutton", () => {
      const expected = `<button class="govuk-button" data-module="govuk-button">
  Save and continue
</button>`

      return request(app)
        .post("/component/govuk/3.3.0/govukButton")
        .send({ text: "Save and continue" })
        .expect(200)
        .then(response => {
          expect(response.text).toBe(expected)
        })
    })

    it("should be able to respond to old an new versions simultaneously", () => {
      const input = { text: "Button Example", isStartButton: true }
      const older = request(app)
        .post("/component/govuk/3.0.0/govukButton")
        .send(input)
        .expect(200)
        .then(response => {
          expect(response.text.startsWith('<button type="submit" class="govuk-button')).toBe(true)
          expect(response.text.includes('role="presentation"')).toBe(true)
          expect(response.text.includes('aria-hidden="true"')).toBe(false)
        })

      const medium = request(app)
        .post("/component/govuk/3.3.0/govukButton")
        .send(input)
        .expect(200)
        .then(response => {
          expect(response.text.startsWith('<button class="govuk-button')).toBe(true)
          expect(response.text.includes('role="presentation"')).toBe(true)
          expect(response.text.includes('aria-hidden="true"')).toBe(false)
        })

      const newer = request(app)
        .post("/component/govuk/3.6.0/govukButton")
        .send(input)
        .expect(200)
        .then(response => {
          expect(response.text.startsWith('<button class="govuk-button')).toBe(true)
          expect(response.text.includes('role="presentation"')).toBe(false)
          expect(response.text.includes('aria-hidden="true"')).toBe(true)
        })

      return Promise.all([older, medium, newer])
    })

    it("should return the text I provided", () => {
      const expected = `<button class="govuk-button" data-module="govuk-button">
  I Waz &#39;ere
</button>`

      return request(app)
        .post("/component/govuk/3.3.0/govukButton")
        .send({ text: "I Waz 'ere" })
        .expect(200)
        .then(response => {
          expect(response.text).toBe(expected)
        })
    })

    it("should support a complex component", () => {
      const expected = `<div class="govuk-form-group govuk-form-group--error">
<fieldset class="govuk-fieldset" role="group" aria-describedby="passport-issued-hint passport-issued-error">
  <legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
    <h1 class="govuk-fieldset__heading">
      When was your passport issued?
    </h1>
  </legend>
  <span id="passport-issued-hint" class="govuk-hint">
    For example, 12 11 2007
  </span>
  <span id="passport-issued-error" class="govuk-error-message">
    <span class="govuk-visually-hidden">Error:</span> The date your passport was issued must be in the past
  </span>
  <div class="govuk-date-input" id="passport-issued">
    <div class="govuk-date-input__item">
      <div class="govuk-form-group">
        <label class="govuk-label govuk-date-input__label" for="passport-issued-day">
          Day
        </label>
        <input class="govuk-input govuk-date-input__input govuk-input--width-2 govuk-input--error" id="passport-issued-day" name="passport-issued-day" type="number" value="6" pattern="[0-9]*">
      </div>
    </div>
    <div class="govuk-date-input__item">
      <div class="govuk-form-group">
        <label class="govuk-label govuk-date-input__label" for="passport-issued-month">
          Month
        </label>
        <input class="govuk-input govuk-date-input__input govuk-input--width-2 govuk-input--error" id="passport-issued-month" name="passport-issued-month" type="number" value="3" pattern="[0-9]*">
      </div>
    </div>
    <div class="govuk-date-input__item">
      <div class="govuk-form-group">
        <label class="govuk-label govuk-date-input__label" for="passport-issued-year">
          Year
        </label>
        <input class="govuk-input govuk-date-input__input govuk-input--width-4 govuk-input--error" id="passport-issued-year" name="passport-issued-year" type="number" value="2076" pattern="[0-9]*">
      </div>
    </div>
  </div>
</fieldset>
</div>`

      return request(app)
        .post("/component/govuk/3.3.0/govukDateInput")
        .send({
          fieldset: {
            legend: {
              text: "When was your passport issued?",
              isPageHeading: true,
              classes: "govuk-fieldset__legend--xl"
            }
          },
          hint: {
            text: "For example, 12 11 2007"
          },
          errorMessage: {
            text: "The date your passport was issued must be in the past"
          },
          id: "passport-issued",
          namePrefix: "passport-issued",
          items: [
            {
              classes: "govuk-input--width-2 govuk-input--error",
              name: "day",
              value: "6"
            },
            {
              classes: "govuk-input--width-2 govuk-input--error",
              name: "month",
              value: "3"
            },
            {
              classes: "govuk-input--width-4 govuk-input--error",
              name: "year",
              value: "2076"
            }
          ]
        })
        .expect(200)
        .then(response => {
          expectHtmlToMatch(response.text, expected)
        })
    })

    it("should render without parameters when none are provided", () => {
      const expected = `<footer class="govuk-footer " role="contentinfo">
  <div class="govuk-width-container ">

    <div class="govuk-footer__meta">
      <div class="govuk-footer__meta-item govuk-footer__meta-item--grow">

        <svg
            role="presentation"
            focusable="false"
            class="govuk-footer__licence-logo"
            xmlns="http://www.w3.org/2000/svg"
            viewbox="0 0 483.2 195.7"
            height="17"
            width="41"
        >
          <path
              fill="currentColor"
              d="M421.5 142.8V.1l-50.7 32.3v161.1h112.4v-50.7zm-122.3-9.6A47.12 47.12 0 0 1 221 97.8c0-26 21.1-47.1 47.1-47.1 16.7 0 31.4 8.7 39.7 21.8l42.7-27.2A97.63 97.63 0 0 0 268.1 0c-36.5 0-68.3 20.1-85.1 49.7A98 98 0 0 0 97.8 0C43.9 0 0 43.9 0 97.8s43.9 97.8 97.8 97.8c36.5 0 68.3-20.1 85.1-49.7a97.76 97.76 0 0 0 149.6 25.4l19.4 22.2h3v-87.8h-80l24.3 27.5zM97.8 145c-26 0-47.1-21.1-47.1-47.1s21.1-47.1 47.1-47.1 47.2 21 47.2 47S123.8 145 97.8 145"
          />
        </svg>
        <span class="govuk-footer__licence-description">
          All content is available under the
          <a
              class="govuk-footer__link"
              href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
              rel="license"
          >Open Government Licence v3.0</a>, except where otherwise stated
        </span>
      </div>
      <div class="govuk-footer__meta-item">
        <a
            class="govuk-footer__link govuk-footer__copyright-logo"
            href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/"
        >© Crown copyright</a>
      </div>
    </div>
  </div>
</footer>
`

      return request(app)
        .post("/component/govuk/3.3.0/govukFooter")
        .send()
        .expect(200)
        .then(response => {
          expectHtmlToMatch(response.text, expected)
        })
    })
  })

  describe('Examples output', () => {
    const expected = [
      {
        html: `<div class=\"govuk-form-group\">
  <label class=\"govuk-label\" for=\"file-upload-1\">
    Upload a file
  </label>
  <input class=\"govuk-file-upload\" id=\"file-upload-1\" name=\"file-upload-1\" type=\"file\">
</div>`,
        name: 'file-upload/default',
        nunjucks: `{% from \"govuk/components/file-upload/macro.njk\" import govukFileUpload %}

{{ govukFileUpload({
  id: \"file-upload-1\",
  name: \"file-upload-1\",
  label: {
    text: \"Upload a file\"
  }
}) }}`,
      },
      {
        html: `<div class=\"govuk-form-group govuk-form-group--error\">
  <label class=\"govuk-label\" for=\"file-upload-1\">
    Upload a file
  </label>
  <span id=\"file-upload-1-error\" class=\"govuk-error-message\">
  <span class=\"govuk-visually-hidden\">Error:</span> The CSV must be smaller than 2MB
  </span>
  <input class=\"govuk-file-upload govuk-file-upload--error\" id=\"file-upload-1\" name=\"file-upload-1\" type=\"file\" aria-describedby=\"file-upload-1-error\">
</div>`,
        name: 'file-upload/error',
        nunjucks: `{% from \"govuk/components/file-upload/macro.njk\" import govukFileUpload %}

{{ govukFileUpload({
  id: \"file-upload-1\",
  name: \"file-upload-1\",
  label: {
    text: \"Upload a file\"
  },
  errorMessage: {
    text: \"The CSV must be smaller than 2MB\"
  }
}) }}`,
      }
    ]

    it('should return an array of examples with markup and Nunjucks hash', (done) => {
      return request(app)
        .get("/examples-output/govuk/file-upload")
        .expect(200)
        .then(response => {
          expect(response.body).toEqual(expected)
          done()
        })
    })

    it('should work if the request uses the macro name', (done) => {
      return request(app)
        .get("/examples-output/govuk/govukFileUpload")
        .expect(200)
        .then(response => {
          expect(response.body).toEqual(expected)
          done()
        })
    })

    it('should return a 500 if requested component does not exist', () => {
      return request(app)
        .get("/examples-output/govuk/foo")
        .expect(500)
    })

    it('should work with HMRC components', (done) => {
      return request(app)
        .get("/examples-output/hmrc/green-button")
        .expect(200)
        .then(response => {
          expect(response.body).toEqual([{
            name: "green-button/example",
            html: "<h1 class=\"govuk-heading-xl\">Check your National Insurance record</h1>\n\n<p class=\"govuk-body\">You can check your National Insurance record online to see:</p>\n\n<ul class=\"govuk-list govuk-list--bullet\">\n  <li>what you’ve paid, up to the start of the current tax year (6 April 2019)</li>\n  <li>any <a href=\"#\" class=\"govuk-link\">National Insurance credits</a> you’ve received</li>\n  <li>if gaps in contributions or credits mean some years do not count towards your State Pension (they are not ‘qualifying years’)</li>\n  <li>if you can pay <a href=\"#\" class=\"govuk-link\">voluntary contributions</a> to fill any gaps and how much this will cost</li>\n</ul>\n\n<p class=\"govuk-body\">\n  Your online record does not cover how much <a href=\"#\" class=\"govuk-link\">State Pension you’re likely to get</a>.\n</p>\n\n<button class=\"govuk-button govuk-button--start\" data-module=\"govuk-button\">\n  Start now\n  <svg class=\"govuk-button__start-icon\" xmlns=\"http://www.w3.org/2000/svg\" width=\"17.5\" height=\"19\" viewBox=\"0 0 33 40\" role=\"presentation\" focusable=\"false\">\n    <path fill=\"currentColor\" d=\"M0 0h13l20 20-20 20H0l20-20z\"/>\n  </svg>\n</button>",
            nunjucks: "{% from \"govuk/components/button/macro.njk\" import govukButton %}\n\n<h1 class=\"govuk-heading-xl\">Check your National Insurance record</h1>\n\n<p class=\"govuk-body\">You can check your National Insurance record online to see:</p>\n\n<ul class=\"govuk-list govuk-list--bullet\">\n  <li>what you’ve paid, up to the start of the current tax year (6 April 2019)</li>\n  <li>any <a href=\"#\" class=\"govuk-link\">National Insurance credits</a> you’ve received</li>\n  <li>if gaps in contributions or credits mean some years do not count towards your State Pension (they are not ‘qualifying years’)</li>\n  <li>if you can pay <a href=\"#\" class=\"govuk-link\">voluntary contributions</a> to fill any gaps and how much this will cost</li>\n</ul>\n\n<p class=\"govuk-body\">\n  Your online record does not cover how much <a href=\"#\" class=\"govuk-link\">State Pension you’re likely to get</a>.\n</p>\n\n{{ govukButton({\n  text: \"Start now\",\n  isStartButton: true\n}) }}"
          }])
          done()
        })
    })
  })

  describe('Root page', () => {
    it('should return rendered markdown of README.md', (done) => {
      let expected
      fs.readFile(readMe, 'utf8', (err, contents) => {
        expected = marked(contents)
      })

      return request(app)
        .get("/")
        .expect(200)
        .then(response => {
          expect(response.text).toEqual(expected)
          done()
        })
    })
  })

  describe('Unknown paths', () => {
    it('should return a 404', () => {
      return request(app)
        .get("/unknown-path")
        .expect(404)
    })
  })

})
