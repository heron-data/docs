---
sidebar_position: 2
sidebar_label: PDF
---

# PDF Integration

You can send bank transaction data in PDF bank statements directly to Heron either by uploading files in the Heron dashboard or sending to us via API

## Prerequisites

Before following this guide, you will need:

-   Access to [dashboard.herondata.io](http://dashboard.herondata.io) via your `username` and `password`
-   A PDF of a bank statement from one of your customers

## Upload PDFs via Heron Dashboard

1. Log in to [dashboard.herondata.io](http://dashboard.herondata.io)
2. Go to **Companies** on the sidebar menu.
3. Either create or find the customer that you want to upload a bank statement PDF for
4. Click the **transactions** drop down menu and select **PDF** under **Upload transactions**
5. In the message box, input the requested information about the bank statement
6. Select and upload your PDF file
7. During processing, you will be able to view all your PDF files by clicking **PDFs** under **View transactions** from the **transactions** drop down menu
8. By viewing a PDF, you can view the extracted results from the PDF and either approve or reject the PDF
9. Approving the PDF loads the transactions into the Heron system for the particular company and automatically set the end_user status to `ready`
10. Once the company is done processing, you can then see results like balance, P&L, and scorecard

## Integration steps (API)

1. You can upload a PDF for a company directly via API by sending us a POST request with the base 64 encoded PDF (see [API docs](https://docs.herondata.io/api#tag/EndUserIntegrations/paths/~1api~1end_users~1{end_user_id_or_heron_id}~1pdfs~1v1/post))
2. When posting a PDF, you can optionally specify the `account_id`, `currency`, and `read_us_dates` (date format) of the PDF. If not provided, we will infer these values
3. You can see all PDFs and their processing status with a GET request (see [API docs](https://docs.herondata.io/api#tag/EndUserIntegrations/paths/~1api~1end_users~1{end_user_id_or_heron_id}~1pdfs/get))

If you are using Python, you can use the following function:

```
def get_url_safe_base64_encoding_from_s3_url(s3_url: str) -> str:
    encoded = base64.b64encode(requests.get(s3_url).content)
    base64_encoded_string = encoded.replace(b"-", b"+").replace(b"_", b"/").decode("utf-8")
    data_url = f"data:application/pdf;base64,{base64_encoded_string}"
    return data_url
```

## PDF status

Your PDF can be in 1 of a few statuses:

-   **new** -- the PDF has just been created in the Heron system
-   **parsed** -- the PDF has been parsed by the OCR service
-   **processed** -- the OCR service response has been processed and the results are ready to review in the dashboard
-   **approved** -- if auto-approval is turned off, you can manually approve PDFs to load transactions into the Heron system
-   **rejected** -- if auto-approval is turned off, you can also reject PDFs based on the quality of the processed output and not load transactions into Heron system
-   **failed** -- when Heron encounters an error during processing, including when no transactions are found
-   **transactions_loaded** -- when the transactions have been loaded from the PDF into the Heron system -- success!

## PDF approval

When uploading PDFs, we will perform some high-level checks to ensure the data is uploaded correctly, e.g., balances reconcile (i.e., `starting_balance` +/- `transaction.amounts` = `ending_balance`) and anomaly score is above a certain threshold (more info on anomaly scores below). If a document fails to pass any of these checks, the system will require a user to manually approve a PDF document. In order to approve a document, the user will need to click into the PDF file in question and click the green button at the top of the screen to approve the document. Once approved, the transactions will then be uploaded to the end_user. 

You can quickly and easily see the status of PDFs at the end_user level in the Companies table in the main dashboard. The value of this column will be a ratio where the numerator is the number of PDF files that have transactions successfully uploaded to the end_user. The denominator will be the total number of files uploaded (regardless of if the transactions have been uploaded or not). If the numerator does not match the denominator, then you should review the files that have not had their transactions uploaded, and either approve the file or make any changes to "fix" the document.

## Auto-approval

-   If you deal with large volumes of PDFs, we recommend you enable auto-approval for PDFs. Ask your Heron contact to turn on auto-approval
-   What this means is that if the processed PDF passes certain checks (e.g., anomaly score below a certain threshold, balances reconcile), we will automatically load the transactions into the Heron system
-   If any of the checks fail, we will flag that to you and manual review will be required

## Anomalies

-   We provide an "anomaly score" between 0 to 1000 based on how anomalous the PDF is
-   An "anomaly" is defined as the difference between the submitted PDF and other PDFs from the same financial institution
-   We display back to you via dashboard and API the reasons for which we find certain PDFs to be anomalous, e.g. the use of an editing software, differences in formatting, etc.
-   You can choose to set auto approval thresholds based on the anomaly score of a PDF

## Duplicate PDF detection
-   When uploading a PDF bank statement, we will determine whether or not the given file has been previously uploaded to this specific end_user. If a duplicate file is found, we will return a 409 conflict error during the upload process and we will not save/process the file

## Webhook topics
1. `pdf.processed` -- PDF status has been set to "processed"
2. `pdf.checks_passed` -- PDF checks have passed
3. `pdf.checks_failed` -- PDF checks have failed
4. `pdf.transactions_loaded` -- PDF status has been set to "transactions_loaded"
5. `pdf.failed` -- PDF status has been set to "failed" and we provide reasons in `pdf.notes`