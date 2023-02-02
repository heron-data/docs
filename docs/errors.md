---
sidebar_position: 6
---

# Errors

We structure all errors which occur in our application into a JSON object with keys:

* `code` (`integer`) - the HTTP status code
* `description` (`string` or `dict`) - a longer description of what went wrong
* `name` (`string`) - the error name

## Examples

### 404

```json
{
    "code": 404,
    "description": "Transaction not found",
    "name": "Not Found"
}
```

### 422

```json
{
    "code": 422,
    "description": {
        "json": {
            "merchant": {
                "_schema": [
                    "one of 'heron_id' or 'name' is required for merchant feedback"
                ]
            }
        }
    },
    "name": "Unprocessable Entity"
}
```

### 429

```json
{
    "code": 429,
    "description": "100 per 1 minute",
    "name": "Too Many Requests"
}
```

We have different rate limits per API endpoint and per customer. If you want to
know what your rate limit is, and how much of it you have remaining, we provide
response headers for each request you send us indicating this.

* `x-ratelimit-limit`: the number of requests per minute you can send
* `x-ratelimit-remaining`: the number of requests remaining within the current rate limit window
* `x-ratelimit-reset`: the Unix timestamp datetime when you limit resets

For example, if you receive:

```
x-ratelimit-limit: 100
x-ratelimit-remaining: 99
x-ratelimit-reset: 1675334140
```

It means the endpoint you're calling has a rate limit of `100` per minute. You
have `99` requests left in the current window. And your limit will be
replenished at `1675334140` which is `Thursday, 2 February 2023 10:35:40`.

We use a [Fixed Window](https://flask-limiter.readthedocs.io/en/stable/strategies.html#fixed-window)
algorithm to manage rate limits.


### 500

```json
{
    "code": 500,
    "description": "Something went wrong - sorry about that! If you continue having issues please email help@herondata.io",
    "name": "Internal Server Error"
}
```
