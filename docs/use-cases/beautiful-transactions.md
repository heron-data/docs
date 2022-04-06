---
sidebar_position: 1
---

# Beautiful Transaction Feed

## Overview

Making a bank transaction feed look beautiful is one of the core applications of Heron Data. The key outcomes we help our customers achieve are:

1. Cleaner, shorter transaction descriptions
2. A logo or icon for each merchant
3. A unique identifier per merchant, which can be used as a basis for further logic
4. [Optional] Categories to show your customer where they are spending.

This helps with an application interface that builds trust and engagement with customers.

---

If you have bank transaction data for a consumer, jump [here](beautiful-transactions#enrich-consumer-bank-data).

If you have bank transaction data for a business proceed with the next section!

---

## Enrich business data

Heron Data is optimized for high coverage accuracy on SMB merchants and
categories. Follow this flow to achieve optimal outcomes. 

### Create an end user and enrich transactions

1. **Create an end_user:** Begin by creating an end_user in Heron’s systems that corresponds to a company in your systems. You do this by sending a POST `end_users` [request](https://docs.herondata.io/api#tag/EndUsers/paths/~1api~1end_users/post).
    1. For the `end_user_id` field, use a unique canonical reference/identifier for the company
    2. **Note:** If you are sending transactions for a company that you’ve already sent to Heron before, skip this step.
2. **Post transactions.** Once you have created the end_user, you can start POST’ing transactions for that end_user. Make sure that the `end_user_id` in the payload matches the `end_user_id` you created in 1). You do this by sending POST `/transactions` [requests](https://docs.herondata.io/api#tag/Transactions/paths/~1api~1transactions/post).
    1. As noted, please batch to 1000 transactions or fewer
    2. **Note:** If you receive transactions directly from Plaid or Ocrolus, we allow you to just pass on the json file without any manipulation. This replaces using the `/transactions` endpoint in this step. The endpoints you can use are:
        1. [Plaid - Assets Report](https://docs.herondata.io/api#tag/EndUsers/paths/~1api~1end_users~1{end_user_id_or_heron_id}~1plaid~1assets/post) 
        2. [Plaid - Transactions Report](https://docs.herondata.io/api#tag/EndUsers/paths/~1api~1end_users~1{end_user_id_or_heron_id}~1plaid~1transactions/post)
        3. [Ocrolus Report](https://docs.herondata.io/api#tag/EndUsers/paths/~1api~1end_users~1{end_user_id_or_heron_id}~1ocrulus/post)
3. **Process Transactions:** When you are done sending us transactions for a company, please send a PUT `end_users` [request](https://docs.herondata.io/api#tag/EndUsers/paths/~1api~1end_users/put), indicating that the end_user is `ready` for processing. 
4. **Listen to webhook:** We will notify you via a [webhook](/webhooks) when the `end_user_id` is `processed` and available for you to retrieve. You can configure your webhook in the [dashboard](https://dashboard.herondata.io/).
5. **Get transactions**: Once you have received the webhook, you can send a [GET `/transactions` request](https://docs.herondata.io/api#tag/Transactions/paths/~1api~1transactions/get) to retrieve the enriched data. Most customers use the `end_user_id` parameter to ensure they only pull transactions for the `end_user_id` that was just enriched.
    1. **Note**: If you getting transactions for a company that you’ve already sent to Heron before, you can use the `last_updated_min` filter to only get transactions where labels have changed since the value of the filter.

You now have enriched data for a given company. Proceed by looking at [best practises to display back information](beautiful-transactions#how-to-display-back-the-enriched-transactions)!

## Enrich consumer data

1. **Post Transactions:** Send POST `/transactions` [requests](https://docs.herondata.io/api#tag/Transactions/paths/~1api~1transactions/post). Make sure that the `end_user_id` in the payload matches a canonical identifier for the consumer from your systems.
    1. For this use case, please **limit batch sizes to 249 transactions maximum.**
    2. Note that in the payload, only `amount` and `description` are required. For best results, we recommend also sending `timestamp` or `date` and `end_user_id`
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

- If categories are enabled for you, you will receive them back as a dictionary with the format below. You can display back the `label` to your customer, or assign a static logo to each category instead.

- For more use cases around buiness data categories, please follow the [SMB Analytics Tutorial](use-cases/smb-analytics).

## Feedback

We want to receive feedback on incorrect merchants and categories whenever possible, so we can make improvements. There are two ways you can share feedback with us:

- **Manual**: You can send us free-form feedback in our shared Slack channel. We also share spreadsheets with customers that enable them to share feedback with us, which we can also make available via Slack.
- **Automated**: You can implement the `transactions/{heron_id}/feedback` [endpoint](https://docs.herondata.io/api#tag/Transactions/paths/~1api~1transactions~1{heron_id}~1feedback/put) so that your users or your operations staff can transmit feedback to us in an automated manner. You can use this endpoint both to send us corrected categories and/or corrected merchants.
