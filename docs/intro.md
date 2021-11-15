---
sidebar_position: 1
slug: /
---

# Introduction

<p align="center">
  <a href="https://www.herondata.io">
    <img width="350" height="90" src='/img/logo.png' alt='herondata' />
  </a>
</p>
<p align="center"><em>decode bank transaction data</em></p>

---

**Website**: [herondata.io](https://herondata.io)

**OpenAPI Reference**: [app.herondata.io/docs](https://app.herondata.io/docs)

**Python Client**: [pypi.org/project/heron-data](https://pypi.org/project/heron-data/)

---

Heron Data cleans, enriches and labels your bank transaction data. We do this by offering you cleaned descriptions,
enrichment with merchants, categories (according to labels you define) and other features we calculate.

To get API credentials, please email `hello@herondata.io`!

## What we offer

**General Features**: *Available out-of-the-box*

* **Cleaned description** - We return the most relevant part of the description string back to you
* **Merchant** - We return a merchant name and the associated url
* **Recurrency** - Indicates whether a transaction is recurring vs. one-off  (e.g., subscriptions)
* **Intra-Account Transfers** - Feature indicating transactions with corresponding inflows/outflows

**Custom Features**: *Contact Heron Data to define category labels that work for you*

* **Categorisation** - Our approach combines a variety of heuristics, machine learning, and NLP approaches for labelling
* **Feedback** - Continually improve your model by providing feedback

## How we deliver it

Enrichment is accessed synchronously via our API.
 
For the full feature set, response times are generally below 30 secs for batches of 5k transactions. 

For certain use cases that require very high accuracy and coverage, we offer asynchronous labelling services that
include manual review steps. This is appropriate for some SME lending settings, or the creation of a ground-truth data set
for ML applications. Contact us for more info!

## Where do I get bank transaction data from?
Our customers access bank transaction data either through an third-party provider (e.g., Plaid, Truelayer) or themselves
generate bank transaction data (e.g. by issuing a card or hosting a checking account). While we do not offer the direct bank connection, we have deep expertise in this area
and can help you get set up with a provider. 

## Need more info?
Chat with us at `hello@herondata.io` or book a call with us [here](https://calendly.com/jamieherondata)!
