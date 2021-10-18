# [3.2.0](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v3.1.1...v3.2.0) (2021-10-18)


### Bug Fixes

* **building:** add realestate id validation and surface / volume units ([6e8525f](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/6e8525fe696fb34e718d0c78cdc284c99782101d))
* **dates:** do not show construction / demolition dates on new models ([d7cc4ac](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/d7cc4ac2f071bcdf46a0184364c439cd37d0ed82))
* **dwelling:** do not show floor number field for ground floor ([dd96b5e](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/dd96b5e3ed419b2a0181944a93105ba9d19e2f3d))
* **dwelling:** refetch dwellings after dwelling update ([bf02e33](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/bf02e33dab1d242eb22810c8e87ee27377c21140))
* **entrance:** fix tooltip container on building entrance number ([d5eb009](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/d5eb0091dd554ba69a44cb1c621200bdfec7a26d))
* **header:** add scroll into view for status change ([7a3ee64](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/7a3ee645bd042689829f1050b65c7a33403e2203))
* **import:** show conditional fields during import ([0952c69](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/0952c69567b453cd05ca0145733e6410c90204a9))
* **import:** show import date fields and cast imported dates ([00fe1fa](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/00fe1fa9a468281d070ef500292e4e1953477ede))
* **project:** add hints for typeOfConstructionProject ([881a945](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/881a945fd6f69bcc5760c2ce5488c83d204ee41c))
* **project:** filter project list by local_id ([26c55e1](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/26c55e1807a417203ff9b0b4b2b942ad6464b11a))
* **translations:** fix some typos ([4227439](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/4227439a31190f4cbeb982041530a816925401cf))


### Features

* **linked-models:** clarification info for object additions ([12d7886](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/12d7886d258b964a12860cfa7e2430412c9a149a))
* **project:** complete client country options ([bd36e3f](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/bd36e3ffe74094021a69ca60c8ff7d824ab55f3b))
* **search:** add back routes for building and project search ([a22c9d2](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/a22c9d2c42a624123814fbc59e449bec94032561))

## [3.1.1](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v3.1.0...v3.1.1) (2021-10-01)


### Bug Fixes

* **components/link-street:** use decorator function from ember-concurrency-decorators ([8dbf001](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/8dbf00101a449dec217e97704e415c5a21b75b94))

# [3.1.0](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v3.0.0...v3.1.0) (2021-10-01)


### Bug Fixes

* **client:** correct fields on client model ([8339e91](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/8339e91bf744658cf50fac1a1339102ad42fdd35))
* **client:** ensure client identification type is set correctly ([7d11198](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/7d11198026fe612d92afcfc4cd03f9a015bf0d71))
* **entrance:** ensure entrance & street are within same locality ([d88b91d](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/d88b91d5d5a8138535e2a50d6eed4f4c9ee1d079))
* **life-cycles:** correct life cycle error links for camac-ng ([0c3f1c6](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/0c3f1c6dc14cca1fbbb75dd52880e5b786d22611))
* **model-form:** bump ember-validated-form to v4.1.0 to fix on-update issue ([2752b23](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/2752b23260d4903c44dc989650e92fb6ad93baa2))
* **model-form:** fix merge conflict issue ([aaeb372](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/aaeb372ae6965db89209326d4cb5382df3d28070))
* **model-form:** read dates as date objects instead of strings ([34a525e](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/34a525e9145e2f0270751ba4a295b9c1ca7990cb))
* **project:** differentiate swiss and foreign client addresses ([6a69d14](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/6a69d14492481ace39455b1c6870a91573640974))
* **realestate-identification:** remove unused (ignored) fields ([bf94133](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/bf94133029dbf7e08a9c7dc93af87be8920d4397))
* **translation:** change field label of energy source field ([93740aa](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/93740aa6ff5648cff5e2b2459c9a839b9f546676))
* **ui:** minor bugfixes and changes ([4bdfe3c](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/4bdfe3cc8525283ae819bfe45d897a8629210cae))


### Features

