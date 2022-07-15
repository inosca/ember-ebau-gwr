# ember-ebau-gwr

Ember Engine for the [adfinis-sygroup/ebau-gwr](https://github.com/adfinis-sygroup/ebau-gwr) backend.

## Development

```
# start a local CORS proxy
yarn proxy
# start dev server
yarn start
```

## Compatibility

- Ember.js v3.28 or above
- Ember CLI v3.28 or above
- Node.js v12 or above

## Installation

```
ember install ember-ebau-gwr
```

## Usage

Mount the engine in your router file. You can specify a param in the url which
will then be used to filter the `gwr-links` by their attribute `local_id`.

```js
this.mount("ember-ebau-gwr", { as: "gwr", path: "gwr/:id" });
```

### Styling

The engine uses the UI framework "UIkit" through [ember-uikit](https://github.com/adfinis-sygroup/ember-uikit). To enable the styling, add the following import to `app/styles/app.scss`:

```scss
@import "ember-uikit";
@import "ember-ebau-gwr";
```

### Services

The engine takes following services as argument:

```js
dependencies = {
  services: [
    "config",
    "intl",
    "notification",
    "dataImport",
    "store",
    "session",
  ],
};
```

#### `config`

The config service is used to pass config to the engine. The following properties can be configured:

| Name                           | Type     |
| ------------------------------ | -------- |
| `municipalityId`               | `Number` |
| `municipalityName`             | `String` |
| `cantonAbbreviation`           | `String` |
| `constructionSurveyDeptNumber` | `Number` |

All values should follow the officially used format.

#### `dataImport`

In the `dataImport` service the consuming application fetches and formats the data into the expected format. The format is the same data structure as the model properties which can be found in `/addon/models`.

The service should define a `fetchProject: async () -> Promise<Object>` function.

#### `session`

We expect a `ember-simple-auth` session service which has the
`data.authenticated.access_token` set.

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [AGPLv3](LICENSE.md).
