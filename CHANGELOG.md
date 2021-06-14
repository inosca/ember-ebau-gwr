## [2.1.1](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v2.1.0...v2.1.1) (2021-06-14)


### Bug Fixes

* **styling:** small changes to fix integration styling issues ([eacf57b](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/eacf57b36b78599bce473753c7393211405817f8))

# [2.1.0](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v2.0.1...v2.1.0) (2021-06-08)


### Bug Fixes

* **building:** new the API does not always deliver a street object for the entrance list ([b7d7770](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/b7d77700c443be6ff7ba8dcd98b00db53c80eae9))
* **building:** on creation, set a dummy entrance with the current municipality ([468a6a9](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/468a6a9dc2b2954b7e6b2e0c96a60da37766bdee))
* **checkbox:** set value instead of checked on input ([559a9e8](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/559a9e8402acb3dbdf15c5f3d5e8602c84040589))


### Features

* **building:** add heating forms ([7029054](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/7029054e4f859124a470445949fb3dd5a34816bf))
* **building:** add update form for buildings for simple fields ([f49c637](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/f49c63788cf0881f606821be34f418113a2b3e72))
* **building:** buildings can be created and kindOfWork can be updated ([1745f9b](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/1745f9b0157a622b8c86f72a32eeeb0dbd0d940b))
* **models:** add building related models ([71befeb](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/71befeb03846ebbcc33638725c3f4b5c4edbc92c))

## [2.0.1](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v2.0.0...v2.0.1) (2021-05-10)


### Bug Fixes

* **municipalities:** move municipalities out of env since this is not read and move into a model file ([480691e](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/480691ef59ac3556dea9542f43a5901c10c736ca))

# [2.0.0](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v1.10.2...v2.0.0) (2021-05-06)


### Bug Fixes

* **project-table:** cast eproid from data model to number for comparison ([6a15404](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/6a154043c39507533035cb5b20fe4543444029e0))


### Features

* **login:** add municipality select to login ([226a9b6](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/226a9b6e86c3d8fee98ba61be279f09a9eb7264c))


### BREAKING CHANGES

* **login:** rename `municipalityId` to `municipality` in config

## [1.10.2](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v1.10.1...v1.10.2) (2021-04-27)


### Bug Fixes

* **buildingWork:** Dont show a work entry which has no building ([0f38b38](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/0f38b389dabd09bbff57d4a295e1a69e84b02db0))
* **delete project:** fetch projects after delete ([8c98894](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/8c98894445100506233560071000478980aea6ba))

## [1.10.1](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v1.10.0...v1.10.1) (2021-04-26)


### Bug Fixes

* **client:** only submit client form if organisation name or offical name is present ([baa01f3](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/baa01f39b9a0ec64a2fe3c2a9324464b2b0bcd84))

# [1.10.0](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v1.9.0...v1.10.0) (2021-04-26)


### Features

* **BREAKING CHANGE:** move auth token and camac group to gwr config service ([8142c72](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/8142c72622d8087ecfb49c6ec623349260d6c01d))

# [1.9.0](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v1.8.0...v1.9.0) (2021-04-16)


### Bug Fixes

* **dependencies:** add session as service dependency ([68ca843](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/68ca8432bbf1e1e4ee3936d625a9a3012dcbf774))


### Features

* **organisation form:** add explanation to the UID field ([0ed51d5](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/0ed51d53e7758040050bb4a3244fdac4e4d86bd3))

# [1.8.0](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v1.7.0...v1.8.0) (2021-04-16)


### Bug Fixes

* **auth-fetch:** set `retry` to true after one failed attempt in `fetch` ([0a3d65a](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/0a3d65a6c284d251b7b720566f751c75d78e8f3a))


### Features

* **client:** implement organisation form ([61bec87](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/61bec8785d5e0734aec20d30592b40404acc7869))
* **organisation form:** add explanation to the UID field ([864c436](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/864c436b2f30488fe0365a2b97653e2917bdbd26))

