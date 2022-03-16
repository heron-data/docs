---
sidebar_position: 1
---
# SMB Underwriting

## Overview

Heron Data’s main use case is to help lenders and fintechs underwrite SMBs using bank data. We do this by enriching each transaction with a category identifying the transaction (e.g., `Revenue` or `Payroll`), and then aggregating amounts across these labels to give insights into the company.

The key outcomes we achieve for our customers are:

1. **Supercharge underwriters**: Speed up underwriting by an order of magnitude vs. having to manually parse bank data
2. **Expand addressable marke**t: Underwrite businesses without up-to-date accounting or e-commerce data
3. **Catch fraud**: Because bank data is up-to-date, we have enabled customers to avoid millions of dollars in losses to customers who were loan stacking or had other previously unidentified risk factors

We will begin by enriching the bank data, and then looking at how it can be used to analyse companies from the dashboard and via the API.

## Post & enrich company bank data

### Create an end user and enrich transactions

1. **Create an end_user:** Begin by creating an end_user in Heron’s systems that corresponds to a company/applicant in your systems. You do this by sending a POST `end_users` [request](https://docs.herondata.io/api#tag/EndUsers/paths/~1api~1end_users/post).
    1. For the `end_user_id` field, use a canonical reference/identifier for the company
    2. **Note:** If you are sending transactions for a company that you’ve already sent to Heron before, skip this step.
2. **Post Transactions.** Once you have created the end_user, you can start POST’ing transactions for that end_user. Make sure that the `end_user_id` in the payload matches the `end_user_id` you created in 1). You do this by sending POST `/transactions` [requests](https://docs.herondata.io/api#tag/Transactions/paths/~1api~1transactions/post).
    1. As noted, please batch to 1000 transactions or fewer
    2. **Note:** If you receive transactions directly from Plaid or Ocrolus, we allow you to just pass on the json file without any manipulation. This replaces using the `/transactions` endpoint in this step. The endpoints you can use are:
        1. [Plaid - Assets Report](https://docs.herondata.io/api#tag/EndUsers/paths/~1api~1end_users~1{end_user_id_or_heron_id}~1plaid~1assets/post) 
        2. [Plaid - Transactions Report](https://docs.herondata.io/api#tag/EndUsers/paths/~1api~1end_users~1{end_user_id_or_heron_id}~1plaid~1transactions/post)
        3. [Ocrolus Report](https://docs.herondata.io/api#tag/EndUsers/paths/~1api~1end_users~1{end_user_id_or_heron_id}~1ocrulus/post)
3. **Process Transactions:** When you are done sending us transactions for a company, please send a PUT `end_users` [request](https://docs.herondata.io/api#tag/EndUsers/paths/~1api~1end_users/put), indicating that the end_user is `ready` for processing. 
4. **Listen to webhook:** We will notify you via a webhook when the `end_user_id` is `processed`, and available for you to retrieve. You can configure your webhook in the [dashboard](https://dashboard.herondata.io/). An example payload webhook is here:
    
    ```jsx
    {
    	"topic": "end_user.processed",
    	"created": "2021-05-20T09:23:53+00:00",
    	"data": {
    	"heron_id": "eus_Eqio3Y4dhyNiMphrXwG58p",
    	"end_user_id": "myenduser",
    	"status": "processed"
    	},
    	"meta": null
    }
    ```
    
5. **Get transactions**: Once you have received the webhook, you can send a GET `/transactions` [request](https://docs.herondata.io/api#tag/Transactions/paths/~1api~1transactions/get) to retrieve the enriched data. Most customers use the `end_user_id` parameter to ensure they only pull transactions for the `end_user_id` that was just enriched.
    1. **Note**: If youa get transactions for a company that you’ve already sent to Heron before, you can use the `last_updated_min` filter to only get transactions where labels have changed since the last time you send and fetched transactions.

You now have enriched data for a given company. Depending on your use case, you may just want to display this enriched data back to your data science team, or use it in other internal applications.

---

💡 &nbsp **Note on webhooks:** From the Heron dashboard, underwriters are able to request a review for a company when they believe that there are errors with Heron’s classification. When the review is finalised, we will trigger a `reviewed` webhook similar to the example in 4). If your organisation only consumes Heron’s output via the dashboard, you don’t have to do anything else. If you pull raw data into your systems, please make sure that you repeat step 5) after receiving a webhook with the status `reviewed.`

---

## Inspect company using the dashboard

*This section only describes the dashboard at a very high-level. To get more detailed information, please contact Heron Data for an onboarding session*


During your integration, you can use the [dashboard](https://dashboard.herondata.io/) to make sure that all steps work as expected.

1. Navigate to the `Companies` page. This will give you an overview over the companies (i.e., `end_user`) you have created.

![Dashboard Companies Page](/img/dashboard_companies_page.png)

2. You can see the status of the company in the `status` column of the main table. To inspect the transactions uploaded, press `transactions` on the right, then `view` transactions.
3. To get a sense of the possible visualisations on top of the enriched data, navigate to `Summary` for one of the companies. Here, you will see Revenue, P&L, risk flags and other financial metrics about the company.
4. To verify all possible categories that your model may attach to transactions, navigate to the `Categories` tab. You can inspect all labels there.

![Dashboard Categories Page](/img/dashboard_categories_page.png)

## Retrieve aggregate metrics on a company

Instead of consuming the enriched transaction data, it may be easier to consume aggregated timeseries per category label instead. For example, you may want to see monthly historical revenue for a company, as estimated by Heron Data. 

We allow you to do this both for historical time series and for forecasts.

### Get historical timeseries

To get historical time series, (e.g. `Revenue` over time for each month), send a GET `end_users/statistics` [request](https://docs.herondata.io/api#tag/EndUsers/paths/~1api~1end_users~1statistics/get). In the parameters, you can specify:

1. The `end_user_id` of the company you are looking at
2. The time periods over which you want to aggregate, often this is per month (`date_granularity`)
3. Whether you want to pivot by `merchant`, `category` or both
4. If you want to see only certain categories, filter by `category_heron_ids`

---

:bulb: &nbsp Example: To get the monthly revenue for end_user_id `12345` you would send a GET request to the following url: 
`https://app.herondata.io/api/end_users/statistics?end_user_id=12345&group_by=category&date_granularity=month&category_heron_ids={category_heron_id_for_revenue}`

---

### Get forecasts

*Note: Forecasts are currently in beta*

To get forecasts for a category timeseries, send a GET `end_users/forecast` [request](https://docs.herondata.io/api#tag/EndUsers/paths/~1api~1end_users~1forecast/get). You can use similar logic to the historical timeseries section above to get forecasts for the time intervals and category labels you care about.

For more information on forecasts and any feedback, please talk to us!