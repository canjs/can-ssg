# can-stache-element-ssr

ssg solution for CanJS 6 custom stache elements

```
/client-helpers - functions that are safe to use in a browser (and can be imported using node)
/dist - ssg and production spa build
/jsdom-ssg - ssg nodejs logic (not browser-safe)
/mock-can-globals - includes mocks for `can-globals`'s `isNode` and `isBrowserWindow` for `can-route` to function properly
/temp - random js that showcases ideas for implementions
/index.html - dev SPA
/tests - playwright application and tests
/main.js - client side code that generates CanJS 6 components
/production.html - dev SPA
/ssg.json - general ssg configuration (includes routes and default settings) and defines environments
/static-server.js - simple static server to test if ssg, assets, bundles can all be hosted in one spot
/playwright.preset.js - base playwright config that all playwright configs extend
```

### ssg.json

```json
{
  // Paths to assets such as images, favicons, etc, they will be copied to dist
  "assets": ["assets"],
  // Default serve mode. Options: "ssg" and "spa"
  "defaultServerMode": "ssg",
  // Default environment. Options: "dev" and "prod" (given the current configuration, you can add or remove environments as you need)
  "defaultEnv": "dev",
  "environments": {
    // Environment name (can be whatever you want)
    "prod": {
      // prebuild (optional) - prebuild script (allows you to run steal-tools)
      "prebuild": "prebuild.js",
      // dist - All builds will be generated in the /dist/ directory
      "dist": {
        // mainTag (optional) - steal/main tag specific to builds
        "mainTag": "<script src=\"/bundles/can-stache-element-ssr/main.js\" main></script>",
        //basePath - sub-directory in /dist/ where all generated build files will go
        // /dist/prod
        "basePath": "prod",
        // static - sub-directory for where ssg pages will be stored
        "static": "static",
        // assets - sub-directory where all assets will be copied to
        "assets": "",
        // entryPoint (optional) - path to entry point specific to serving from dist
        "entryPoint": "index.html"
      },
      // entryPoint - path to entry point for serving (if not from dist)
      "entryPoint": "production.html",
      // serveFromDist (optional) - Determines if serving should use dist or root of project
      "serveFromDist": true
    }
  },
  // Routes for generating ssg pages
  "routes": [
    "http://127.0.0.1:8080",
    "http://127.0.0.1:8080/tasks",
    "http://127.0.0.1:8080/404"
    // ...
  ]
}
```

### Limitations

Using `setInterval` will cause the build progress for static pages to hang. For more information look into Technical Decisions #3 involving

```javascript
process.once("beforeExit", (code) => {
  // ...
})
```

### Assets

Assets directories are defined in `ssg.json`. These directories are copied to `dist` at build. These include things like images, svgs, favicons, etc and can be imported using relatively or absolutely:

Absolute path normally points at the root of the project

```
<img src="/assets/image.png">
```

Relative path is **relative based on url** and not where the javascript file is found in your project

```
<!-- url is: http://0.0.0.0:8080/progressive-loading/cow -->
<img src="../assets/image.png">
```

### Node

```bash
$ node -v # 14.20.0
$ npm -v # 6.14.17
```

#### Installing dependencies:

```bash
$ npm install
```

### Build

For dev environment (default)

```bash
$ npm run build # Generates dev static pages (default)
# or
$ node jsdom-ssg/index.js # Generates dev static pages (default)
# or
$ SSR_ENVIRONMENT=dev node jsdom-ssg/index.js # Generates dev static pages
# or
$ node jsdom-ssg/index.js --environment dev # Generates dev static pages
```

generates `dist/dev` <-- specific to dev environment and is configurable in `ssg.json`

For prod environment

```bash
$ npm run build-prod # Generates prod static pages
# or
$ SSR_ENVIRONMENT=prod node jsdom-ssg/index.js # Generates prod static pages
# or
$ node jsdom-ssg/index.js --environment prod # Generates prod static pages
```

generates `dist/prod` <-- specific to prod environment and is configurable in `ssg.json`

### Purely Static Serve

Since there's a lot of logic in `server.js`, it's hard to trust whether or not it's possible to truly serve all the static pages, assets, bundles from a single directory.

```bash
$ npm run static-server # Runs simple static server
```

### Serve

To serve in ssg (static) mode where built files from /dist are used by default

```bash
$ npm run serve # serves ssg dev application (default)
# or
$ node server.js # serves ssg dev application (default)
# or
$ SSR_ENVIRONMENT=dev SERVER_MODE=ssg node server.js # serves ssg dev application
# or
$ node server.js --environment dev --serverMode ssg # serves ssg dev application
```

