<p align="center">
  <img height="150" src="https://user-images.githubusercontent.com/2955468/52235823-33732b00-2893-11e9-825d-f535dda7ba13.jpg">
  <img height="150" src="https://user-images.githubusercontent.com/2955468/52139934-6e6d2880-261f-11e9-9bbf-cfacd1facf3a.png">
</p>

[![Build status][build-badge]][build-badge-url]
[![Known Vulnerabilities][vulnerability-badge]][vulnerability-badge-url]
[![Dependency Status][dependency-badge]][dependency-badge-url]
[![devDependency Status][dev-dependency-badge]][dev-dependency-badge-url]
[![License][license-badge]][license-badge-url]
[![Code style][formatter-badge]][formatter-badge-url]

# Initiative Tracker

Initiative Tracker is a slackbot which helps teams track the internal initiatives that people are working on. In addition to creating initiatives users can indicate their participation as an initiative champion or member and update the status of initiatives for others to see.

Available slash commands are:

- `/add-initiative [name], [optional description], [optional #channel]`
- `/show-initiatives [optional filter: 'public'], [optional filter: 'active' | 'abandoned' | 'complete' | 'on hold']`

## Architecture diagram

![Architecture diagram](/architecture/cloudcraft-diagram.png)

## Tools used to build this application

- [Serverless Framework](https://serverless.com/framework/docs/) for easy serverless development and deployment
- [TypeScript](https://www.typescriptlang.org/) for strongly typed JavaScript
- [CircleCI](https://circleci.com/) for application CI/CD - /.circleci/config.yml contains the job and workflow configurations
- [AWS](https://console.aws.amazon.com) for application and infrastructure hosting, primarily API Gateway, Lambda, and DynamoDB
- [IOPipe](https://www.iopipe.com/) for serverless logging and monitoring
- [Cloudcraft](https://cloudcraft.co/) for the architecture diagram

## Key libraries

- [Serverless plugin IOPipe](https://github.com/iopipe/serverless-plugin-iopipe): a serverless plugin which automatically wraps the Lambda functions for IOPipe logging
- [Serverless webpack](https://github.com/serverless-heaven/serverless-webpack): a plugin included with the serverless framework TypeScript template for compilation and bundling
- [Serverless plugin IAM Checker](https://github.com/manwaring/serverless-plugin-iam-checker): a serverless framework plugin which validates IAM policies and roles to make sure there are no overly permissive (e.g. \*) actions or resources
- [Serverless CloudFormation resource counter](https://github.com/drexler/serverless-cloudformation-resource-counter#readme): a serverless framework plugin which outputs the number of AWS resources deployed with the service
- [Nodejs Slack SDK](https://slackapi.github.io/node-slack-sdk/): the official Slack Nodejs library for calling their API
- [Lambda wrapper](https://github.com/manwaring/lambda-wrapper): a library which wraps Lambda functions to provide a better developer experience and implement boilerplate parsing, responses, logging, and monitoring

## Slack development resources

- [Slack API documentation](https://api.slack.com/methods)
- [Slack message formatting](https://api.slack.com/docs/message-formatting)
- [Slack interactive message documentation](https://api.slack.com/interactive-messages)
- [Slack block builder](https://api.slack.com/tools/block-kit-builder)

[build-badge]: https://circleci.com/gh/pariveda-serverless/initiative-tracker.svg?style=shield&circle-token=1e1369bd1b5bec6e28eaf499a98f8af0dc3dbe3e
[build-badge-url]: https://circleci.com/gh/pariveda-serverless/initiative-tracker
[dependency-badge]: https://david-dm.org/pariveda-serverless/initiative-tracker.svg
[dependency-badge-url]: https://david-dm.org/pariveda-serverless/initiative-tracker
[dev-dependency-badge]: https://david-dm.org/pariveda-serverless/initiative-tracker/dev-status.svg
[dev-dependency-badge-url]: https://david-dm.org/pariveda-serverless/initiative-tracker?type=dev
[formatter-badge]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[formatter-badge-url]: #badge
[license-badge]: https://img.shields.io/github/license/pariveda-serverless/initiative-tracker.svg
[license-badge-url]: https://github.com/pariveda-serverless/initiative-tracker
[vulnerability-badge]: https://snyk.io/test/github/pariveda-serverless/initiative-tracker/badge.svg?targetFile=package.json
[vulnerability-badge-url]: https://snyk.io/test/github/pariveda-serverless/initiative-tracker?targetFile=package.json
