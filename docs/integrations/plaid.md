---
sidebar_position: 1
---

# How to integrate via Plaid

To integrate with Heron Data using Plaid, you’ll need to configure an integration in the Heron and Plaid Dashboards.

## Prerequisites

Before following this guide, you will need:

- Access to [dashboard.herondata.io](http://dashboard.herondata.io) and via your `username` and `password`, and also an `api_key` to call our API.
- A working [Plaid Link](https://plaid.com/docs/link/) implementation including storing `item_id`s and `access_token`s in your system.
- A unique identifier for each of your customers (which can have many Plaid connections) that you can send to us. We call this the `end_user_id`.

## Integration steps

1. Log in to [dashboard.herondata.io](http://dashboard.herondata.io)
2. Go to **Settings** on the sidebar menu then scroll to the **Integrations** section.
3. Select “Plaid” as an integration type and give your integration a meaningful name.

    ![Heron Dashboard Add Plaid Integration](/img/heron_dashboard_add_integration_plaid.png)

4. Go to your Plaid dashboard ([https://dashboard.plaid.com/team/keys](https://dashboard.plaid.com/team/keys)) and copy over the `client_id` and `secret`.

    :::note
    Ensure the `secret` is for the environment (Development, Sandbox, Production) you intend to use
    :::

    ![Plaid Dashboard Keys](/img/plaid_dashboard_keys.png)

5. Enter the Plaid keys from above into the Heron Dashboard, and then submit the form.
6. Once created you will see your integration in a table. Click **View** to get the **webhook URL** and **link URL** which you will need in the next steps.

    ![Heron Dashboard Integrations List](/img/heron_dashboard_integrations_plaid.png)

7. In your code, set the `webhook` parameter of **[`/link/token/create`](https://plaid.com/docs/api/tokens/#linktokencreate)** as documented in [Configuring Link for transaction webhooks](https://plaid.com/docs/transactions/webhooks/#configuring-link-for-transactions-webhooks) to the **webhook URL**
8. In your code, after calling **[`/item/public_token/exchange`](https://plaid.com/docs/api/tokens/#itempublic_tokenexchange)** send the resulting Plaid `item_id` and `access_token`, along with your `end_user_id` (unique key for your customer) as a `POST` request to the **link URL**.

## Final result

This diagram illustrates the final flow of data between your customers, your Plaid Link flow, Plaid and Heron Data. The blue lines represent the code changes explained in the previous section.

![Plaid Integration Diagram](/img/plaid_integration_diagram.png)

Whenever Plaid has new transactions for this Item, we will retrieve, store and process them. The incremental transactions will be available to consume via our API or our dashboard.
