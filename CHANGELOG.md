# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- New lightweight `LoggerService` compatible w/ the debug package ([#35](https://github.com/Mindsers/yabf/issues/35))
- New documentation block for `LoggerService` ([#35](https://github.com/Mindsers/yabf/issues/35))

## [v2.0.2] - 2018-11-25
### Changes
- Let TypScript handles dependencies auto-instancation. (Cancel [v2.0.1])

### Fixed
- `Injector` was injected twice in `WebApplication`. ([#23](https://github.com/Mindsers/yabf/issues/23))

## [v2.0.1] - 2018-11-25

### Changes
- Force instance variable for `RouterSerivce` in `WebApplication`.

## [v2.0.0] - 2018-09-30
### Added
- New `abstract` class `AbstractApplication` to allow core extension. (new type of application). ([!15](https://github.com/Mindsers/yabf/pull/15), [!18](https://github.com/Mindsers/yabf/pull/18))
- Add `SPONSORS.md` and a `README.md` section to thanks people who contribute to Yabf. ([!12](https://github.com/Mindsers/yabf/pull/12), [!13](https://github.com/Mindsers/yabf/pull/13))
- Add `CHANGELOG.md` to log changes more easily and clearly than `git log`. ([!17](https://github.com/Mindsers/yabf/pull/17))
- Add full documentation in the project ([#19](https://github.com/Mindsers/yabf/issues/19), [!20](https://github.com/Mindsers/yabf/pull/20))

### Changed
- `Application` is now `WebApplication`. Using `Application` is deprecated. ([!15](https://github.com/Mindsers/yabf/pull/15), [!18](https://github.com/Mindsers/yabf/pull/18))
- `AbstractApplication` children can use tiers dependency injector ([!18](https://github.com/Mindsers/yabf/pull/18)).

### Fixed
- Remove restrictions on controllers' properties. ([#10](https://github.com/Mindsers/yabf/issues/10), [!11](https://github.com/Mindsers/yabf/pull/11))
- Use `IDependencyInjectionProvider` instead of `Injector` for public exposition. ([!18](https://github.com/Mindsers/yabf/pull/18))

## [v1.0.0] - 2018-07-22
### Added
- `Application` allow to create a basic backend javascript server (node).
- Add a `Router` to organize and redirect call to controllers.
- Add `Request` and `Response` to abstract logic of HTTP request and response.

[Unreleased]: https://github.com/Mindsers/yabf/tree/develop
[v2.0.2]: https://github.com/Mindsers/yabf/tree/v2.0.2
[v2.0.1]: https://github.com/Mindsers/yabf/tree/v2.0.1
[v2.0.0]: https://github.com/Mindsers/yabf/tree/v2.0.0
[v1.0.0]: https://github.com/Mindsers/yabf/tree/v1.0.0