* **dwelling:** show complete entrance address in dwelling form ([f842502](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/f84250296527a4511e421f5b38f80470dd679882))
* **header:** add info for deleting fields ([1a53df2](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/1a53df25cd11f86ac4cc8de909d53c00c50da00f))
* **model-form:** complete validations on models ([6c443af](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/6c443af41714276468cba0bd4c358b031d6c5f0c))
* **project:** alert user about missing buildings on superstructure projects ([caea071](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/caea07138041cc06fc0871faeba8f05b8aec88bc))

# [3.0.0](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v2.7.1...v3.0.0) (2021-09-28)


### Bug Fixes

* **building:** add default building entrance and street validation ([74b1a5b](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/74b1a5b13e713e63785a7eb27a2ccba7d22095d9))
* **building:** make default building entrance editable ([1ca2c4e](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/1ca2c4e1550da378ac6768c60ebca94f119ed711))
* **controllers/import:** reset query params while fetching caluma data ([d56ac06](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/d56ac06657cd8db3637e6db7c60f29850a787d61))
* **data-import:** pass instanceId to import functions ([eacdc4f](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/eacdc4fbfd9aabd61a744cb7daf9723cb9ff76ed))
* **import:** ignore null values in import data ([ab7df83](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/ab7df83431bab62c0c2edf8b3d5850ce2ff18956))
* **model-form:** ensure date values are reset on model update ([b73d6a5](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/b73d6a5dafd6984ebba548abc7e68c67734d74a1))
* **project:** correct confirmation dialog modal container ([1bd5be9](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/1bd5be949225d6d07dfa0670cac3238f5e901a61))
* **project:** fix client identification template ([9c50743](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/9c50743c069d2a6b21cf0a1ba3f8a9dc2f9e317f))
* **project:** replace non-realisation date with cancellation date ([bca5f83](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/bca5f83ca15f5a5311a86471a9ce9144a31e3bf0))
* **project/new:** extend new route from form route ([e2837d3](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/e2837d3825369033bf14b8e876b9bacddf7b7449))
* **translations:** use a conciser word for cancel to reject a import value ([1ea1a8e](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/1ea1a8eb8dcd64e0ffa295784c992d63d2365a1d))
* **ui:** render tooltips in correct application container ([65f5265](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/65f5265ce8b010fb13933bc808b8cb510272feb0))


### Code Refactoring

* **modal-container:** make the modal container configurable via config-service ([328fdd8](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/328fdd8e4753cfe41d2d2b5e5c0d49bb931b18de))


### Features

* **building:** enable building entrance deactivation ([6840c4a](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/6840c4a1ab8a913259c8dca976d620340d372047))
* add import for buildings, entrances & dwellings ([9c80eca](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/9c80eca2d75e154232a4c74b8fb6616bb77c4fff))
* **import:** implement import-modal for dwelling, entrances and buildings ([10db43c](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/10db43ce61e195191f5b02b43c811facaf476826))


### BREAKING CHANGES

* **modal-container:** To keep the previous behavior of modals, `modalContainer` now needs to be set to a
valid dom-selector in the gwr config service.

Example:
`modalContainer = "#my-modal-div"`

## [2.7.1](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v2.7.0...v2.7.1) (2021-09-13)


### Bug Fixes

* **import:** ensure diff fields are registered correctly ([33fd1cd](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/33fd1cd36efaaf91cfcfab49f2f1ea7de09270ab))

# [2.7.0](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v2.6.0...v2.7.0) (2021-09-13)


### Bug Fixes

