# About Career Outlooks API

<h3 style="text-align:center;margin-top:20px;">Ryan Roga, Web Application Developer</h3>
<div style="width:50%;margin:0.5em auto">
  <div style="display:flex;justify-content:space-evenly;margin-bottom:20px;">
    <a href="https://github.com/rogadev">
      <img src="readme_img/GitHub-Light-32px.png" height="25px" />
    </a>
    <a href="https://www.linkedin.com/in/ryanroga/">
      <img src="readme_img/LinkedIn.png" height="25px" />
    </a>
    <a href="https://twitter.com/roga_dev">
      <img src="readme_img/Twitter-Blue-Round.png" height="25px" />
    </a>
    <a href="https://roga.dev/">
      <img src="https://roga.dev/assets/thumbnail.2c8f42c8.jpg" height="25px" style="border-radius:999px;" />
    </a>
  </div>
</div>

## Overview

This project was developed by [VIU](https://www.viu.ca) student web developer [Ryan Roga](https://github.com/rogadev) during his 2022 summer internship as part of the [ITAS Web and Mobile Development Diploma](https://www.viu.ca/programs/trades-applied-technology/information-technology-and-applied-systems-web-and-mobile) program.

This backend was developed to act as a proxy server to our [Government of Canada, Labour Market Information, Employment Outlooks, (LMI-EO) API](https://esdc-edsc.api.canada.ca/en/detail?api=lmi-outlooks). It also acts as a reverse proxy to leverage realtime data used throughout VIU's pages, including [program data](https://www.viu.ca/program-export-emp-json) connected to the NID for each program.

This backend connects to the Drupal view "Graduate Career Outlooks". This view takes the NID as a parameter in its creation which governs how it hits the backend (backend route requires nid parameter).

Additional routes have been created and are available for use. These routes include the ability to pass one or many NOC's, or "credential" and "keyword" query params. Each returns a response object that can be manipulated for implementation into Drupal or other frontend app.

## Routes

### /api/v1/jobs/program/:nid

The primary route for this app, this route takes a given VIU node ID (NID) as a route param and returns the results an object with one property, "jobs", which contains an array of job objects. Job objects each have the same properties as seen in the example below:

```json
{
  "data": {
    "program": {
      "title": "Computer Science Honours",
      "nid": 9143,
      "duration": "Bachelor's",
      "credential": "Degree",
      "program_area": {
        "nid": 3,
        "title": "Arts, Humanities and Social Sciences"
      },
      "viu_search_keywords": "analytics, artificial intelligence, data, information technology, software engineering",
      "noc_search_keywords": [
        "computer science",
        "analytics",
        "artificial intelligence",
        "software engineering"
      ]
    },
    "jobs": [
      {
        "noc": "2147",
        "title": "computer hardware engineer"
      },
      // ... etc
    ]
  },
  "message": "Jobs found."
}
```

In Drupal, this API is consumed to produce the Graduate Career Outlook "view" (widget). From any program page that includes the view, users can see a list of career paths, sorted by "best" outlook, which can be clicked on to bring up further information and bring users into the app itself.

![img](/readme_images/view_example.PNG)

### /api/v1/programs/searchable

Returns exhaustive list of VIU programs, expanded for searchability, which can be found in the data folder.


```json
{
  "data": [
    {
      "title": "Esthetics and Spa Therapy",
      "nid": 9185,
      "duration": null,
      "credential": "Certificate",
      "program_area": {
        "nid": 4,
        "title": "Trades and Applied Technology"
      },
      "viu_search_keywords": "Esthetics and Spa Therapy, Continuing Education, Continuing Studies",
      "noc_search_keywords": [
        "estheticians"
      ],
      "known_noc_groups": [
        "6562"
      ]
    },
    // ... etc
  ]
}
```

### Scrape Routes

There are a number of scrape routes which initiate Puppeteer to scrape NOC data. Note that after scraping, these files need be manually placed to replace existing files which the app relies upon.

---

## Folder Structure

### /config

Unused - Was initially used to setup app config that was replaced with subsequent functionality.

### /controllers

Route controllers - all the route handling logic. Because some functionality is shared between several routes, reused logic can be found in helpers. A `/lib` folder might have been a better naming convension for `/helpers`.

### /data

While we're not implementing a database, we are using some static json which is scraped and formed in the `/scripts/scrape` folder scripts.

### /helpers

Some controller logic is recycled among multiple controllers. Additionally, this folder contains general helpers such as several array and string functions.

### /middleware

For the most part, our middleware is made up of validation checks and handling responses for badly formed requests.

### /routes

Handles all of our route structure and calls on our middleware, and controller logic.

### /scripts/scrape

Our scraping scripts. Scraping is done via Puppeteer and returns data to a temp folder within `/scrape`. As of August 1st, 2022, the scraped data workflow is to run scrape (see scrape routes), validate manually, then move to data folder manually, replacing the freshly scraped information. This process could be automated in the future.

---
## Known &amp; Unresolved Issues

### Cannot distinguish between  Master's and Bachelor's Credentials

The problem with adding filtration for master's vs bachelor's is that many of the NOC results are fine with either but by filtering for master's specifically, you would not get the results for a bachelor's.

We could add both master's and bachelor's keywords in our search terms, however in some instances that will render inaccurate results.

It was decided just to keep it simple and search for credential + an array of keywords to produce the best possible results, given the data complexities.

![img](/readme_images/problem_with_masters_vs_bachelors_noc2153.jpg)

