# Steps to Use `can-ssg`

This will explain how to use `can-ssg` in its current state once

it has been migrated to its own npm library called `can-ssg`

1. Install dependencies (will be required once `can-ssg` is migrated to a library)

```bash
$ npm i -D can-ssg # Installs can-ssg
```

When using `can-ssg`, you'll have to use a specific version of `can-stache-element` (for now):

```bash
$ npm i can-stache-element@git+ssh://git@github.com/canjs/can-stache-element#allow-static-inert-extended
```

### Setup Workspace

File summary

```
/assets/ - application assets: imgs, svgs, favicons, etc
/index.html - entry point html file for application
/main.js - entry point js file for `can-stache-element` app
/postbuild.js - post ssg static files instructions
/prebuild.js - pre ssg static files instructions
/ssg.json - ssg configurations
```

2. Create `ssg.json` file:

At the root of your project, create `ssg.json`:

```json
{
  "assets": ["assets"],
  "defaultServerMode": "ssg",
  "defaultEnv": "dev",
  "environments": {
    "dev": {
      "dist": {
        "basePath": "dev",
        "static": "static",
        "assets": "",
        "entryPoint": "index.html"
      },
      "staticBaseUrl": "http://localhost:8080",
      "entryPoint": "index.html"
    },
    "prod": {
      "prebuild": "prebuild.js",
      "postbuild": "postbuild.js",
      "dist": {
        "mainTag": "<script src=\"/dist/bundles/can-stache-element-ssr/main.js\" main></script>",
        "basePath": "prod",
        "static": "static",
        "assets": "",
        "entryPoint": "index.html"
      },
      "staticBaseUrl": "http://localhost:8080",
      "entryPoint": "index.html",
      "serveFromDist": true
    }
  },
  "routes": []
}
```

Summary of each of these properties are listed in `README.md`

3. Create `/assets/` directory

At the root of your project, create `/assets/` directory:

This will be an empty directory for now

3. Create `index.html` file:

At the root of your project, create `index.html` file:

```html
<!DOCTYPE html>
<head>
  <title>CanJS and StealJS</title>
</head>
<body>
  <can-app></can-app>
  <script src="/node_modules/steal/steal.js" main></script>
</body>
```

This will be the entry point html file for your `can-stache-element` application.

4. Create `main.js` file:

At the root of your project, create `main.js` file:

```javascript
import StacheElement from "can-stache-element"

import { ssgDefineElement, ssgEnd } from "can-ssg"

class MyApp extends StacheElement {
  static view = `
    <h1>Hello World</h1>
  `
}

// A wrapped `customElements.define` function
// required for `can-ssg` to function properly
ssgDefineElement("can-app", MyApp)

// Required to be called at the end of your `main.js` file
ssgEnd()
```

This will be the entry point html file for your `can-stache-element` application.

5. Create `prebuild.js` file:

At the root of your project, create `prebuild.js` file:

```javascript
const stealTools = require("steal-tools")
const path = require("path")
const { getEnvConfiguration } = require("can-ssg")

const envConfiguration = getEnvConfiguration("prod")

const distDir = path.join("dist", envConfiguration.dist.basePath)

main()

async function main() {
  await stealTools.build(
    {},
    {
      bundleSteal: true,
      dest: path.join(distDir, "dist"),
    },
  )
}
```

This will create production bundles of your application which includes `steal.js` in the bundle.

6. Create `postbuild.js` file:

At the root of your project, create `postbuild.js` file:

```javascript
const path = require("path")
const { getEnvConfiguration, getEnvAssets, getEnvRoutes, getEnvironment } = require("can-ssg")
const { copy } = require("fs-extra")

const environment = getEnvironment()
const envConfiguration = getEnvConfiguration("prod")

const distDir = path.join("dist", envConfiguration.dist.basePath)

main()

async function main() {
  const promises = []

  // Read paths to generate static pages
  const routes = getEnvRoutes(environment)

  const staticPath = path.join(distDir, envConfiguration.dist.static)
  // `steal-tools` prefixes where bundles are created with "dist/bundles"
  // This doesn't appear to be customizable,
  // you can change the path to where this directory will be created, but it must start with "dist/bundles"
  const bundlePath = path.join(distDir, "dist/bundles")

  // Copy `steal-tools` bundles to each static page directory
  // This is required since each page expected a relative path to the bundle
  for (const route of routes) {
    const staticBundlePath = path.join(staticPath, route, "dist/bundles")
    promises.push(copy(bundlePath, staticBundlePath))
  }

  const baseAssetsDistPath = envConfiguration.dist.assets ? path.join(distDir, envConfiguration.dist.assets) : distDir
  const baseStaticAssetsDistPath = envConfiguration.dist.assets ? path.join(staticPath, envConfiguration.dist.assets) : staticPath

  const assets = getEnvAssets(environment)

  // Copy assets to each static page directory
  for (const assetPath of assets) {
    const assetsDistPathInDist = path.join(baseAssetsDistPath, assetPath)
    const staticAssetsDistPathInDist = path.join(baseStaticAssetsDistPath, assetPath)

    promises.push(copy(assetsDistPathInDist, staticAssetsDistPathInDist))
  }

  await Promise.all(promises)
}
```

This will copy `dist` files into various directories to support access to bundles / assets for ssg static pages.

### How to Build

This walkthrough creates two environments:

1. dev - used for local development

   ```bash
   $ can-ssg build # this works because `defaultEnv` is set to "dev" in `ssg.json`
   # or
   $ can-ssg build --environment dev
   # or
   $ SSG_ENVIRONMENT=dev can-ssg build
   ```

2. prod - used to deploy

   ```bash
   $ can-ssg build --environment prod
   # or
   $ SSG_ENVIRONMENT=prod can-ssg build
   ```

### How to Serve

When serving, there are 2 modes:

1. spa - used for rapid development

2. ssg - uses ssg static files from dist that will hydrate into live applications

For each serve mode, you'll have to choose an environment: dev or prod

Depending on which environment and server mode, you might have to build before serving:

1. spa + dev - **doesn't** require a build

```bash
$ can-ssg serve --environment dev --serverMode spa
# or
$ SSG_ENVIRONMENT=dev SERVER_MODE=spa can-ssg serve
```

2. ssg + dev - **requires** require a build

```bash
$ can-ssg serve --environment dev --serverMode ssg
# or
$ SSG_ENVIRONMENT=dev SERVER_MODE=ssg can-ssg serve
```

3. spa + prod - **requires** require a build

```bash
$ can-ssg serve --environment prod --serverMode spa
# or
$ SSG_ENVIRONMENT=prod SERVER_MODE=spa can-ssg serve
```

4. ssg + prod - **requires** require a build

```bash
$ can-ssg serve --environment prod --serverMode ssg
# or
$ SSG_ENVIRONMENT=prod SERVER_MODE=ssg can-ssg serve
```

### Alternative Ways to Serve SSG Static Pages

You can use just about anything to serve the ssg prod pages. Given this walkthrough's ssg.json, you could also serve using `http-server`:

```bash
$ npx http-server dist/prod/static
```