* **building:** add realestateIdentification form fields ([f9d3e0f](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/f9d3e0f970f5ba4e22e05b24996242cb7bb71089))
* **building-entrance:** display coordinates and ARBID ([ce2bbdf](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/ce2bbdf70ebf9dc6b41de92963ee0211103f6668))
* **building-entrance:** fix link to street ([62682a0](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/62682a04c03782e22fd56aaf08c2300aaf615a45))
* **buildingWork:** boolean fields are only allowed on a transformation ([bed4a3a](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/bed4a3a6a841a67318971c9e7e1f467d11f6cfb6))
* **dwelling:** make residence flags readonly ([b37c5c1](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/b37c5c1977271952754c174ed7f860b4777da1d5))
* **dwelling:** rename field dateOfConstruction to yearOfConstruction ([5fb41c7](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/5fb41c7ee4ba27345cfeed88fc93d01c7ee567e1))
* **dwelling:** use correct field for dateOfDemolition ([329f91f](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/329f91f52b13120571f9fad052af4ea9175ea44b))
* **dwelling;building:** remove status select ([78d1c31](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/78d1c3138933ca0210ca406d2dc59d4bbdefc173))
* **fields:** remove unneeded fields and change field types ([0b9ca98](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/0b9ca98757af597e46b475372e3e4aae7fd0c5f9))
* **form:** display plain text with form-labels instead of bold-text ([065c0c5](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/065c0c599b326fc63f5c39278651da5bfc690495))
* **general:** fix minor issues ([a560d9a](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/a560d9a807d0cdc8e64d996c747aff59a41ae013))
* **life-cycles:** cascade building set to realized ([c2fb120](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/c2fb1201a3aebd9f380153473d9470419380e6ca))
* **life-cycles:** cascade project non-realisation and refusal ([2ecefa8](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/2ecefa8f4bdb0ac619eb43e5942542735128be02))
* **life-cycles:** complete transition requirements ([dd0cbab](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/dd0cbab4950017f057316f66767870b825b992c2))
* **life-cycles:** ensure life-cycle preconditions hold ([249556c](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/249556c26d6ff5b7cf5c55fd1d265668e9e83977))
* **life-cycles:** fix set to construction started on dwellings ([3af601e](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/3af601e8e7521e6d38b7fb234a4cbb6363dfc7bb))
* **life-cycles:** perform check before life cycle transitions ([47227a6](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/47227a6cd69cb6ca50f558b256cdd543463f217d))
* **life-cycles:** prohibit checks for infrastructure projects ([3f5a5d0](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/3f5a5d0415c6e6d5e8af139ff50fac4423b1d18c))
* **life-cycles:** reload linked objects on status change ([c953b3f](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/c953b3ffdad1da313e8d94ca84b49b9787ef4656))
* **life-cycles:** require realestate identification for completion ([158702c](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/158702c0b4e369c9d59490a865d3ebbd49ae0d66))
* **project-nav-tab:** check for superstructure id not infrastructure ([aae885a](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/aae885ab62f33a3f437b5784f2e10e5c37fb6b5b))
* **search-building:** fix translations and add missing search field ([2f18c51](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/2f18c51511f86343c104a8c4e56a5ee90b2af8a1))
* **translations:** add missing values ([7715d1d](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/7715d1d98a7b0693f7837e380c9300340382fd62))


### Features

* **constructionProject:** add projectFreeText1 and 2 to view ([fe8ace2](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/fe8ace24f29e113df6175f05eb7a94d3aabfbd92))
* **dwelling:** add yearOfDemolition and yearOfConstruction ([32a4c52](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/32a4c52ea75dc97eb6c642f6c7e68080c69837f5))
* **linked-projects:** add a visual separation to projects list ([170a9e0](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/170a9e0d40fb0a2798aa994249dd8fbb2a0ae317))
* **project:** add editable work list for infrastructure projects ([28dfd39](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/28dfd396dea7afd3e38a1752a7e753d25530f4fe))
* **project:** confirmation dialog when switching type of construction project ([2548141](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/2548141241cf8de4d5da94adbc8b9d0d4334bf79))
* **project:** full realestateIdentification ([2da1822](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/2da182292aa1204b44ea29d11013e1fcffb8e8a9))
* **project-nav:** add housingstat link ([e9784bb](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/e9784bb9ff7b36bb5fbcb68b0f93d3c4fd28d16f))
* **project-nav:** display building tab on infra projects ([c484256](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/c484256f0229a4799444b38afdaaad55aa351812))

# [2.6.0](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v2.5.1...v2.6.0) (2021-08-24)


### Bug Fixes

