---
sidebar_position: 9
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

### 500

```json
{
    "code": 500,
    "description": "Something went wrong - sorry about that! If you continue having issues please email help@herondata.io",
    "name": "Internal Server Error"
}
```
