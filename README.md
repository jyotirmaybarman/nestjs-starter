<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository with configurations of the following -

- Postgres DB
- TypeORM (structured migrations & entities [see usage](#typeorm-usage))
- Queue (Custom seamless queue implementation [see usage](#queue-usage))
- Caching
- Swagger for documentation
- Custom environment variables handling with multiple files & validation using Zod ( ie. simplified `Testing` )
- Helmet to set security-related HTTP headers appropriately
- Logger using winston (console logs are nest like [see usage](#logger-usage))
- Auth Guard (Expects a Bearar token): By default the following token will work if you want to test the protected routes
  `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkzMTdmN2ZjLWVjYjQtNGEwOS04ZGFkLTZiMGZlMGZjM2VhMyIsImZpcnN0X25hbWUiOiJqb2huIiwibGFzdF9uYW1lIjoiZG9lIiwiZW1haWwiOiJqb2huQGRvZS5jb20iLCJpYXQiOjE3MDc0MTkwNzV9.PfUoWAPjFyA93GNaqAtys4x2wJgLd1sm89JvM3xlnt8`

## Installation

```bash
$ npm install
```

## Usage

<div id="typeorm-usage">
</div>

#### TypeORM

Define a new entity with the `.entity.ts` extension preferably in here `src/models/your-model/entities/name.entity.ts` or wherever you want, then generate a migration file with the following command -

```bash
npm run migration:generate --name=your_migration_file_name
```

It will generate a migration file in `src/providers/typeorm/migrations`

You can deploy the migrations using -

```bash
npm run migration:deploy
```

OR undo the latest migration using -

```bash
npm run migration:undo
```

<div id="queue-usage"></div>

#### QUEUE

Add a new job with the processing logic to `src/providers/queue/queue.jobs.ts`, the type definitions will be automatically picked up.

```ts
export class QueueJobs {
  /** Other Code */

  async newJob(payload: { message: string }): Promise<boolean> {
    /** code related to processing of the job */
    return true;
  }

  /** Other Code */
}
```

Now using QueueService, just add the job & processing will be handled automatically.

```ts
Class AnyService{
  constructor(
    private readonly queueService: QueueService
  ){}

  someMethod(){
    this.queueService.addJob({
      task: "newJob",
      payload: {
        message: "my-message"
      }
    })
  }
}

```


<div id="logger-usage"></div>

### LOGGER

Crate new logger from the `WinstonLogger` class from `src/utils/winston-logger/winston-logger.ts`.

Logs are saved in the `logs` folder in the root directory, by default it will keep logs upto 30 days.

```ts
class MyService{
  private logger = new WinstonLogger(MyService.name) // sets up the context

  foo(){
    // use like this to pass additional data
    this.logger.error({
      message: "Unauthorized",
      data: {
        user: {
          id: 1,
          first_name: "Jyotirmay",
          last_name: "Barman"
        }
      }
    });
    // OR just to pass the message
    this.logger.error("Unauthorized");
  }

}

```

We have the following methods available in the WinstonLogger class - 

```ts
type LogPayload = string | {
  message: string,
  data?: any,
  context?:string,
  stack?: string,
}

fatal(payload: LogPayload, context?: string, stack?: string);
error(payload: LogPayload, context?: string, stack?: string);
log(payload: LogPayload, context?: string, stack?: string);
warn(payload: LogPayload, context?: string, stack?: string);
debug(payload: LogPayload, context?: string, stack?: string);
verbose(payload: LogPayload, context?: string, stack?: string);
setContext(ctx:string);
getContext(): string;
```

`NOTE : We avoid using dependency injection for the logger because it disrupts the context when implemented` 

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
