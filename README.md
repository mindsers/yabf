# Yabf

[![npm](https://img.shields.io/npm/v/yabf.svg?style=flat-square)](https://www.npmjs.com/package/yabf)
[![npm](https://img.shields.io/npm/dt/yabf.svg?style=flat-square)](https://www.npmjs.com/package/yabf)
[![npm](https://img.shields.io/npm/l/yabf.svg?style=flat-square)](https://github.com/Mindsers/yabf/blob/master/LICENSE)
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)
[![Patreon](https://img.shields.io/badge/support-patreon-F96854.svg?logo=patreon&style=flat-square)](https://www.patreon.com/bePatron?u=9715649)
[![Discord](https://img.shields.io/badge/chat-discord-7289DA.svg?logo=discord&logoColor=7289DA&style=flat-square)](https://discord.gg/AtKK45B)

**Yet Another Basic Framework** for NodeJS.

It is a learning experience: I wouldn't use [expressjs](https://expressjs.com) as usual but learn how to make/code dependency injection, routing, http requests, and other development patterns/paradigms/concepts by myself.

It can be use as a base for server projects. Of course so much things are missing and you will have to develop it yourself or create an [issue in this repo](https://github.com/mindsers/yabf/issues).

*Yabf* work either with JavaScript and TypeScript projects.

## Install

To use *Yabf* in your project you have to import it :

```sh
yarn add yabf@latest
```

## Usage

*Yabf* works with controller and services. To load your controllers and services there are two methods in `WebApplication`: `declare` for controllers and `prodive` for services or data.

After declaring all your classes, you have to start the server.

```ts
import { WebApplication } from 'yabf'

import { MailService } from './services/mail-service'
import { MainController } from './controllers/mail-controller'

(function main() {
  const app = WebApplication.createInstance()

  app.provide(MailService)
  app.declare(MainController)

  app.start()
})()
```

Why using `WebApplication.createInstance()` instead of `new WebApplication()` ? When you provide services or declare controllers you use the *Yabf* dependency injector. All the *Yabf* services also use this dependency injector. So, `WebApplication` need to provide other internal services before your start to using it.

You can ask *Yabf* to inject dependencies into your controllers or services. However, controllers **can't be injected** in other controllers.
z
```ts
app.provide(MailService)
app.declare(MainController, [MailService])
```

For more details, please refer to the [wiki](https://github.com/mindsers/yabf/wiki) or [docs files](https://github.com/mindsers/yabf/tree/develop/docs).

## Contribution

Contributions to the source code of *Yabf* are welcomed and greatly appreciated. For help on how to contribute in this project, please refer to [How to contribute to *Yabf*](https://github.com/mindsers/yabf/blob/develop/CONTRIBUTING.md).

To see the contributors list, go to the [CONTRIBUTORS.md](https://github.com/mindsers/yabf/blob/develop/CONTRIBUTORS.md) file.

## Support

*Yabf* is licensed under an MIT license, which means that it's completely free open source software. Unfortunately, *Yabf* doesn't make it itself. Which will result in many late, beer-filled nights of development for me.

If you're using *Yabf* and want to support the development, you now have the chance! Go on my [Patreon page](https://www.patreon.com/mindsers) and become my joyful patron!!

[![Become a Patron!](https://c5.patreon.com/external/logo/become_a_patron_button.png)](https://www.patreon.com/bePatron?u=9715649)

For help on how to support *Yabf*, please refer to [The awesome people who support *Yabf*](https://github.com/Mindsers/yabf/blob/develop/SPONSORS.md).

<!-- ### Premium sponsors -->

## License

This project is under the MIT License. (see LICENSE file in the root directory)

> MIT License
>
> Copyright (c) 2018 Nathanael CHERRIER
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.
