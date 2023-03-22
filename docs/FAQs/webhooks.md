---
sidebar_position: 3
sidebar_label: Webhooks
---

# Webhooks

### Q: Do you guarantee delivery webhooks to our servers? What happens if we are down when a webhook is sent but not received? Is there any retry logic?

Currently webhooks are sent on a best effort basis, in other words, we try once and we do not guarantee receipt. At this point in time, we do not have any retry logic. 

### Q: Are you able to include more identifying information in the webhook so that we are able to identify which transactions are related to the end_user that is has been enriched/processed? 

At present, we keep webhook details purposefully minimal as we cannot control the destination of the webhook and we do not want to send our customers' identifying information to undesireable destinations. 
