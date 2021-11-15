---
sidebar_position: 3
---

# Authentication

:::info
For more technical details, see our [API Reference](/api)
:::

:::tip Base URL
`https://app.herondata.io/api`
:::

## Basic Auth

We use [Basic access
authentication](https://en.wikipedia.org/wiki/Basic_access_authentication).
This means you should send the base64-encoded version of your
`username:password` in the `Authorization: Basic` header.

Most modern HTTP libraries handle the encoding for you, but here's a
step-by-step example for clarity:

1. Encode your `username` and `password` to get your token:

        echo -n "<username>:<password>" | openssl base64

2. Add the output of the above command in the `Authorization` header:

        curl "https://app.herondata.io/api/hello_world/authenticated" \
            --header 'Authorization: Basic <base-64-encoded-token>'
