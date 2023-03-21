---
sidebar_position: 3
---

# SMB Analytics

## Overview

Many of our customers use Heron's capabilities to display back insights and analytics to the businesses that are their users. 
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

Most customers that use Heron for this use case begin by enriching their transaction feed first. To get started, please follow the [Enrich Business Bank Data](beautiful-transactions#enrich-business-data) section of the [Beautiful Transactions](beautiful-transactions) section first

## How to use the output

After following the tutorial on how to enrich business bank data and make the transaction feed look beautiful, you should have enriched transaction data for a given company.

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
