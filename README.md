# VIU's Graduate Career Outlook Tool

Written by student web developer [Ryan Paranich](https://www.github.com/rogadev), summer 2022.

## Overview

This backend was developed to act as a proxy server to our [Government of Canada, Labour Market Information, Employment Outlooks, (LMI-EO) API](https://esdc-edsc.api.canada.ca/en/detail?api=lmi-outlooks). It also acts as a reverse proxy to leverage realtime data used throughout VIU's pages, including [program data](https://www.viu.ca/program-export-emp-json) connected to the NID for each program.

This backend connects to the Drupal view "Graduate Career Outlooks". This view takes the NID as a paremeter in its creation which governs how it hits the backend (backend route requires nid parameter).

Additional routes have been created and are available for use. These routes include the ability to pass one or many NOC's, or "credential" and "keyword" query params. Each returns a response object that can be manipulated for implementation into Drupal or other frontend app.

## Routes

### /api/v1/jobs/:nid

The primary route for this app, this route takes a given VIU node ID (NID) as a route param and returns the results an object with one property, "jobs", which contains an array of job objects. Job objects each have the same properties as seen in the example below:

```json
{
  "jobs": [
    {
      "noc": "0013",
      "title": "Advertising Agency President",
      "outlook": 3,
      "outlook_verbose": "Good"
    },
    ...
  ]
}
```

When connected to the Graduate Career Outlook view, the data renders as follows, with a link to frontend view that renders further outlook details, including trend data.

![img](/readme_images/view_example.PNG)

---
## Known &amp; Unresolved Issues

### Cannot destinguish between  Master's and Bachelor's Credentials

The problem with adding filtration for master's vs bachelor's is that many of the NOC results are fine with either but by filtering for master's specifically, you would not get the results for a bachelor's.

We could add both master's and bachelor's keywords in our search terms, however in some instances that will render inaccurate results.

It was decided just to keep it simple and search for credential + an array of keywords to produce the best possible results, given the data complexities.

![img](/readme_images/problem_with_masters_vs_bachelors_noc2153.jpg)