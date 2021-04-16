ember-ebau-gwr
==============================================================================

Development
------------------------------------------------------------------------------

```
# start a local CORS proxy
yarn proxy
# start dev server
yarn start
```


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.16 or above
* Ember CLI v2.13 or above
* Node.js v10 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-ebau-gwr
```


Usage
------------------------------------------------------------------------------

> **Note**
> If this addon is used in `ember < 3.24.1` the project and buildings navigation
> won't work since ember does not yet support `@ember/routing/link-component`
> in engines (which the `uk-tab/link-item`  component from `ember-uikit` extends). 
>
> The normal workaround for this is to use the `ember-engines/components/link-to-component` if `ember-uikit` is used by an engine but since we would need to add `ember-engines` as dependency of `ember-uikit` this is still an open issue for now.

Mount the engine in your router file. You can specify a param in the url which
will then be used to filter the `gwr-links` by their attribute `local_id`.

```js
this.mount("ember-ebau-gwr", { as: "gwr", path: "gwr/:id" });
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
    "router",
    session
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


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [AGPLv3](LICENSE.md).
