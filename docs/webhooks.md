---
sidebar_position: 8
---

# Webhooks

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

* `topic` is the topic of this webhook in the format `<resource>.<event>`. Currently we support webhooks for the following topics:
    * `end_user.processed`
    * `end_user.reviewed`
    * `end_user.transactions_updated`

* `created` is the UTC datetime when the webhook was sent, in ISO format.
* `data` contains the data of the resource which relates to this event.
* `meta` (optional) contains further information about the event.

## Verification

We send a `Heron-Signature` header in every webhook request. This header is a
base64-encoded HMAC SHA256 digest of your shared secret (*not* your API
password) and the webhook's payload.

To verify the webhook was sent by us, calculate the digital signature using the
same algorithm and compare it to the `Heron-Signature` header.

Here is an example of how to calculate the signature in Python:

```py
import base64
import hashlib
import hmac
import json

secret = "sec_..." # shared secret, *not* API password
data = {"topic": "end_user.processed", ...}

message = json.dumps(data, separators=(",", ":"))

dig = hmac.new(
    secret.encode("utf-8"),
    msg=message.encode("utf-8"),
    digestmod=hashlib.sha256,
).digest()

signature = base64.b64encode(dig).decode()
```

And in JavaScript (Node):

```js
const crypto = require('crypto')

const secret = 'sec_...' // shared secret, *not* API password
const data = {"topic": "end_user.processed", ...}

const signature = crypto
  .createHmac('sha256', secret)
  .update(JSON.stringify(data))
  .digest('base64')
```
