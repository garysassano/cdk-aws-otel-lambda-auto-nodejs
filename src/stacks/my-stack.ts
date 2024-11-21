import { Duration, Stack, StackProps } from "aws-cdk-lib";
import {
  Architecture,
  LayerVersion,
  LoggingFormat,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";
import { validateEnv } from "../utils/validate-env";

const env = validateEnv(["HONEYCOMB_API_KEY"]);

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    // ADOT Lambda layer for auto-instrumentation
    const adotLayer = LayerVersion.fromLayerVersionArn(
      this,
      "AdotLayer",
      "arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-18-1:4",
    );

    // Lambda function sending trace data to Honeycomb
    new NodejsFunction(this, "AdotAutoLambda", {
      functionName: "adot-auto-lambda",
      entry: join(__dirname, "..", "functions", "adot-auto", "index.ts"),
      layers: [adotLayer],
      runtime: Runtime.NODEJS_22_X,
      architecture: Architecture.ARM_64,
      timeout: Duration.minutes(1),
      memorySize: 1024,
      loggingFormat: LoggingFormat.JSON,
      environment: {
        AWS_LAMBDA_EXEC_WRAPPER: "/opt/otel-handler",
        OPENTELEMETRY_COLLECTOR_CONFIG_FILE: "/var/task/collector-confmap.yml",
        OTEL_LAMBDA_DISABLE_AWS_CONTEXT_PROPAGATION: "true",
        OTEL_SERVICE_NAME: "adot-auto-lambda",
        OTEL_PROPAGATORS: "tracecontext",
        OTEL_TRACES_SAMPLER: "always_on",
        // OTEL_EXPORTER_OTLP_PROTOCOL: "http/protobuf",
        // OTEL_EXPORTER_OTLP_ENDPOINT: "https://api.honeycomb.io:443",
        // OTEL_EXPORTER_OTLP_HEADERS: `x-honeycomb-team=${env.HONEYCOMB_API_KEY}`,
        HONEYCOMB_API_KEY: env.HONEYCOMB_API_KEY,
      },
      bundling: {
        commandHooks: {
          beforeBundling(inputDir: string, outputDir: string): string[] {
            return [
              `cp ${inputDir}/src/functions/adot-auto/collector-confmap.yml ${outputDir}`,
            ];
          },
          afterBundling() {
            return [];
          },
          beforeInstall() {
            return [];
          },
        },
      },
    });
  }
}
