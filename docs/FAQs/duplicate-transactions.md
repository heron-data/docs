---
sidebar_position: 4
sidebar_label: Duplicate Transactions
---

# Duplicate Transactions

### Q: What happens if we send duplicate transactions or we link multiple identical Plaid files to Heron - will transactions be duplicated?

We currently have two methods of deduplication. Firstly, we use the `reference_id` of each transaction to deduplicate. If the `reference_id` exists already within the set for a given end_user, then we will exclude the duplicates. If there is no match to `reference_id`, then we will compare the `Description` and `Amount` for the transactions. If there is an exact match for both parameters, we will exclude the duplicates. 
