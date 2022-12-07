# mock-can-globals

### Description

When generating static pages, `can-route` has unexpected behavior when it detects its environment is not within a browser window or a service worker

To recover from this, we can mock `can-globals`'s `is-browser-window` and `is-node`:

```json
{
    "steal": {
    "map": {
      "can-globals/is-node/is-node" : "./mock-can-globals/is-node",
      "can-globals/is-browser-window/is-browser-window" : "./mock-can-globals/is-browser-window"
    },
}
```

For these mocks to work when using `stealjs`, `can-globals` must be a dependency or dev-dependency:

```bash
$ npm i -D can-globals
```
