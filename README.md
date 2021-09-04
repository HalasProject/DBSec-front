
<p align="center">
<a href="https://app.getpostman.com/run-collection/5247189-c5ea517c-3e25-4026-b821-00171b99d3d7?action=collection%2Ffork&collection-url=entityId%3D5247189-c5ea517c-3e25-4026-b821-00171b99d3d7%26entityType%3Dcollection%26workspaceId%3De1fd0a0e-8321-49ad-b891-80644c511cce#?env%5BDBSec%5D=W3sia2V5IjoiYXBpX3VybCIsInZhbHVlIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaSIsImVuYWJsZWQiOnRydWV9XQ==">
    <img alt="Run in Postman" src="https://run.pstmn.io/button.svg">
</a>
<br><br>
<a href="https://david-dm.org/HalasProject/DBSec-front">
    <img alt="Dependency Status" src="https://david-dm.org/HalasProject/DBSec-front.svg">
</a>

<a href="https://app.travis-ci.com/HalasProject/DBSec-front">
    <img src="https://app.travis-ci.com/HalasProject/DBSec-front.svg?token=ZnyTEz6pNWSzgVHyX9fm&branch=master">
</a>
</p>

# DBSec Web App
DBSec is a web application framework for developers, database administrators, analysts and peoples working in IT security sector, it allows to prepare modules and run them on DBs (MySQL, SQLite, PostgreSQL , MSSQL, MariaDB) with the possibility of creating several instances.

## Architecture

DBSec is composed of two parts the client interface (Front) created with Angular & Typescript which consumes the API (Back) realized with NodeJS & Typescript, the data is stored in a document oriented database (mongoDB).

<p align="center">
 <img src="https://i.ibb.co/HtWgk9H/Flowchart-4.jpg">
</p>

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
