---
sidebar_position: 5
sidebar_label: Rate Limits and 429 Errors - Too Many Requests
---

# Rate Limits and 429 - Too Many Requests Errors

### Q: We are currently receiving 429 errors for “Too Many Requests” - what is happening and how can I fix this problem?

We currently limit the number of requests that a user can send in order to prevent system abuse and balance load across all of our users. Typically, the standard number of requests that a user is able to send is 100 requests per minute across all API endpoints. 

**Note:** this is a **request limit** and **not a transaction limit**, so in one minute, you could `POST` 50 sets of 1000 transactions for 50 individual `end_users` and then send 50 `PUT` requests setting the `end_users` to `ready`.

We provide information in the response headers to help you understand how many requests you have remaining in your given limit window and when your limit window will reset. For more details, view our API docs [here](https://docs.herondata.io/errors#429). 