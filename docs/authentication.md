---
sidebar_position: 2
---

# Authentication

**Dashboard credentials**

Upon onboarding, you will receive a set of dashboard credentials consisting of a
`username` and `password` to your e-mail address. You can use these to log into our [dashboard](https://dashboard.herondata.io/). 

If you haven’t received access, please speak to your Heron rep, or e-mail us at hello@herondata.io.

To reset your password, navigate to the `Settings` tab on the left and press
`Reset`.

:::tip
If you want to try out our merchant capabilities without credentials, visit our [try page](https://www.herondata.io/try).
:::


**API credentials**

Once you have used your dashboard credentials to log in, you will be able to see your API credentials (`username` and `api_key`) in the dashboard under `Settings`.

**API access**

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

**Development vs Production**

We handle development and production environments at the credential level. We will
issue you with a set of dashboard and API credentials you can use for development purposes during
your trial / onboarding phase. 

When you’re ready to move to production, please contact us, and we will issue
you a set of production credentials.