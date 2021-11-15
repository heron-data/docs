---
sidebar_position: 5
---

# Transactions

!!! info
    For more detailed API specs, see our [OpenAPI Docs](https://app.herondata.io/docs)

## Posting and enriching transactions

!!! warning
    We recommend batching transactions to a maximum of 1,000 per `POST` request
    to avoid timeouts.
    For instructions on how to batch transactions and get enrichments across
    batches, see [Async Flow](/async).

You can `POST` transactions to the `/transactions` endpoint, where the body of the expected request is of the following format:

```json
{
  "transactions": [
    {
      "description": "string",
      "amount": -50.00,
      "currency": "USD",
      "timestamp": "2020-11-24T18:46:13+00:00",
      "end_user_id": "string",
      "account_id": "string",
      "reference_id": "string",
      "transaction_code": "string",
      "mcc_code": "7641",
      "categories_default": "string"
    }
  ]
}
```

Where the fields are as follows:

* `description` (`string`)<span style="color:red">\*</span> Transaction description.
* `amount` (`float`)<span style="color:red">\*</span> Transaction amount. We expect account inflows (credits) to be positive, account outflows (debits) to be negative. <span style="color:red">For transactions pulled with Plaid, please flip the amount sign for all transactions.</span>
* `currency` (`string`)<span style="color:red">\*</span> 3 letter ISO code for currency, e.g., `USD`
* `timestamp` (`timestamp`)<span style="color:red">\*</span> Timestamp of the transaction, in UTC.
* `end_user_id` (`string`)<span style="color:red">\*</span>  Unique identifier for the end user (i.e. your customer or applicant) who generated this transaction
* `account_id` (`string`)  Unique identifier for the account of the end user that contains the transaction. (Plaid: `transactions.account_id`; Yodlee: `transaction.accountId`; Finicity: `transaction.accountId`; Truelayer: `account_id`)
* `reference_id` (`string`) Unique identifier for the transaction
* `transaction_code` (`string`) Refers a general description of the payment method. (Plaid: `payment_channel`; Yodlee: `transaction.type`; Finicity: `transaction.type`; Truelayer: `results.transaction_category`)
* `mcc_code` (`string`) is the 4 digit [Merchant category code](https://en.wikipedia.org/wiki/Merchant_category_code)
* `categories_default` (`string` or list of `string`) Can be be used to pass any categories provided with the data. (Plaid: `transactions.category`; Yodlee: `transaction.category`, Finicity: `transaction.categorisation.category`; Truelayer:`results.transaction_classification`)

<font size="2"> <span style="color:red">\*</span> Required</font>

Example request:

```bash
curl --location --request POST 'https://app.herondata.io/api/transactions/' \
--header '<your-authorisation>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "transactions": [
         {
        "amount": -4000,
        "currency": "USD",
        "description": "STRIPE TRANSFER ST-CY098123KA TECHNOLOGY INC"
        }
    ]
}'
```

Response includes a summary and transactions field:

```json
{
  "_summary": {
    "transactions_loaded": 1,
    "transactions_categorised": 1
    "request_id": "3569753f-7f07-48de-9c50-841b8a497831"
  },
  "transactions": [
     {
        ...,
        "description_clean": "cleaner_description",
        "merchant": {
            "heron_id": "mrc_nF5uQ1LPBJn5RErH8QGeTH",
            "name": "merchant_name",
            "url": "https://some_merchant_url.com",
            "logo_url": "https://url_to_logo.com/merchant_logo.png"
        },
        "is_recurring": true,
        "has_matching_transaction": true,
        "is_potential_duplicate": false,
        "categories": [
            {
                "label": "some_category_label",
                "annotator_priority_type": "annotator_source_for_label",
                "confidence": 0.9,
                "model_version": "string",
                "heron_id": "ctg_nF5uQxLPBJn5RErH8QGeTH"
            }
        ]
     }
  ]
}
```
where:

* `description_clean` (`string`) is a substring of the original description string.
* `merchant` (`dict`) contains the clean name of the merchant (not necessarily a substring of the original description) and the associated url for display back to your customer. We also return a `heron_id` which is a unique identifier for the merchant.
* `is_recurring` (`boolean`) indicates recurrence of transactions
* `has_matching_transaction` (`boolean`) indicates whether a corresponding transaction (inverse amount with timestamp in close proximity) exists
* `is_potential_duplicate` (`boolean`) flags whether this transaction may be duplicated in the batch of transactions
* `categories` (`dict`) contains the category label (from your specific taxonomy), the source of the annotation (`manual_review`, `heuristics` or `classifier`), the confidence where applicable, model version, and `heron_id` which is a unique identifier for the category.

Here, you can use the `request_id` to later `GET` transactions which are
processed asynchronously for improved accuracy/confidence.

## Reading transactions

As expected, you can also issue `GET` requests to the `/transactions` endpoint.
This returns a paginated response. You can modify the request with the
following optional query parameters:

* `created_date_min` (`date`) filters for earliest uploaded date for transaction of form `YYYY-MM-DD`, inclusive. `date(Transaction.created) >= created_date_min`
* `created_date_max` (`date`) filters for latest uploaded date for transaction of form `YYYY-MM-DD`, inclusive. `date(Transaction.created) <= created_date_max`
* `timestamp_date_min` (`date`) filters for timestamp property of transaction of form `YYYY-MM-DD`, inclusive. `date(Transaction.timestamp) >= timestamp_date_min`
* `timestamp_date_max` (`date`) filters for timestamp property of transaction of form `YYYY-MM-DD`, inclusive. `date(Transaction.timestamp) <= timestamp_date_max`
* `end_user_id` (`string`) filters for end_user_id (if any) associated uploaded transactions
* `request_id` (`string`) filters transactions uploaded in a given `POST` request
* `page` (`integer`) page number for pagination, default 1
* `limit` (`integer`) items to return per page, default 100

An example request would look like:

```bash
curl --location --request GET 'https://app.herondata.io/api/transactions/?from_date=2020-11-15&to_date=2020-11-20&page=2&limit=20' \
--header '<your-authorisation>'
```

Which would yield a response similar to:

```json
{
    "_summary": {
        "transactions": 0,
        "returned_transactions": 0
    },
    "_meta": {
        "page": 2,
        "pages": 0,
        "per_page": 20,
        "next_url": null,
        "prev_url": "/api/transactions?from_date=2020-11-15&page=1&limit=20&to_date=2020-11-20"
    },
    "transactions": [
        {...}
    ]
}
```

Where `_meta` contains the information necessary to navigate through the pagination.

## Feedback

In order to continuously improve out categorisation models, you may want to
provide corrected categorisations yourself or enable your end users to correct
categorisation. Please speak to your Heron Data contact to specify how this
feedback should be taken into account for future transactions.

We enable this through a `PUT` request to `/transactions/{heron_id}/feedback`,
where the body of the request is of schema:

```json
{
    "transaction": {
        "category": {
            "heron_id": "string",
            "label": "Other Expenses"
        },
        "merchant": {
            "heron_id": "string",
            "name": "Merchant Name",
            "is_correct": false
        }
    }
}
```

Where:

* `category` can contain the `heron_id` or `label` of the correct category.
  Changes made here apply instantly to the transaction, and will be taken into
  account in future ML model retrains.
* `merchant` can contain the `heron_id` or `name` of the correct merchant, or a
  boolean `is_correct` if the merchant is not known but you'd still like to
  provide feedback. If `is_correct` is `true`, we disregard all other fields.
  Only one of these tree fields is required. Changes here will be reviewed and
  confirmed manually, and will improve future merchant
  matches.

So an example request would look as follows:

``` bash
curl --location --request PUT https://app.herondata.io/api/transactions/txn_abcdefg/feedback' \
--header '<your-authorisation>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "transaction": {
        "category": {
            "heron_id": "ctg_abcdefg"
        }
    }
}'
```
