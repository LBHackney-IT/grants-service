# Grants Service

> Web app and API for creating grant application forms and managing responses

## Overview

This application was developed for [Hackney Council](https://hackney.gov.uk/) to allow for the creation of different grant forms, and to support staff in managing the review and approval of applications. It is based on the original code from the [Additional Restrictions Grant](https://github.com/LBHackney-IT/arg-business-grants) codebase, with a number of enhancements to support multiple grant types within a single deployed application.

It consists of two primary views:

- a publicly available front end for applicants
- a restricted back end for Grant Administrators to process claims

## Getting Started

### Requirements

You must have the following installed

- Node.js 14 if you have [NVM](https://github.com/nvm-sh/nvm) installed, run `$ nvm use` in your terminal.
- PostgreSQL 11 installed and running
  - The included `docker-compose.yml` file will set up a local Postgres instance for you, running on port `5432`
  - Run: `$ docker-compose up`

### Install

1.  Install the dependencies:

        $ yarn

2.  Create an `.env.local` file from `.env.sample` following the guidance notes in the sample file. If you are unsure about a value you can view the environment variables on the AWS Lambda in staging or production (if it is already running).

3.  Add the following to your `/etc/hosts` file, so that the auth token from using staging / production can work with your local environment, giving you access to the restricted sections of the application (i.e. admin panel):

        127.0.0.1 dev.hackney.gov.uk

4.  Run the development server:

        $ yarn dev

5.  Open [http://dev.hackney.gov.uk:3000](http://dev.hackney.gov.uk:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

### Local database

Below is a short guide to get started with configuring the database for your local development environment.

#### Setup

1.  Add the database URL as an environment variable in `.env`. On Linux, you may need to provide a username
    and password.

    ```sh
    $ echo DATABASE_URL=postgresql://localhost/arg >> .env

    # For Linux
    $ echo DATABASE_URL=postgresql://username:password@localhost/arg >> .env
    ```

2.  Run all migrations

    ```sh
    $ yarn dbmigrate up
    ```

#### Seed

To seed your database with data to get going quickly, you can run the file under `db/seeds.sql` by doing the
following:

```sh
$ cat db/seeds.sql | psql arg
```

You'll also want to submit an application via the API to bootstrap the grant officer list.

```bash
curl --data @utils/fixtures/toAPI.json --header "Content-Type: application/json" --request POST http://dev.hackney.gov.uk:3000/api/applications
```

#### Migrations

Database migrations are managed with [db-migrate](https://github.com/db-migrate/node-db-migrate). To create
a new migration, run the following command:

```sh
$ yarn dbmigrate create description-for-your-migration
```

This will create an `up` and `down` migration as `.sql` files in `db/migrations/sqls` as well as a
JavaScript file in `db/migrations` to run the SQL files.

Migrations are run with:

```sh
$ yarn dbmigrate up
```

Migrations can be rolled back with:

```sh
$ yarn dbmigrate down
```

You can do a dry-run to view the changes that will be applied without making any changes (for both up and
down migrations)

```sh
$ yarn dbmigratedry up
```

### Deployed database

When deployed, the application uses the `HOST`, `USERNAME`, `PASSWORD` and `DATABASE` environment variables for connection, instead of the `DATABASE_URL` environment variable (used locally).

## Architecture

![architecture](dbg-aws.jpg)
[Editable Diagram Source](dbg-aws.drawio)

## Technology

This is a [Next.js](https://nextjs.org/) project bootstrapped with
[`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### TypeScript

The most recent contributions to this codebase have been in [TypeScript](https://www.typescriptlang.org/), however this migration is ongoing, so you will still likely find a decent amount of JavaScript in the codebase.

### PostgreSQL

The database engine is [PostgreSQL](https://www.postgresql.org/), version 11 in
[AWS RDS](https://aws.amazon.com/rds/).

![db-schema](dbg-schema.png)

## Known issues / limitations

### MIME types on S3 files

If the application is re-enabled - when users upload supporting documents they will be stored in S3 with the
wrong MIME type set.
See [here](https://github.com/LBHackney-IT/arg-business-grants/blob/master/docs/S3-METADATA.md) for a
complete description and fix.

## Testing

### Security testing

On every code change an [OWASP Basline scan](https://www.zaproxy.org/docs/docker/baseline-scan/) is run, and checks for common security vulnerabilities in the Grant Service web server.

The configuration for the scan, and what is deemed a `WARN` or a `FAIL` can be found in the [zap-baseline.conf](zap-baseline.conf) file.

_**Note:** This does not replace the need for regular PEN tests, but provides useful regular insight into any security regressions as the codebase evolves._

### Unit testing

There is a suite of unit tests written in [Jest](https://jestjs.io/) that can be run with `$ yarn unit-test`.

### End to end testing

> Note: before running these tests, ensure the application is up and running locally

A suite of [Cypress](https://www.cypress.io/) tests can be run with:

    # Headless, no visual inspector
    $ yarn cypress-run

    # With the visual inspector
    $ yarn cypress-open

## Staging / production environment

### Migrations and seeding

A dedicated migration Lambda is deployed alongside the application code, and is invoked as part of the CI/CD pipeline. This will run any new migrations since the last deployment.

You can optionally run the database seeds by uncommenting the `seedDatabase()` call in `./database-migrator/index.js`.
