# joshuaduffy.github.io

![deploy.yml](https://github.com/joshuaduffy/joshuaduffy.github.io/actions/workflows/jekyll-gh-pages.yml/badge.svg)
![test.yml](https://github.com/joshuaduffy/joshuaduffy.github.io/actions/workflows/test.yml/badge.svg)

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

## Running Playwright Tests

To run the Playwright tests, use the following command:

This will run 
```sh
npx playwright test
```

## GitHub Actions

- [Deploy Jekyll with GitHub Pages](https://github.com/joshuaduffy/joshuaduffy.github.io/actions/workflows/deploy.yml)
- [Playwright Tests](https://github.com/joshuaduffy/joshuaduffy.github.io/actions/workflows/playwright.yml)
