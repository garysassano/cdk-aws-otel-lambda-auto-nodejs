# cdk-aws-lambda-otel-auto-instrumentation

CDK app that demonstrates OpenTelemetry [zero-code instrumentation](https://opentelemetry.io/docs/concepts/instrumentation/zero-code/) in AWS Lambda using Node.js runtime. It uses [ADOT Lambda layer](https://github.com/aws-observability/aws-otel-lambda) for sending trace data to Honeycomb.

### Related Apps

- [cdk-aws-lambda-otel-code-instrumentation](https://github.com/garysassano/cdk-aws-lambda-otel-code-instrumentation) - Uses OpenTelemetry code instrumentation instead of auto.

## Prerequisites

- **_AWS:_**
  - Must have authenticated with [Default Credentials](https://docs.aws.amazon.com/cdk/v2/guide/cli.html#cli_auth) in your local environment.
  - Must have completed the [CDK bootstrapping](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html) for the target AWS environment.
- **_Honeycomb:_**
  - Must have set the `HONEYCOMB_API_KEY` variable in your local environment.
- **_Node.js + npm:_**
  - Must be [installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) in your system.

## Installation

```sh
npx projen install
```

## Deployment

```sh
npx projen deploy
```

## Cleanup

```sh
npx projen destroy
```
