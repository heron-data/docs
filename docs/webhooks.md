---
sidebar_position: 8
---

# Webhooks

:::caution
Our webhook calls have a timeout of 10 seconds, so please ensure you send
back a `200` response within that time
:::

We can send notifications about the progress of certain async processes to a
URL of your choice. If you would like us to configure a webhook for a
particular topic, please contact us.

This is an example structure of our webhooks:

```json
{
    "topic": "end_user.processed",
    "created": "2021-05-20T09:23:53+00:00",
    "data": {
        "heron_id": "eus_Eqio3Y4dhyNiMphrXwG58p",
        "end_user_id": "myenduser",
        "status": "processed"
    },
    "meta": null
}
```

Where:

* `topic` is the event which triggered the webhook
* `created`is the UTC datetime when the webhook was sent, in ISO format
* `data` contains the object to which this event refers to
* `meta` (optional) contains further information about the event

## Verification

We send a `Heron-Signature` header in every webhook request. This header is a
base64-encoded HMAC SHA256 digest of your shared secret and the webhook's
payload.

To verify the webhook was sent by us, calculate the digital signature using the
same algorithm and compare it to the `Heron-Signature` header.

Here is an example of how to do this in Python and Flask, with the most
important lines highlighted:

```python {1-3,10,14-21}
import base64
import hashlib
import hmac

from flask import Flask, abort, request

app = Flask(__name__)

# shared secret between heron and you, *not* your API credentials
SHARED_SECRET = "sec_..."


def verify_webhook(data, heron_signature):
    digest = hmac.new(
        SHARED_SECRET.encode("utf-8"),
        msg=data.encode("utf-8"),
        digestmod=hashlib.sha256,
    ).digest()
    computed_hmac = base64.b64encode(digest).decode()

    return hmac.compare_digest(computed_hmac, heron_signature)


@app.route("/webhook", methods=["POST"])
def handle_webhook():
    data = request.get_data()

    if not verify_webhook(data, request.headers.get("Heron-Signature")):
        abort(401)

    # process webhook payload
    # ...

    return ("", 200)
```
