---
sidebar_position: 2
sidebar_label: GET Transactions Methods
---

# Get Transaction Methods

There are three methods of getting transaction data from Heron:
-   Get transactions relate to a given end_user - https://app.herondata.io/api/end_users/{end_user_id_or_heron_id}/transactions
-   Get an individual transaction -  https://app.herondata.io/api/transactions/{reference_id_or_heron_id} 
-   Get all transactions - https://app.herondata.io/api/transactions/

### Q: What are the differences between each of the methods and what are the benefits for each one?

All three methods return the **exact same data**, there is no difference to the results. However, the first two methods are optimised for performance, therefore they return results quicker. 

**Note:** the structure of the results are slightly different, so you will not be able to simply switch between the endpoints without updating how your integration consumes the results. 

### Q: I only want to get the latest transactions that have been enriched and not the full set - how can I do that?

In order to do this, in any of the above three methods, you are able to include a `last_updated_min` parameter. You should set this equal to the last time you sent transactions for enrichment. Sometimes old transactions sent in prior batches may be re-categorised in the context of new batches/transactions, and the timestamps of these transactions will also be updated to reflect the most recent change and will therefore be returned in your latest `GET` request.

### Q: I sometimes see unenriched transactions in the get enriched transactions endpoint - is something wrong?

In order for transactions to be enriched, an `end_user` must be set to `ready` **each time** new transactions are added to an `end_user`. Therefore, if you see unenriched transactions, our first suggestion is to re-set the `end_user` to `ready`. 

If you continue to have problems with unenriched transactions, please reach out via slack or email us at [support@herondata.io](mailto:support@herondata.io). 