* **construction-project:** set ARBID to 1 so there are no errors for the empty linked work ([780fa4d](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/780fa4d27b24678a48c04dfec1342c6acbdb4fae))


### Features

* **construction-project:** display fixed values as plain text instead of input ([3486f62](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/3486f6247dace461d9c490bf779652cfecab1b0c))
* **project-number:** make officialConstructionProjectFileNo writable ([f6eb978](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/f6eb978ff185ba2ce03a5a23d60b1937810c155a))
* **project-search:** display official number in results ([cca3966](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/cca3966125172bb202915e44d45369544236c320))

## [2.5.1](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v2.5.0...v2.5.1) (2021-08-13)


### Bug Fixes

* **building:** allow all states to be set for new buildings ([77a5417](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/77a54171789d218ea5cbde0c0d7ac68afea4a9da))
* **model-form:** fix resetting date input after manual entry ([4eb5206](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/4eb520664337d90195472c843edb7f911839dde3))
* **project:** allow unrounded values for totalCostsOfProject field ([0a13803](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/0a138033b18ff4b984b1d80ade3ccc1f401eee64))
* **project:** fix date fields in project form ([9bf6e47](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/9bf6e4783dea6aff86ab9cea71af4c50aa801971))
* **project:** make typeOfConstruction field of project required ([10a06a4](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/10a06a46c28b951b5c019ba8ef5b3fa8cc8d3794))

# [2.5.0](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v2.4.1...v2.5.0) (2021-08-11)


### Bug Fixes

* **auth:** ensure authentication token is refreshed ([b47c2d0](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/b47c2d015bba039902df3f70cfe95d2a4b7fb118))
* **import:** fix project import and add better user flow and validation support ([d5e00fe](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/d5e00fe0f546aed3c32c4afe8abbd1cdbe26abff))
* **intl:** correct translation path for new dwelling form title ([b65c003](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/b65c00334e60cbd46af919e29a1098ecedc68b2d))
* **login:** improve login screen ([3aff280](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/3aff2807e6b69cd6230018dd9685e23a06ebcd5b))
* **modal:** fix modal container ([af06db0](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/af06db0a774391f326de94fee57e79492fe5dc3f))
* **status:** add fallback for missing model status ([c414334](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/c41433417a44530b107a09ee24841eb4ef56bdf9))


### Features

* **login:** sorted and searchable municipalities ([754604f](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/754604f129435b8123df807f1765cc5384b82200))

## [2.4.1](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v2.4.0...v2.4.1) (2021-08-03)


### Bug Fixes

* don't import full uikit ([f8be161](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/f8be16110f4790fb668faf47843af4887691a353))

# [2.4.0](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v2.3.0...v2.4.0) (2021-08-02)


### Bug Fixes

* **model-form/header:** improve ui of context menu button ([9859101](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/985910118feb283b35514971a70538f61428a811))


### Features

* **errors:** form error handling & general issue overview ([2775e6a](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/2775e6acdab169193b1842c84b02ce1c4e45c211))
* project, building & dwelling life cycle handling ([2deea9d](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/2deea9da94770e3ed23cd9f7647f9f64a2e726a5))

# [2.3.0](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v2.2.0...v2.3.0) (2021-07-08)


### Features

* **logout:** enable logout functionality ([500ac4b](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/500ac4baed008baa367e8b8c445b501d7a9b35fb))

# [2.2.0](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v2.1.3...v2.2.0) (2021-07-01)


### Bug Fixes

