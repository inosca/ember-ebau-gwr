# [1.3.0](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v1.2.1...v1.3.0) (2021-03-08)


### Features

* **login:** make login credentials configurable ([684c07d](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/684c07d66215dcb55e287d8854e1eab433c74164))

## [1.2.1](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v1.2.0...v1.2.1) (2021-03-05)


### Bug Fixes

* **service/construction-project:** fix url for project search ([2f1f459](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/2f1f459e545a0ae8136b74d4cc00a183e0e6530b))

# [1.2.0](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v1.1.1...v1.2.0) (2021-03-05)


### Features

* **gwr-api:** make gwr endpoint configureable ([861bce9](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/861bce9365c29983eb51909b07a56b6c1fd3a0a2))

## [1.1.1](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v1.1.0...v1.1.1) (2021-03-04)


### Bug Fixes

* **form:** fix data import since we already recieve a json object and not a response ([ab7705a](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/ab7705a3115f05aab02bf8e446b7df9afffdf35f))

# [1.1.0](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v1.0.0...v1.1.0) (2021-03-04)


### Features

* **gwr-config:** remove the need for the api config since we now outsource the fetching to the host app ([938a313](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/938a3135a5c2175db6c394667180e647f276485b))

# 1.0.0 (2021-03-04)


### Bug Fixes

* **adapter:** remove adapter since a adapter should come from the hostap ([f0737e4](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/f0737e4855d9e0acf1e96bf5d3abb645c669c0b1))
* **create-project:** we now can create projects ([8195bcc](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/8195bccd99bbaa39cc3aef2790d6f5e95b7904bf))
* **model:** specify "root" object for selectors ([a62e466](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/a62e466865e008b91c444e53b0207c35606ffd70))
* **project/form:** fix some routing issues related to the new route ([be40085](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/be40085e25650e9adefb408a380b97977ab5252e))
* **routes:** remove landing-page from routes since we deleted this in the second to last commit ([c47b64b](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/c47b64baeee23a89f1c905e1df02b4f905a1fbc4))
* **service/construction-project:** actually return the project from the response and fix type in EGRID property naming ([9bae3b7](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/9bae3b7ca8a97dfb891ed684af593e83166ffb20))
* **token:** send wsk_id as a number otherwise the backend returns a 500 error ([584303e](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/584303eaebfdf4f516a1d0b584711c1714d46245))
* **translations:** add translations for the link table ([2f5bc2d](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/2f5bc2d71b5357c84fa800648e23952d417e962b))
* **xml:** change xml to work with the new api version ([4544cc7](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/4544cc71b02c1a039cea68dc51eea345f239a08e))
* **xml-model:** keep default structure of model if no field is in xml ([801bcbc](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/801bcbc15988dab3ad9bc35a8def2f9173205a72))


### Features

* **api:** add interface model `SearchResult` to handle search results ([b18bec3](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/b18bec36d9ac98385a4dc0d719f638fe0c276777))
* **form-prototype:** add seperate landing-page and apply all button for import ([e7ce49f](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/e7ce49f40e5d3752e913ae6135dff22f2985d95c))
* **form-prototype:** add seperate landing-page and apply all button for import ([1dc4cd7](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/1dc4cd72ff85d224ec3c9eca902a3fbb491a46dc))
* **import:** rename the fetch service and implement the import ([c52cd91](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/c52cd91aa36afeb30456df3e1f057b969e60ad9f))
* **init:** initial setup ([cbb9a97](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/cbb9a9792d9868896f74c48040d18a7af11fd73c))
* **init:** initial setup ([5007f15](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/5007f157a880fef780672114459a272e4441d10a))
* **init:** initial setup ([e6aafa8](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/e6aafa8dbc34011c8f1dba9710e3fe04d7596c10))
* **link-existing:** first xml api setup ([dcc19bc](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/dcc19bc6e83f117aa0a0f8c403198122c7d466bb))
* **link-existing:** start with search ([de32c85](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/de32c85f07845c15b9b9dba19bdd1678b920415b))
* **linked-project-list:** display a list of linked projects ([34ef2c6](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/34ef2c6c7424c0d51b3700aef73c12cd86bf087f))
* **models:** enhance models and api service ([75e2236](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/75e22368c18bbc8855f45b82a92bc3940c485264))
* **models/construction-project:** work on xml templates ([6d72262](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/6d72262af2efa334e0c9078546a0c0f322c0bb8d))
* **project-form:** add prototype ([fc82ced](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/fc82ced8cf14f2389b637f46ac813626b5d5b055))
* add cors proxy to dev setup ([81fb3f8](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/81fb3f872a0b9f9fd88d9d998015c77104dcc3cb))
* **project-form:** make form more reusable ([1eb095a](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/1eb095af0f3d2bca01fcb19b89a109b1931836b4))
* data import api ([673815a](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/673815a09c545af49e052ab5f22e1310d2e5d9f9))
* save gwr project links in backend ([7b29eba](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/7b29ebaedf38147274b205aa91c02b26a377899d))
* **search:** first attempt at an search interface ([ee0d073](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/ee0d0734a16dda896a55528a8b0701ec26a94c59))
* **search:** search by EPROID ([27be5da](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/27be5da716b1f5348679a6d5d10489b7abf703b8))
* **search-project:** add validation for filter form ([319ee48](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/319ee489d75f3dff7129ae97feb4ee0adaf36fee))
* **search-project:** finalize implementation of search ui and xml api interface ([5610508](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/5610508b40c0aea5e05e2e8a9b9459c1c2394ef3))
* **xml-api:** add primitive xml api handling ([8e8ef8f](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/8e8ef8f46ac8b587e578250a124b89d5b467e852))
