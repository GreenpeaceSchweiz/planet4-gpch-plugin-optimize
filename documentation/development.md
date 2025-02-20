# Development

## Contribute

Before working on something, please make sure there's a relevant issue in the GitHub repository.

- If a relevant issue already exists, leave a comment that you are interested in working on that.
- If no relevant issue exists, open a new one and initiate the discussion.

All Pull Requests should target the main branch. Make sure to reference the relevant issue in your Pull Request description and follow the Planet4 [git guidelines](https://support.greenpeace.org/planet4/development/git-guidelines).

## Code standards

This plugin mostly follows the [WordPress Coding Standards](https://make.wordpress.org/core/handbook/best-practices/coding-standards/php/)

Please use the code linters set up in the plugin:

- JavaScript: `npm run lint:js`
- PHP: `npm run lint:php`
- CSS/SASS `npm run lint:css`

And format your code using:
- JavaScript: `npm run format`
- PHP: `npm run format:php`

## System requirements

- [Docker](https://docs.docker.com/get-docker/) (only if using [wp-env](https://developer.wordpress.org/block-editor/getting-started/devenv/get-started-with-wp-env/))
- [Node.js/npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

## Installation

- Clone the repo:

```git clone https://github.com/GreenpeaceSchweiz/planet4-gpch-plugin-optimize.git```

- Install npm packages

```npm install```

- Optional: Use wp-env to start a WordPress environment:

```npm run env start```

The environment is usually available from `http://localhost:8888/`, username: `admin` and password `password`

