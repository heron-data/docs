---
sidebar_position: 3
---

# Customer Spend Reporting

## Overview

Many of our customers use Heron's capabilities to display back insights and analytics to their customers. 
The key outcomes we help our customers achieve are:

1. Allow users to see spend by merchant or by category
2. Help users with revenue and runway calculations
3. Give users an overview over their cash-based P&L, for example to monitor spend on certain categories

This helps our customers drive retention and engagement for their users.

:::info
If you have specific requirements for low latency, we are able to process your
transactions in a priority queue to ensure we deliver the latency needed.
Please contact your Heron representative to find out more.
:::

## Get started

## For a batch of transactions, synchronously enrich all bank data (either business or consumer data)

:::caution
**For this use case, please limit batch sizes to 2,500 transactions maximum.**
:::

1. **Post Transactions:** Send POST `/transactions` [requests](https://docs.herondata.io/api#tag/Transactions/paths/~1api~1transactions/post). Make sure that the `end_user_id` in the payload matches a canonical identifier for the consumer from your systems.
   1. **Note:** that in the payload, only `amount` and `description` are required.
   2. **Note:** If you receive transactions directly from Plaid, Ocrolus or in PDF, we allow you to just pass on the file without any manipulation. This replaces using the `/transactions` endpoint in this step. The endpoints you can use are:
      - [Plaid - Assets Report](https://docs.herondata.io/api#tag/EndUserIntegrations/paths/~1api~1end_users~1{end_user_id_or_heron_id}~1plaid~1assets/post)
      - [Plaid - Transactions Report](https://docs.herondata.io/api#tag/EndUserIntegrations/paths/~1api~1end_users~1{end_user_id_or_heron_id}~1plaid~1transactions/post)
      - [Ocrolus Report](https://docs.herondata.io/api#tag/EndUserIntegrations/paths/~1api~1end_users~1{end_user_id_or_heron_id}~1ocrolus/post)
      - [PDF](https://docs.herondata.io/api#tag/EndUserIntegrations/paths/~1api~1end_users~1{end_user_id_or_heron_id}~1pdfs~1v1/post)
2. **Parse response:** In the response to this `POST` request, you will receive back all items you need for a beautiful transaction feed!

```json
{
    "transactions": [
        {
            ...
            "description_clean": "cleaner_description",
            "merchant": {
                "heron_id": "mrc_nF5uQ1LPBJn5REabCQGeTH",
                "name": "merchant_name",
                "url": "https://some_merchant_url.com",
                "logo_url": "https://url_to_logo.com/merchant_logo.png",
                "icon_url": "https://url_to_icon.com/merchant_icon.svg"
            },
            "payment_processor": {
                "heron_id": "mrc_98gzPbisCPwDkeU123pZ3h",
                "name": "Square",
                "url": "https://squareup.com/us/en"
            }
        }
    ]
}
```

## How to display the enriched transactions

**Description/name**

- You should display back the `merchant.name` where available.
- If no `merchant.name`is available, display back either the `payment_processor` or the `description_clean`.
  - `payment_processor` is the name of the company that processed the payment, like Square, Stripe, Shopify, etc.
  - `description_clean` will always be a substring of the `description`, but without information about payment methods, store numbers, transaction dates, amounts, etc.

:::info Example

If you send a description like `SQ* 01203433383 ESPRESSO CIELO SANTA MONICA CA`, you receive back:

    "payment_processor": "Square",
    "description_clean": "Espresso Cielo Santa Monica"

Which one you choose to display back depends on your use case. Note that `payment_processor` will always have a logo/icon attached.

:::

**Logo/icon**

- You will receive back either a `logo_url`, an `icon_url` or both
- The logo is generally rectangular, and the icon is a square
- Both are either in `png` or `svg` format
- The icon/logo are hosted in one of our Google Cloud Storage buckets, and the URL is static with format:
  - Icon: `https://storage.googleapis.com/heron-merchant-assets/icons/{merchant_heron_id}.{png|svg}`
  - Logo: `https://storage.googleapis.com/heron-merchant-assets/logos/{merchant_heron_id}.{png|svg}`

**Unique identifier**

- You will receive back a unique identifier, the `heron_id`, for each merchant. You can use this identifier as a basis for further logic. For example:
  - Allow your users to choose a custom category for a specific merchant, based on that merchant's `heron_id`.
  - Show your users all spend with one merchant by aggregating all spend on one merchant `heron_id`.

**Categories [optional]**

:::tip
If you do not currently receive categories but would like to receive them, please contact Heron!
:::

- If categories are enabled for you, you will receive them back as a dictionary in the transactions object ([see here](https://docs.herondata.io/api#tag/Transactions/paths/~1api~1transactions/get)). You can display back the `label` to your customer, or assign a static logo to each category instead.

## Feedback

We want to receive feedback on incorrect merchants and categories whenever possible, so we can make improvements. There are two ways you can share feedback with us:

- **Manual**: You can send us free-form feedback in our shared Slack channel. We also share spreadsheets with customers that enable them to share feedback with us, which we can also make available via Slack.

## How to use the output

**Merchants**
- A standard use case would be to show your customer all spend per merchant. To do this, sum all spend for a given `heron_id` for a merchant.
- You can also build comparative statistics and recommendations on top: For example, for a customer with a given revenue, are they spending relatively more or less than others on a payroll provider?

**Categories**
- You can display back categories directly, or use the category labels to calculate items like a company's P&L or historical revenue.
- You may want to use confidences to only show back transactions that are categorised with high accuracy. If the annotator on the category label is `reconciled`, your category model has been fine-tuned to have confidence values that map directly to accuracy. This means that for a category label with a confidence of `0.9`, we’d expect the label to be accurate 90% of the time.
    - You can use these confidences to display back only labels with a certain probability of being correct, depending on your use case.
- If the annotator on the category label is either `heuristics` or `predicted`, your model is not fine-tuned for reliable confidences. If you still want to use confidences, please contact Heron.

```json
{
    "categories": [
        {
            "annotator": "reconciled",
            "confidence": 0.91,
            "heron_id": "ctg_4q5tDaLi66h3EAWYTY11YC",
            "label": "Rent",
            "model_version": "0f74d346-10f8-454d-abc2-5980674e07b1"
        }
    ]
}
```
