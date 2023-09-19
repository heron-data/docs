---
sidebar_position: 1
---

# Cash Flow Underwriting

## Overview

Heron Data’s main use case is to help lenders and fintechs underwrite SMBs using bank data. We do this by enriching each transaction with a category identifying the transaction (e.g., `Revenue` or `Debt Investment`), and then aggregating amounts across these labels to give insights into the company.

The key outcomes we achieve for our customers are:

1. **Supercharge underwriters**: Speed up underwriting by an order of magnitude vs. having to manually parse bank data
2. **Expand addressable market**: Underwrite businesses without up-to-date accounting or e-commerce data
3. **Catch fraud**: Because bank data is up-to-date, we have enabled customers to avoid millions of dollars in losses to customers who were loan stacking or had other previously unidentified risk factors

We will begin by enriching the bank data, and then looking at how it can be used to analyse companies from the dashboard and via the API.

## Post & enrich company bank data

### Create an end user and enrich transactions

1. **Create an end_user:** Begin by creating an end_user in Heron’s systems that corresponds to a company/applicant in your systems. You do this by sending a POST `end_users` [request](https://docs.herondata.io/api#tag/EndUsers/paths/~1api~1end_users/post).
   1. For the `end_user_id` field, use a canonical reference/identifier for the company
   2. **Note:** If you are sending transactions for a company that you’ve already sent to Heron before, skip this step.
2. **Send Transactions to Heron** Once you have created the end_user, you can start sending us transactions in many ways
   1. Set up a Direct Plaid Integration - this is recommended if you use Plaid and want to perform ongoing portfolio monitoring. By setting up a Direct Plaid Integration, we will automatically retrieve new transactions automatically from Plaid whenever there is an update, without any manual intervention required. Steps to set up this integration can be found [here](https://docs.herondata.io/integrations/plaid)
   2. Send PDF bank statements - **note: this will incur a separate fee per bank statement and PDF parsing must be enabled for your account prior to uploading the documents.** Steps to set up this integration can be found [here](https://docs.herondata.io/integrations/pdf)
   3. Send system output files - Heron can accept certain files directly without any manipulation. For example, if you use Plaid but do not wish to integrate Heron directly to Plaid, then you can send us Plaid reports instead
      1. [Plaid - Assets Report](https://docs.herondata.io/api#tag/EndUserIntegrations/paths/~1api~1end_users~1{end_user_id_or_heron_id}~1plaid~1assets/post)
      2. [Plaid - Transactions Report](https://docs.herondata.io/api#tag/EndUserIntegrations/paths/~1api~1end_users~1{end_user_id_or_heron_id}~1plaid~1transactions/post)
      3. [Ocrolus Report](https://docs.herondata.io/api#tag/EndUserIntegrations/paths/~1api~1end_users~1{end_user_id_or_heron_id}~1ocrolus/post)
   4. POST transactions via API
      1. If you want to send us transactions directly from your system, you can POST transactions for a given end_user using the `/end_users/{end_user_id}/transactions` endpoint for sending [requests](https://docs.herondata.io/api#tag/Transactions/paths/~1api~1end_users~1%7Bend_user_id_or_heron_id%7D~1transactions/post).
      2. **Note:** Please batch up to 20k transactions per request
3. **Process Transactions:** When you are done sending us transactions for a company, please send a PUT `end_users` [request](https://docs.herondata.io/api#tag/EndUsers/paths/~1api~1end_users/put), indicating that the end_user is `ready` for processing.
   1. **Note:** if you have set up a Direct Plaid Integration or are sending Heron PDF bank statements, skip this step. 
4. **Listen to webhook:** We will notify you via a [webhook](/webhooks) when the `end_user_id` is `processed`, and available for you to retrieve. You can configure your webhook in the [dashboard](https://dashboard.herondata.io/).
5. **Get transactions**: Once you have received the webhook, you can send a GET `/end_users/{end_user_id_or_heron_id}/transactions` [request](https://docs.herondata.io/api#tag/Transactions/paths/~1api~1end_users~1{end_user_id_or_heron_id}~1transactions/get) to retrieve the enriched data.
   1. **Note**: We still support the `/transactions` [endpoint](https://docs.herondata.io/api#tag/Transactions/paths/~1api~1transactions/get) that was previously used by most customers. The new endpoint that is now standard is much more performant, so we recommend using that endpoint instead. If using the old endpoint, you can use the `end_user_id` parameter to ensure you only pull transactions for the `end_user_id` that was just enriched. If you get transactions for a company that you’ve already sent to Heron before, you can use the `last_updated_min` filter to only get transactions where labels have changed since the last time you send and fetched transactions.

You now have enriched data for a given company. 

## Inspect company using the dashboard

_This section only describes the dashboard at a very high-level. To get more detailed information, please contact Heron Data for an onboarding session_

During your integration, you can use the [dashboard](https://dashboard.herondata.io/) to make sure that all steps work as expected.

1. Navigate to the `All Companies` page. This will give you an overview over the companies (i.e., `end_user`) you have created.

![Companies Page](/img/dashboard_companies_page.png)

2. You can see the status of the company in the `status` column of the main table. To view the generated reports for a company, click on the companies' `name`.
3. To ensure that the reports are suitable for underwriting, confirm that the three sets of data quality checks have passed for the company (i.e. Data Sources, Accounts, Transactions).
   1. To view the data checks, click on the applicable application component on the left hand panel and then `Data Checks` at the top
4. If all of the Data Quality checks have passed, navigate to one of the `Underwriting Reports` for one of the companies. Here, you will see multiple reports that visualize Deposits, Withdrawals, Debt, Revenue, P&L, risk flags and other financial metrics about the company.
5. To inspect the transactions uploaded, click on the `transactions` button on the left.
6. To verify all possible categories that your model may attach to transactions, navigate to the `Categories` tab. You can inspect all labels there.

## Retrieve aggregate metrics on a company

Instead of consuming the enriched transaction data, it may be easier to consume aggregated metrics for a given company. For example, you may want to see monthly historical revenue for a company, as estimated by Heron Data.

We allow you to do this by downloading either self-contained reports (e.g. Bank Statement Summary, Cash-Based P&L), certain aggregate metrics contained in our Heron Scorecard, and/or historical time series and forecasts per category label.

### Get Heron Scorecard

We have aggregated the most common metrics calculated on top of Heron Data output in our Heron Scorecard. The Scorecard will allow you to quickly evaluate a company, by providing labels such as:

To get the Heron Scorecard, send a GET `end_users/{end_user_id_or_heron_id}/scorecard` [request](https://docs.herondata.io/api#tag/EndUsers/paths/~1api~1end_users~1{end_user_id_or_heron_id}~1scorecard/get).

- **Data Quality**: Measures to help you understand the quality and completeness of the bank data our analysis is based on, e.g. `Data Coverage` & `Data Freshness`. Also includes a measure to see what percentage of all transactions (as a proportion of revenue) appear to be going to an unconnected account held by the company we are analysing.
- **Risk Flags**: Flags like `ATM Cash Withdrawals` and distinct days with insufficient funds / overdraft fees.
- **Balance**: Statistics about average, max and min balances.
- **Profit & Loss**: Approximations of standard cashflow-based metrics like `Revenue`, `Net Operating Cashflow`, etc.
- **Debt**: Number, recency and amounts of recent debt investments and repayments

### Get historical timeseries

To get historical time series, (e.g. `Revenue` over time for each month), send a GET `end_users/statistics` [request](https://docs.herondata.io/api#tag/EndUsers/paths/~1api~1end_users~1statistics/get). In the parameters, you can specify:

1. The `end_user_id` of the company you are looking at
2. The time periods over which you want to aggregate, often this is per month (`date_granularity`)
3. Whether you want to pivot by `merchant`, `category` or both
4. If you want to see only certain categories, filter by `category_heron_ids`

:::info Example
To get the monthly revenue for end_user_id `12345` you would send a `GET` request to the following:

```
https://app.herondata.io/api/end_users/statistics?end_user_id=12345&group_by=category&date_granularity=month&category_heron_ids={category_heron_id_for_revenue}
```

:::

### Get forecast

_Note: Forecasts are currently in beta_

To get forecasts for a category timeseries, send a GET `end_users/forecast` [request](https://docs.herondata.io/api#tag/EndUsers/paths/~1api~1end_users~1forecast/get). You can use similar logic to the historical timeseries section above to get forecasts for the time intervals and category labels you care about.

For more information on forecasts and any feedback, please talk to us!
