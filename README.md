# Static Site Starter

This is a boilerplate solution for creating one or more static websites with shared codebase of templates and assets. It can also be used as the basis for an assets directory in a larger codebase, such as part of a CMS theme.

It uses a combination of Webpack for the asset pipeline and Eleventy for the static site generator.

To get up and running:

1. Install Node and NPM
2. Pull this repo into a local directory and go there in the command line.
3. In the project root directory, run the `npm install` command to install dependencies.
4. Run the `npm run dev` command to do a basic build in Webpack's development mode

(Other build scripts are available in the package.json file)

There's also an extra feature that I've found is a big help with my setup:

* The webpack-notifier package provides system level notifications for corner-of-the-eye feedback.

— Jamie