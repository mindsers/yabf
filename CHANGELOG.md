# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- New `abstract` class `AbstractApplication` to allow core extension. (new type of application).
- Add `SPONSORS.md` and a `README.md` section to thanks people who contribute to Yabf.
- Add `CHANGELOG.md` to log changes more easy and clearly than `git log`.

### Changed
- `Application` is now `WebApplication`.`
- `AbstractApplication` children can use tiers dependency injector.

### Fixed
- Remove restrictions on controllers' properties.

## [1.0.0] - 2018-07-22
### Added
- `Application` allow to create a basic backend javascript server (node).
- Add a `Router` to organize and redirect call to controllers.
- Add `Request` and `Response` to abstract logic of HTTP request and response.

[Unreleased]: https://github.com/Mindsers/yabf/tree/develop
[1.0.0]: https://github.com/Mindsers/yabf/tree/v1.0.0
