---
sidebar_position: 1
sidebar_label: Sync vs. Async
---

# Sync vs. Async

When sending transactions via API, we can process them either `sync` or `async` - this FAQ aims to provide more information as to the different use cases for when you should use `sync` or `async` and the general pros and cons of each methodology.

### Q: What is the difference between processing end_user transactions sync vs. async? What are the benefits of one versus the other?

We typically segregate `sync` and `async` by customer use case.

For creating a **Beautiful Transaction Feed**, i.e. extracting a clean merchant name and icon from a single or multiple transaction descriptions:

- And you are enriching a **single transaction**, we recommend processing transactions using the `merchants/extract` endpoint

- And you are enriching a **batch of transactions**, we recommend processing a batch of transactions `synchronously`

- And you **have business data and want categories** in addition to merchant name and icons, then we would consider you an SMB analytics use case, and we recommend processing transactions `asynchronously`

For **SMB underwriting** and **SMB analytics** - we **always** recommend processing transactions `async`. `Async` has additional features that increase accuracy given that the process evaluates the end_user holistically, instead of just evaluating a single batch of transactions.

To summarise, the key differences between `sync` and `async` processing are:

- **Speed**: `sync` is faster with respect to processing a single batch of transactions and you do not have to rely on receiving a webhook to know when the process is complete (more information on webhooks here)
- **Accuracy**: because `async` has additional features and considers an end_user holistically, the categorisation is more accurate for businesses (this can be up to 10 percentage points more accurate and is the only way to account for inter-company transfers)
- **Number of transactions you are able to process in a single batch**: for `sync`, you are able to send a maximum of **2,500 transactions in a single batch**, whereas for `async`, you are able to send a maximum of **20,000 transactions in a single batch**

### Q: Am I able to process transactions both sync and async?

Processing transactions both `sync` and `async` in a single production environment is not optimal. If you need to be able to do both - please let us know via slack or email us at [support@herondata.io](mailto:support@herondata.io).

### Q: I am currently processing transactions sync, how do I process transactions async (and vice versa)?

If you would like to switch your processing methodology, please reach out via slack or email us at [support@herondata.io](mailto:support@herondata.io).