To serve in spa mode where built files from /dist are not used (except dist/404/index.html as needed)

```bash
$ npm run serve-dev # serves spa dev application
# or
$ SERVER_MODE=spa node server.js # serves spa dev application
# or
$ SSR_ENVIRONMENT=dev SERVER_MODE=spa node server.js # serves spa dev application
# or
$ node server.js --environment dev --serverMode spa # serves spa dev application
```

To serve in prod mode where built files from /dist are not used (except dist/404/index.html as needed)

```bash
$ npm run serve-prod # serves spa prod application
# or
$ SERVER_MODE=spa node server.js # serves spa prod application
# or
$ SSR_ENVIRONMENT=prod SERVER_MODE=spa node server.js # serves spa prod application
# or
$ node server.js --environment prod --serverMode spa # serves spa prod application
```

Both commands run server.js in the project root or dist (based on `ssg.json`) and serves any file a request directly points at.

If that file doesn't exist, it serves dist/404/index.html

- http://localhost:8080/main.js -> serves the main.js file
- http://localhost:8080/jane.ori -> serves dist/404/index.html with status 404
- http://localhost:8080/dist/404/index.html -> serves dist/404/index.html with status 200

For directories,

#### In SPA `npm run serve-dev` mode

Always serve the root /index.html

main.js sets the can-route page data to the first /slug/ in the path so the correct page loads

- http://localhost:8080/ -> serves /index.html + page is "home"
- http://localhost:8080/tasks -> serves /index.html + page is "tasks"
- http://localhost:8080/asdf -> serves /index.html (with status 200) + page is "asdf" (shows 404 page)

#### In SPA `npm run serve-prod` mode

Functions like `npm run serve-dev` mode with changes which are configurable through `ssg.json`:

1. Requires running `npm run build-prod` (or any of the other variations listed above) first to work as expected

2. Serves from `dist/prod/index.html`

#### In static `npm run serve` mode

If the request points at a directory, it will prepend "/dist/dev/static-dev/\*" to the request path and serve the index.html in that folder. If the path or its index.html file doesn't exist, it serves dist/404/index.html

can-route data "page" is set to the first /slug/ or to "home" if on the root

- http://localhost:8080/ -> serves dist/dev/static-dev/index.html + page is "home"
- http://localhost:8080/tasks -> serves dist/dev/static-dev/tasks/index.html + page is "tasks"
- http://localhost:8080/asdf -> serves dist/dev/static-dev/404/index.html (with status 404) + page is "asdf" (shows 404 page)

#### In either mode

If you prepend /dev to the request path, it serves root /index.html file.
If you prepend /prod to the request path, it serves root /dist/prod/index.html file.

Both are configurable through `ssg.json`

main.js sets the can-route page data to the first /slug/ after /dev so the correct page loads in dev/spa mode.
can-route then automatically uses pushstate to remove the "dev" sentenil value in the url quietly.

- http://localhost:8080/dev/ -> serves /index.html + page is "home"
- http://localhost:8080/dev/tasks -> serves /index.html + page is "tasks"
- http://localhost:8080/dev/asdf -> serves /index.html (with status 200) + page is "asdf" (shows 404 page)

#### Also in either mode

You can go directly to the built index.html file to load the built one, main.js and can-route update it to the correct "page" on hydrate and the url silently changes to the correct path

- http://localhost:8080/dist/tasks/index.html -> serves dist/tasks/index.html + page is "tasks"

### Debugging

#### vscode

Or debug using vscode:

`RUN AND DEBUG` -> `Launch Program`

Alter config to run `"${workspaceFolder}/jsdom-ssg/index.js"`

#### chrome inspector

Open chrome with url: `chrome://inspect/` --> `Open dedicated DevTools for Node`

```bash
$ npm run build-debug
```

#### Debugging spawn processes

There will be times when you'll want to debug `scrape.js` which is executed through a spawn process. Debugging can be difficult if you use the existing debug npm scripts / vscode debugger. To get around this, you can just execute `scrape.js` directly:

```bash
$ node --inspect-brk jsdom-ssg/scrape.js http://127.0.0.1:8080/index.html
```

### Playwright / e2e

