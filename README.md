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

## Slack commands

`/register-initiative <initiative name>, <optional initiative description>`
`/list-initiatives`
`/say-hello`

### Motivation

The initiative tracker project is a solution used to deploy AWS resources that support the cloud infrastructure that manages the data and enables the interactivity of the initiative tracker slack-bot. The goals of this solution is to create a slack-bot application that tracks the initiatives that are going on in the office.

The ny-serverless-workshop group created this project in order to provide a canvas for developers to get familiar with the slack API and test out different serverless patterns and architectures.

### Architecture

The serverless solution is written in tyescript and built for running on nodejs. It deploys multiple AWS Lambda functions and a DynamoDB table used to manage the data. It has CI/CD configurations for CircleCI and has Epsagon integration configured for monitoring and logging of the execution of the Lambda functions.

### Access Needed

- [Slack](https://initativetracker.slack.com)
- [Pariveda Serverless AWS](https://pariveda-serverless.signin.aws.amazon.com/)
- [Epsagon](https://pariveda-serverless.signin.aws.amazon.com/) - serverless monitoring tool
- [CircleCI](/) - CI/CD pipelines

### Prerequisites

```
node 8 or 10
```

### Setup

```
npm install
```

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
