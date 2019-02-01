# initiative-tracker

### Motivation

The initiative-tracker project is a solution used to deploy AWS resources that support the cloud infrastructure that manages the data and enables the interactivity of the initiative-tracker salckbot. The goals of this solution is to create a salck-bot application that tracks the initiatives that are going on in the office.

The ny-serverless-workshop group created this project in order to provide a canvas for developers to get familiar with the slack API and test out different serverless patterns and architectures.

### Architecture
The serverless solution is written in tyescript and built for running on nodejs. It deploys multiple AWS Lambda functions and a DynamoDB table used to manage the data. It has CI/CD configurations for CircleCI and has Epsagon integration configured for monitoring and logging of the execution of the Lambda functions. 


### Access Needed

* [Slack](https:/initativetracker.slack.com)
* [Pariveda Serverless AWS](https://pariveda-serverless.signin.aws.amazon.com/)
* [Epsagon](https://pariveda-serverless.signin.aws.amazon.com/) - serverless monitoring tool
* [CircleCI](/) - CI/CD pipelines

### Prerequisites

```
node 8 or 10
```

### Setup

```
npm install
```

