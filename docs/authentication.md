---
sidebar_position: 2
---

# Authentication

## Dashboard

Upon onboarding, you will receive a set of dashboard credentials consisting of a
`username` (usually your email) and `password` to your email address. You can
use these to log into [dashboard.herondata.io](https://dashboard.herondata.io/).

If you haven't received access, please speak to your Heron rep, or email us at
hello@herondata.io.

To reset your password, go to the [Forgot your
password](https://dashboard.herondata.io/auth/forgot) page. You will receive an
email with instructions.

:::info
If you want to try our merchant capabilities without credentials, visit our [try page](https://www.herondata.io/try).
:::

## API

Once you have used your dashboard credentials to log in, you will be able to
see your API credentials (`username` and `api_key`) in the dashboard under
`Settings`.

We use [Basic access
authentication](https://en.wikipedia.org/wiki/Basic_access_authentication).
This means you should send the base64-encoded version of your API credentials `username:api_key` in the `Authorization: Basic` header.

Most modern HTTP libraries handle the encoding for you, but here's a
step-by-step example for clarity:

1. Encode your `username` and `api_key` to get your token:

    ```jsx
    echo -n "<username>:<api_key>" | openssl base64
    ```

2. Add the output of the above command in the `Authorization` header:

    ```jsx
    curl "https://app.herondata.io/api/hello_world/authenticated" \
    --header 'Authorization: Basic <base-64-encoded-token>'
    ```

## Development vs Production

We handle development and production environments at the credential level. We will
issue you with a set of dashboard and API credentials you can use for development purposes during
your trial / onboarding phase.

When you’re ready to move to production, please contact us, and we will issue
you a set of production credentials.
