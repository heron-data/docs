---
sidebar_position: 7
---

# Versioning

When we release backward incompatible features, we release a new dated version
of our API. We configure versions for each individual API user, so when you're
ready to upgrade to a new version, let us know.

You can tell which API version you're on by looking at the `Api-Version`
response header of any authenticated request you send:

``` bash
curl --head "https://app.herondata.io/api/hello_world/authenticated" --user "<your-authorisation>"

...
Api-Version: 2021-04-01
...

```