* use drop tasks for mutating data on the gwr api ([62daa59](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/62daa59cbd41363adb090fe5d20438719cf41927))
* **building:** fix creation of building ([6771645](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/67716456e8233553c7cdc58adbfa51d28fc2592a))
* **building-work:** set default kind of work ([f5b9361](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/f5b93612213bac0fd00bf89138d9b22b707fd039))
* **building/kindOfWork:** since this is now a model-form we have to supply a changeset ([d60bc48](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/d60bc484c705fd237a50032fb0aa969f0cc65f95))
* **deactivate-building-entrance:** disable the remove button for now ([97bb8be](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/97bb8be3d7f5ee1362ea1650f0fa831795379c2e))
* **dwelling:** adapt  model-form select options change in dwelling form ([b45d2bc](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/b45d2bc0d5a39dca2f7c3e99bcfc8eae1b0853ea))
* **dwellings:** pr comment fixes ([0a04cf6](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/0a04cf60c6c4b0990b16468d60fc65d8b0c608ce))
* **entrance:** remove rebase errors ([b723bd3](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/b723bd30967a66c75bce50a4ef12fc6b4f4e0b60))
* **entrance:** remove rebase errors ([019a3d2](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/019a3d2d4fbd0d3bc98d02d23458aecb9f87973d))
* **form:** disable submit button on loading ([1af567d](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/1af567db3ee8af9c483256b60a713ce338afc418))
* **intl:** correct pluralization of model translations ([3658c5f](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/3658c5f5eea701230e2ea088f9d20c484d8a9c0e))
* **modal:** show and contain gwr modal ([f18ed7b](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/f18ed7b69f79f3783649f2349ae867d244e5daf3))
* **model-form:** fix errors on submit and minor template changes ([2a31911](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/2a31911b07c89bd74f552d17a88e5ce28767f0f4))
* **save:** fix issues after service refactor ([d226b7c](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/d226b7cd61e6fff959718fd860d0b7a65d545a12))
* **style:** change location of validated-form style files ([3c37e9c](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/3c37e9cd07989a4427f52f2516176ac5d8be0d1d))
* **translations:** call translations with correct count param ([7d7676d](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/7d7676ddb2990a2524c858fd2e679c14789396b8))
* **validations:** add support for nested `on` validations ([bbf5d79](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/bbf5d798dd84550601f50d3b4535c9e09ce7f43d))


### Features

* **building-entrance:** implement creation of building entrance ([b768093](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/b76809337bfee1c4b2860949af810eaea18b324a))
* **building-entrance:** update building entrance ([ca2f661](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/ca2f6610320348d84d82640ff6ce85b02bee5ac0))
* **dwelling:** add missing translations ([73d7813](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/73d78137dbd99f251b6e9aa60528f510d96e824f))
* **dwelling:** edit form ([64e90d2](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/64e90d280d096d2107ac17a23d08af55aee87462))
* **dwelling:** new route and api work ([1983c08](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/1983c08f4dbeaf7bbb1995bda177448e04bda07f))
* **dwelling:** remove and reallocate ([954e20b](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/954e20b721539518b37c064c748e29d88ae4bbf6))
* **dwellings:** add more informations to the linked-models table ([dc89511](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/dc89511ec97e9daa8c8e07f39e31936c823fbd12))
* **dwellings:** be verbose about what information we display ([1a68e19](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/1a68e193db36a626f78330027a77ee8e505aefe9))
* **dwellings:** initial route and setup ([1cdfaf5](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/1cdfaf5dce9f0c3f803f755e7157e4cfb37b2919))
* **entrance:** add search view for street ([0c0601b](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/0c0601b52bf0518aadc632b112720e50aa44fd29))
* **entrance:** routing and basic form ([37dadd2](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/37dadd2b69f3d369fbcb638f1aae8d4f26e5fa9c))
* **entrance:** routing and basic form ([c29a346](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/c29a34680c6a80c300455f20c8529e15bf93cfaa))
* **select:** allow custom value and label arguments ([06369e8](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/06369e8ef953c2d61f5b4bcb6f722531025d3821))

## [2.1.3](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v2.1.2...v2.1.3) (2021-06-17)


### Bug Fixes

* **login:** hide login modal after authentication ([f47f1cd](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/f47f1cd6cdb35593f789ea511b19c2727433f271))

## [2.1.2](https://github.com/adfinis-sygroup/ember-ebau-gwr/compare/v2.1.1...v2.1.2) (2021-06-15)


### Bug Fixes

* **login:** scope modal to engine container ([0c83095](https://github.com/adfinis-sygroup/ember-ebau-gwr/commit/0c8309530285b824b6a6fe25b4733e020632d501))

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
