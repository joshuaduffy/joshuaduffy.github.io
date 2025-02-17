# joshuaduffy.github.io

![deploy.yml](https://github.com/joshuaduffy/joshuaduffy.github.io/actions/workflows/jekyll-gh-pages.yml/badge.svg)
![test.yml](https://github.com/joshuaduffy/joshuaduffy.github.io/actions/workflows/test.yml/badge.svg)

- [Deploy](https://github.com/joshuaduffy/joshuaduffy.github.io/actions/workflows/deploy.yml)
- [Playwright Tests](https://github.com/joshuaduffy/joshuaduffy.github.io/actions/workflows/playwright.yml)

## Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/)
- [Jekyll](https://jekyllrb.com/)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/joshuaduffy/joshuaduffy.github.io.git
    cd joshuaduffy.github.io
    ```

2. Install Node.js dependencies:
    ```sh
    npm install
    ```

3. Install Jekyll dependencies:
    ```sh
    bundle install
    ```

## Serve

To serve the app locally, use the following command:

```sh
bundle exec jekyll serve
```

This will start a local server and you can view the site by navigating to `http://localhost:4000` in your web browser.

## Test

To run the Playwright tests, use the following command (will run the site locally):

```sh
npx playwright test -c playwright.serve.config.ts
```