For testing we are using [playwright](https://playwright.dev/).

#### General Terms

There are 2 modes when serving:

1. SPA - Single Page Application where all routes point to the same index.html
2. SSG - Static Site Generation where all routes point to their own static index.html. Each page runs logic to hydrate and swaps to a SPA after hydration is done

There are 2 types of environments we are testing:

1. "dev" environment: Environment where no build is required to view code changes in SPA. When a build is made, only static pages are involved for hosting SSR

2. "prod" environment: Both SPA and SSR require a build to view latest code changes. Production build uses `steal-tools` to bundle steal and code where everything is hosted from `dist` directory

#### Testing Each Variation of Environments / Serve Mode

The combination of these types of environments and serving modes are tested:

Each combination has its own playwright configuration:

1. SPA + DEV: `playwright-dev-spa.config.js`
2. SSG + DEV: `playwright-dev-ssg.config.js`
3. SPA + PROD: `playwright-prod-spa.config.js`
4. SSG + PROD: `playwright-prod-ssg.config.js` and `playwright-static-server.config.js`

To run all variations:

```bash
$ npm run e2e # Runs all 5 playwright suites using each configuration
```

To run all configurations for dev environment:

```bash
$ npm run e2e-dev # Runs the 2 playwright suites using their configuations
```

To run all configurations for prod environment:

```bash
$ npm run e2e-prod # Runs the 3 playwright suites using their configuations
```

To run a single configuration:

```bash
$ npx playwright test --config playwright-dev-spa.config.js
```

When running tests for any ssg suite or any suites involving production: SSG + DEV, SPA + PROD, SSG + PROD

You'll need to run the build for that environment first:

```bash
$ node jsdom-ssg/index.js --environment e2e-prod # prod build
$ npx playwright test --config playwright-prod-spa.config.js # SPA + PROD e2e
```

#### static-server.js

The reason we have a specific server script: `static-server.js` is to verify support for a "simple static server" can handle serving a production ssg build:

Serving `static-server.js`:

```bash
$ npm run static-server
# or
$ node static-server.js --environment e2e-prod
```

Testing `static-server.js`:

```bash
$ npm run e2e-prod # Runs multiple test suites which include static-server
# or
$ node jsdom-ssg/index.js --environment e2e-prod # build prod-e2e
$ npx playwright test --config playwright-static-server.config.js # only test static-server
```

#### Sharing spec Files Between Each Variation of Environments / Serve Mode

There is a lot of overlap of tests for the combination of envirionments / serve modes. To avoid duplicate spec files there is a file structure used to share spec files between environments and serve modes:

```
/tests/app // <-- all environments / serve modes
/tests/spa // <-- only spa modes
/tests/spa-dev // <-- only spa mode and dev environment
/tests/spa-prod // <-- only spa mode and prod environment
/tests/ssg // <-- only ssg modes
/tests/ssg-dev // <-- only ssg mode and dev environment
/tests/ssg-prod // <-- only ssg mode and prod environment
```

### Challenges

1. `can-zone-jsdom` currently uses `JSDOM@^11` and custom elements aren't supported until `JSDOM@^16`. And because `can-zone-jsdom` gets warnings for `node@^14`, the latest supported version of `JSDOM` we can use with `can-zone-jsdom` is `JSDOM@^19`.

2. `jsdom` doesn't not support web components being defined in multiple documents:

   ```javascript
   const { window } = new JSDOM(`<!DOCTYPE html>`)
   const document = window.document

   class MyElement extends window.HTMLElement {
     /** ... */
   }

   window.customElements.define("my-element", MyElement)
   document.body.append(doc.createElement("my-element")) // This is okay

   // Attempting to use `MyElement` again for a different window / document

   const { window: window2 } = new JSDOM(`<!DOCTYPE html>`)
   const document2 = window2.document

   window2.customElements.define("my-element", MyElement)
   document2.body.append(doc2.createElement("my-element")) // This throws

   // ! Error: Uncaught [NotSupportedError: Unexpected element owner document.]
   ```

3. The above issue makes using `can-zone-jsdom` problematic as well since the same class must be reused, but each page is rendered using a different `JSDOM` instance.

4. `steal-tools` doesn't support Node v18, the highest version of Node we can use is Node v14. This is the minimum version to use the latest version of `JSDOM`.

5. Currently we use `express.static` middleware for verifying if build can be hosted from a specific directory without any special javascript to make it possible. There is a possiblility that when serving, there's a misleading error: `SyntaxError: Unexpected token '<'`

This results from `express.static` falsly assuming that a javascript file is actually an html file and it will add a trailing slash (`/`) to the request path: `dist/bundles/my-component/my-component.js/`

To work around this issue, you can clear your browser cache

### Technical Decisions

1. `can-zone-jsdom` isn't currently being used for two reasons:

   1. `Challenges #3` (listed above)
   2. We want to move away from using zones on the server side for performance (solution is listed below at `Technical Decisions 3`)

2. We will have to reinitialize CanJS application and use a new `JSDOM` instance for each page. See challenges above `Challenges #2 and #3` (listed above)

3. To avoid having to use zones, we will initialize CanJS application and render each page and rely on:

   ```javascript
   process.once("beforeExit", (code) => {
     // TODO: scape document
   })
   ```

   to know when application is stable and can be scraped

4. When injecting steal or production bundle into index.html, the script tag must be injected at the end of the body tag:

   ```html
   <!DOCTYPE html>
   <head>
     <title>CanJS and StealJS</title>
   </head>
   <body>
     <can-app></can-app>
     <!-- script tag must be the last tag in body -->
     <script src="/node_modules/steal/steal.js" main></script>
   </body>
   ```

   Putting it anywhere else will result in a runtime error:

   `Uncaught DOMException: Failed to construct 'CustomElement': The result must not have attributes`

   This issue is only recreatable for production bundles. Here is more [information on why this is the case when using Custom Elements](https://stackoverflow.com/a/43837330/9115419)

5. When using `express.static` middleware to host static sites, the url paths require ending with a trailing slash (`/`). This isn't something that `can-route` supports out of the box. The workaround to support this is to register every route twice. Register one with a trailing slash (`/`) and one without:

```javascript
// To support express.static, support for trailing `/` must exist
route.register("{page}", { page: "home" })
route.register("{page}/", { page: "home" }) // To support trailing `/`
route.register("progressive-loading/{nestedPage}", { page: "progressive-loading" })
route.register("progressive-loading/{nestedPage}/", { page: "progressive-loading" }) // To support trailing `/`
```

### Roadmap

List of tasks in order of most important to least important

1. Create a repo that will have all this ssg / server stuff

- name should be `can-ssg`
- Should allow for quickly servering can stache applications
- Should provide builds for spa and ssg

2. We need to target a specific hosting for static files and update our generated static files paths:

- Currently we are building like this "/moo/cow/index.html" where each page is a directory and inside is an index.html file
- This might not be suitable for all hosting options so we might need to adjust:
  /moo/cow/index.html vs /moo/cow.html

3. When need to rework `ssg.json` to be a js export

- It is likely that information about routes will come from an endpoint
- Making `ssg.json` a js file that exports some async logic will make this more plausable for us to consume endpoints for configuration
- Possibly avoidable and should just be a process env variable

4. Ability to inject frontend "environment" values ssg static index.html files post build

- After all the ssg static index.html files are generated, there should be a script that goes through all of them and injects some `<script>` tags in them.
- This would be a way to expose frontend urls (such as cms base url, etc)

5. ssg.json responsibilies need to be separated

- env -> rename to something like build
- a consideration of build <> deploy needs to be separate ideas
- all of the build / deploy settings should instead be fully setup using process env variables

6. Code changes done in `can-stache-element` shouldn't be required for `can-ssg` to work

- Some kind of workaround should be provided by using `can-ssg` directly

7. `ssgDefineElement` and `ssgEnd` shouldn't be required in the `main.js` file

8. Replace spawning processes with worker threads (Optional)

- Update worker threads to not close but instead communicate with master
- how to go forward with this?
- spawn `x` child processes > each process will use `y` thread workers (?)

9. Verify setting title of document works with `JSDOM`

10. Weird margin thing happening =/ for prod vs static

- When you have a h1 tag (that has margin-top), it doesn't properly push the body down like it does outside of prod

11. Review route wrapper function

- checks existing root and adds dev/prod to it
- TODO: add check on ssgEnd() to verify and console.warn if not

12. Using express.static doesn't work with `can-route`

- Because of the trailing "/", routeData always doesn't get any variables
  node_modules/can-route/src/deparam.js

```javascript
function canRoute_deparam(url) {
  url = toURLFragment(url)
  console.log("canRoute_deparam", url) // progressive-loading/moo/
  if (url.charAt(url.length - 1) === "/") {
    url = url.slice(0, -1) // Temp fix, remove trailing "/"
  }
  console.log("canRoute_deparam", url) // progressive-loading/moo
}
```

- Alternative is to provide doubles of all the routes: 1 with trailing `/` and one without
- PR: https://github.com/canjs/can-route/pull/259

13. Build a more robust application

- We currently have very minimal applications to test `can-ssg`, it would be good to test again a large application.

14. Launch built versions of the files

- We need to be able to publish these files somewhere. Likely github for now

15. Replace `JSDOM` with `can-simple-dom` (optional)

- `JSDOM` seems to be working, but it's doing a lot of extra work that might not be needed for `can-ssg` to work.
- `can-simple-dom` doesn't support Custom Elements currently and cannot support `can-stache-element` yet, but we could improve `can-simple-dom` so we can replace `JSDOM` for performance and to allow for more features.

16. Run `playwright` directly through node (optional?)

- There's a lot of flexibility to be able to run `playwright` directly
- This would allow for us to be able to test components as standalone, etc
