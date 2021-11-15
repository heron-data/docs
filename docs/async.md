---
sidebar_position: 6
---

# Async Flow

Depending on the number of transactions you need to post, you might not be able
to send them all in a single API request as you'll eventually hit timeouts.

The solution to this is to send transactions in batches of 5,000. We will
process these asynchronously and notify you via a [webhook](/webhooks) once the
processing is done.

This process is explained below.

### Automated processing

1. For an `end_user_id`, send 1 or more [`POST
   transactions`](https://app.herondata.io/docs#/Transactions/post_api_transactions)
   requests.
1. When finished sending transactions for `end_user_id`, send a [`PUT
   end_users`](https://app.herondata.io/docs#/EndUsers/put_api_end_users)
   request with `status` `"ready"` to indicate that processing
   should begin.
1. When we're done processing, we will notify you with a
   [webhook](https://docs.herondata.io/api_webhooks/) with topic
   `end_user.processed` and the end user id.
1. Send a [`GET
   transactions?end_user_id=myenduser`](https://app.herondata.io/docs#/Transactions/get_api_transactions)
   to get the processed transactions for that end user.
1. Send a [`GET
   end_users/statistics`](https://app.herondata.io/docs#/EndUsers/get_api_end_users_statistics)
   request to get statistics for that end user.

The enrichments and statistics you will receive for an end user are *global* i.e.
they take into account transactions across all `POST /transactions` requests
for this end user.

### Manual review (optional)

After the steps above, if you want to request a manual review for an `end_user_id`:

1. Send a `PUT /end_users` request with status `review_requested` in the
   request body to indicate that you want manual review.
1. When we're done manually reviewing, we will notify you with a webhook with
   topic `end_user.reviewed` and the end_user_id.
1. Send the `GET` requests in steps 4 and 5 above.

### How do I get started with the async flow?

1. Provide us with a webhook URL we can call to notify you when async processing is done.
1. Ensure that `end_user_id` and `reference_id` are consistent across different batches over time for the same applicant.
