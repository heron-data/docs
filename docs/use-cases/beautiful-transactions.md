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

This helps with an application interface that builds trust and engagement with customers, like the one below.

<img src="/img/transaction_feed.png" alt="app-screen" width="300" />

## Enrich single transaction using Merchant/Extract (either business or consumer data)

1. **Post transaction:** Send POST `/merchants/extract` [request](https://docs.herondata.io/api#tag/Merchants/paths/~1api~1merchants~1extract/post) with transaction `description`
2. **Parse response:** In the response to this `POST` request, you will receive back all items you need for a beautiful transaction feed including the name of the merchant, a clean description, and the payment processor.
   - **Note:** if the merchant key is `null` (i.e. we could not match a merchant), then the `description_clean` is set to a substring of the original description that our models identified as the relevant entity

## For a batch of transactions, synchronously enrich all bank data (either business or consumer data)

:::caution
**For this use case, please limit batch sizes to 249 transactions maximum.**
:::

1. **Post Transactions:** Send POST `/transactions` [requests](https://docs.herondata.io/api#tag/Transactions/paths/~1api~1transactions/post). Make sure that the `end_user_id` in the payload matches a canonical identifier for the consumer from your systems.
   1. **Note:** that in the payload, only `amount` and `description` are required. For best results, we recommend also sending `timestamp` or `date` and `end_user_id`
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

### React Example

```
const TransactionList = ({transactions}) => {
    return (
        <ul>
            {transactions.map(({merchant, description_clean}, index) => {
                <li key={merchant.heron_id}>
                    <img src={merchant.logo_url} alt={`${merchant.name} logo.`}/>
                    <div>
                        <div>{merchant.name}</div>
                        <div>{description_clean}</div>
                    </div>
                </li>
            })}
        </ul>
    )
};

```

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

- For more use cases around business data categories, please follow the [SMB Analytics Tutorial](smb-analytics).

## Feedback

We want to receive feedback on incorrect merchants and categories whenever possible, so we can make improvements. There are two ways you can share feedback with us:

- **Manual**: You can send us free-form feedback in our shared Slack channel. We also share spreadsheets with customers that enable them to share feedback with us, which we can also make available via Slack.
- **Automated**: You can implement the `transactions/{heron_id}/feedback` [endpoint](https://docs.herondata.io/api#tag/Transactions/paths/~1api~1transactions~1{heron_id}~1feedback/put) so that your users or your operations staff can transmit feedback to us in an automated manner. You can use this endpoint both to send us corrected categories and/or corrected merchants.
