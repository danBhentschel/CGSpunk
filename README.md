## Chrome Web Store link

[https://chrome.google.com/webstore/detail/cg-spunk/bkmddelokmckldmgeeiheohknodgaphi](https://chrome.google.com/webstore/detail/cg-spunk/bkmddelokmckldmgeeiheohknodgaphi)

## Setting up for development

In the root directory of the repository:

`> npm install`

`> npm install -g gulp bower karma karma-jasmine jasmine-core karma-chrome-launcher`

`> bower install`


## While editing

1. Load the **app** directory as an unpacked extension: https://developer.chrome.com/extensions/getstarted#unpacked

2. Run `> gulp watch`

## Tests

`> karma start --single-run`

Or to run continuously while developing (recommended):

`> karma start`


## Building

`> gulp build`

To make a zip file:

`> gulp package`
