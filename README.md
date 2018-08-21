# The Times Sport Alexa skill

> Alexa skill to get regular updates, and access to The Game podcast

[ ![Codeship Status for times/times-sport-alexa-skill](https://app.codeship.com/projects/63c17b80-378c-0136-f8a8-6631ac296a0c/status?branch=master)](https://app.codeship.com/projects/289712)

## Local setup

To get the code up and running locally:

1.  Install dependencies

        $ yarn

2.  Copy `env.sample.yml` to `env.yml` and complete

## Tests

Run the test suite with:

```bash
$ yarn test
```

## Deployment

The skill deploys to AWS Lambda, with the following command:

    $ yarn deploy --deploymentBucket= --profile= --stage=[dev] --region=[eu-west-1]

_Ensure you pass the `--deploymentBucket` and `--profile` arguments. The `--stage` and `--region` arguments are optional._
