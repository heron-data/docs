---
sidebar_position: 2
---

# Merchant Locking

## Overview

Enabling your users to lock cards to specific merchants is a common use case of Heron Data. We have invested significant time & effort to make sure that we can provide you with merchant extraction that is both accurate and has low enough latency to “fit” into a card auth flow. We believe that we are the only provider that can currently enable this use case, and we’re excited to receive any feedback on it!

The key outcomes we achieve for our customers are:

- More cards issued as companies move their spend over to merchant-locked cards
- Higher card spend per card

An overview of the flow is here:

<!-- Update this image with high-resolution -->
![Merchant Lock Schema](/img/merchant_lock_schema.png)

## Locking flow

1. You have to enable your user to pick a canonical Heron merchant to lock a card to. You can do this by offering a free-form “search merchant” text field to the customer that sends GET `/merchants/search` [requests](https://docs.herondata.io/api#tag/Merchants/paths/~1api~1merchants~1search/get). You can populate possible results you show to the user from the results you get from our endpoint.
2. Once the customer has confirmed a merchant, store the `heron_id` of that merchant as the whitelisted merchant for that card.
3. When the user makes a transaction, send a POST `merchants/extract` [request](https://docs.herondata.io/api#tag/Merchants/paths/~1api~1merchants~1extract/post). This endpoint is optimized for low latency (200ms-500ms) as part of an auth flow, and only accepts a single transaction.
4. Only authorize the transaction with your payment gateway when the `heron_id` you receive back in the response matches the `heron_id` that the card was locked to in step 2.