# [1.7.0](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v1.6.0...v1.7.0) (2021-04-14)


### Bug Fixes

* **auth:** reenable configuration for user and password in the config service ([b97289c](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/b97289c5d5730bc3b5bc5003cb39a085769288f2))


### Features

* **linked-buildings:** add entries to table for identification ([c541e7f](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/c541e7fe456fa23017ddd530d3abaee64e44a79f))

# [1.6.0](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v1.5.3...v1.6.0) (2021-04-12)


### Bug Fixes

* **form navigation:** update to ember 2.24 to fix `<LinkTo>` issues in engines ([d592c14](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/d592c14346969d7c8e4617cace3e1200f7230d7b))
* **login-modal:** handle application state after login ([9156b87](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/9156b87601f2c569017fe3eedbf7bf9df10d59b8))
* **project:** rename service constructionProject->gwr ([8391324](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/8391324755fc5da1889fdb0087f2c51ca1154fdc))
* **select:** fix typeofwork select in link projects screen ([8221112](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/822111239fa2d443b469ba5e796cb1d607e1a7d5))
* **xml:** update namespace and rename field constructionSurveyDep ([0f4401d](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/0f4401d448da51c0db391acce6ee41bf173d691f))


### Features

* **authentication:** implement a login modal for the gwr api ([d2c1264](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/d2c1264db90b10297c0e68e26d30c01ec5951d0e))

## [1.5.3](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v1.5.2...v1.5.3) (2021-03-30)


### Bug Fixes

* **models:** dont take class name as querySelector root for xml ([2ba8400](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/2ba840073b37f4c929d9df1b084fd35bc02d09c5))

## [1.5.2](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v1.5.1...v1.5.2) (2021-03-26)


### Bug Fixes

* **select:** convert the values to number for selects since otherwise the active option is broken ([0ce3ca4](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/0ce3ca4a7981dabc87a1eb6a6294e1f83ee2f0ad))

## [1.5.1](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v1.5.0...v1.5.1) (2021-03-24)


### Bug Fixes

* **modal:** set the container of the modal so its still in a uikit context ([e2f32e0](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/e2f32e03c68ed156ca75d78c9c9f9981f660e4b5))

# [1.5.0](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v1.4.1...v1.5.0) (2021-03-22)


### Bug Fixes

* **checkbox:** set checkvalue according to passed data ([faa91b0](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/faa91b0ffffca6176c8a9d2fc7fa4013aefb31c8))
* **form:** set constructionSurveyDept from config and make field readonly ([303ebbb](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/303ebbb138e27861ab0ca617484403b72ce0e826))
* **linked-buildings:** dont transition to form if current route is linked-buildings ([5bdf9a7](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/5bdf9a7812372017d072f0d35f61af4848089232))
* **linked-table:** reload table if new project is added ([96ac1ff](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/96ac1ff187587580b8a1392ea0942fce4e8b6bcf))


### Features

* **building-search:** implement building search mask ([b52aab6](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/b52aab67a385dfcdc3956f71a728d558d32272db))
* **buildings:** display linked buildings with ability to remove them ([5125df8](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/5125df8db941ff1d63fa9caae51574af218d52f0))
* **link-building:** add error handling ([1babd88](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/1babd884d3f8a06e9f8f13ed58948262ab319d17))
* **link-building:** add form modal for kindOfWork ([80cb62a](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/80cb62a7fa79ddfb3ea786820e9b3234eec6b9e6))
* **link-building:** add update call to bind buildings ([aca5b21](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/aca5b214452734906fc16b0d6ed76c7d56859359))

## [1.4.1](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v1.4.0...v1.4.1) (2021-03-10)


### Bug Fixes

* **project/new:** return instance id from model hook and not an object ([5fb64ca](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/5fb64ca3869950268e6d27ab651bab08fbb219cd))

# [1.4.0](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v1.3.0...v1.4.0) (2021-03-10)


### Features

* **form:** add remove link button ([427fde4](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/427fde4913bc3a4dc70549a839c7a02f9afb2fae))

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
