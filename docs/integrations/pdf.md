---
sidebar_position: 2
sidebar_label: PDF
---

# PDF Integration

To integrate with Heron Data using PDFs, you can directly start uploading PDFs in the Heron dashboard

## Prerequisites

Before following this guide, you will need:

-   Access to [dashboard.herondata.io](http://dashboard.herondata.io) via your `username` and `password`
-   A PDF of a bank statement from one of your customers

## Integration steps (dashboard)

1. Log in to [dashboard.herondata.io](http://dashboard.herondata.io)
2. Go to **Companies** on the sidebar menu.
3. Either create or find the customer that you want to upload a bank statement PDF for
4. Click the **transactions** drop down menu and select **PDF** under **Upload transactions**
5. In the message box, input the requested information about the bank statement
6. Select and upload your PDF file
7. During processing, you will be able to view all your PDF files by clicking **PDFs** under **View transactions** from the **transactions** drop down menu
8. By viewing a PDF, you can view the extracted results from the PDF and either approve or reject the PDF
9. Approving the PDF loads the transactions into the Heron system for the particular company
10. Once this is done, set the company status to "ready" to initiate enrichment and to see results like balance, P&L, and scorecard

## Integration steps (API)

1. You can upload a PDF for a company directly via API by sending us a POST request with the base 64 encoded PDF (see [API docs](https://docs.herondata.io/api#tag/EndUserIntegrations/paths/~1api~1end_users~1{end_user_id_or_heron_id}~1pdfs~1v1/post))
2. When posting a PDF, you can optionally specify the `account_id`, `currency`, and `read_us_dates` (date format) of the PDF. If not provided, we will infer these values
3. You can see all PDFs and their processing status with a GET request (see [API docs](https://docs.herondata.io/api#tag/EndUserIntegrations/paths/~1api~1end_users~1{end_user_id_or_heron_id}~1pdfs/get))

## PDF status

Your PDF can be in 1 of a few statuses:

-   **new** -- the PDF has just been created in the Heron system
-   **parsed** -- the PDF has been parsed by the OCR service
-   **processed** -- the OCR service response has been processed and the results are ready to review in the dashboard
-   **approved** -- if auto-approval is turned off, you can manually approve PDFs to load transactions into the Heron system
-   **rejected** -- if auto-approval is turned off, you can also reject PDFs based on the quality of the processed output and not load transactions into Heron system
-   **failed** -- when Heron encounters an error during processing, including when no transactions are found
-   **transactions_loaded** -- when the transactions have been loaded from the PDF into the Heron system -- success!

## Auto-approval

-   If you deal with large volumes of PDFs, we recommend you enable auto-approval for PDFs. Ask your Heron contact to turn on auto-approval
-   What this means is that if the processed PDF passes certain checks (e.g., anomaly score below a certain threshold, balances reconcile), we will automatically load the transactions into the Heron system
-   If any of the checks fail, we will flag that to you and manual review will be required

## Anomalies

-   We provide an "anomaly score" between 0 to 1000 based on how anomalous the PDF is
-   An "anomaly" is defined as the difference between the submitted PDF and other PDFs from the same financial institution
-   We display back to you via dashboard and API the reasons for which we find certain PDFs to be anomalous, e.g. the use of an editing software, differences in formatting, etc.
-   You can choose to set auto approval thresholds based on the anomaly score of a PDF