# Here’s the extensive documentation for the API:

### Environment requirements:

* [WGET](http://gnuwin32.sourceforge.net/packages/wget.htm) >= 1.19.1
* [Node](https://nodejs.org/en/) 10.15.1

## Running locally

* `npm install` will install the app dependencies
* `npm start` will run the service on port 3000 *

## Testing

* `npm test` will run the test suite *

\* _Note: If you find rate errors being triggered in the Github API you can pass in an auth token when you start the app like so: `TOKEN=<token> npm start / test`. You can generate an Auth token using your own Github account or request one from [#team-plat-ui](https://hmrcdigital.slack.com/messages/CJMUM9AG3) on HMRC Slack if you'd prefer_

## Usage

### 1.

`POST` to `/govuk/$$VERSION$$/components/$$COMPONENT_NAME$$` where `$$COMPONENT_NAME$$` is the name of the component from govuk-frontend (e.g. `govukSelect`, `govukButton`, `govukHeader`) and `$$VERSION$$` is the NPM package version (e.g. `3.0.0`, `3.1.0`), this must be 3.0.0 or greater.

The request body should contain JSON (therefore a `content-type: application/json` on the request) containing the parameters for the component.  For example:

Posting to `/govuk/3.3.0/components/govukButton` with a body of `{"text": "Save and continue"}` would return the HTML:

```
<button class="govuk-button" data-module="govuk-button">
  Save and continue
</button>
```

### 2.

`POST` to `/hmrc/$$VERSION$$/components/$$COMPONENT_NAME$$` where `$$COMPONENT_NAME$$` is the name of the component from hmrc-frontend (e.g. `hmrcPageHeading`) and `$$VERSION$$` is the NPM package version (e.g. `1.0.0`, `1.4.0`), this must be 1.0.0 or greater.

The request body should contain JSON (therefore a `content-type: application/json` on the request) containing the parameters for the component.  For example:

Posting to `/hmrc/1.4.0/components/hmrcPageHeading` with a body of `{"text": "Page heading"}` would return the HTML:

```
<header class="hmrc-page-heading">
  <h1 class="govuk-heading-xl">Page heading</h1>
</header>
```

### 3.

`POST` to `/govuk/$$VERSION$$/templates/default` where `$$VERSION$$` is the NPM package version (e.g. `1.0.0`, `1.4.0`), this must be 3.0.0 or greater.

The request body should contain JSON (therefore a `content-type: application/json` on the request) containing the parameters for the component.  For example:

Posting to `/govuk/3.6.0/templates/default` with a body of `{"htmlLang": "abc", "htmlClasses": "def", "beforeContent": "abcdefghijklmnop"}` would return the HTML:

```
<!DOCTYPE html>
<html lang="abc" class="govuk-template def">

<head>
	<meta charset="utf-8">
	<title>GOV.UK - The best place to find government services and information</title>
	<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
	<meta name="theme-color" content="#0b0c0c">

	<meta http-equiv="X-UA-Compatible" content="IE=edge">

	<link rel="shortcut icon" sizes="16x16 32x32 48x48" href="/ghi/jkl/mno/images/favicon.ico" type="image/x-icon">
	<link rel="mask-icon" href="/ghi/jkl/mno/images/govuk-mask-icon.svg" color="#0b0c0c">
	<link rel="apple-touch-icon" sizes="180x180" href="/ghi/jkl/mno/images/govuk-apple-touch-icon-180x180.png">
	<link rel="apple-touch-icon" sizes="167x167" href="/ghi/jkl/mno/images/govuk-apple-touch-icon-167x167.png">
	<link rel="apple-touch-icon" sizes="152x152" href="/ghi/jkl/mno/images/govuk-apple-touch-icon-152x152.png">
	<link rel="apple-touch-icon" href="/ghi/jkl/mno/images/govuk-apple-touch-icon.png">


[...]
```

### 4.

`GET` from `/examples-output/$$ORG$$/$$COMPONENT_NAME$$` where `$$ORG$$` is the owner of the design system (one of `hmrc` or `govuk`) and `$$COMPONENT_NAME$$` is the name of the component required e.g. `govukSelect`, `govukButton`, `hmrcAccountHeader`

The response will contain the HTML output of each available example for that component along with an MD5 hash of the HTML.

The response structure is as follows:

`
  [
    {
      html: '<div>some markup</div>',
      md5: '<an_md5_hash>',
      name: '<component_id>/<example_id>',
      nunjucks: '{% some Nunjucks %}'
    }
  ]
`

This is currently hosted at https://template-service-spike.herokuapp.com

Limitations for the current phase:
 - We don't currently support `caller` blocks being fed in