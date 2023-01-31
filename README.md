<p align='center'>
  <img src='./public/logo.png' alt='DataGram' height='200'/>
</p>

# DataGram-api

## Introduction

DataGram is a powerful data visualization and analysis tool that allows users to easily explore and understand complex data sets. With its intuitive interface and comprehensive set of features, DataGram makes it simple for users to create beautiful, interactive charts and graphs that can be easily shared and analyzed. Whether you're a business professional, a researcher, or simply someone looking to gain insights from your data, DataGram has the tools you need to turn your data into actionable information.

## Background

DataGram is my graduation project in 2023, completed under Mr. Zhu's guidance. If not necessary, I will not update this project.

## Features

### System management

- Users can register, log in, reset their password, and the like.
- Admins can control users' permission to create dashboards. Non-paying users can only make up to two dashboards, and paying users can create unlimited ones.
- Admins can record, view, and search system operation logs.

### Chart creation

- Support for the creation, renaming, and deletion of dashboards.
- Support for quick construction of dashboards online using drag-and-drop.
- Support for chart style settings.
- Support for exporting dashboards to images.
- Support creating public links to share dashboards.

### Data connectivity

- Support multiple data sets, such as Excel files and API data sources.
- Support for uploading and managing data sources in the cloud.

## Install

This project uses [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/). Go check them out if you need to install them locally.

Besides, the project requires a front-end. Go check [datagram](https://github.com/GeniusCorn/datagram).

```shell
# clone the project
git clone https://github.com/GeniusCorn/datagram-api.git

# enter the project directory
cd datagram-api

# install dependency
pnpm i

# develop
pnpm dev

# start
pnpm start
```

### Environment variables

```.env
# specify a port number
PORT = '3000'

# the database options
DATABASE_HOST = '127.0.0.1'
DATABASE_PORT = '3306'
DATABASE_NAME = 'datagram'
DATABASE_USER = 'datagram'
DATABASE_PASS = 'datagram'

# the jwt secret
TOKEN_SECRET = 'datagram'
```

### Database

#### Dashboard

| Field       | Type         | Null | Key | Default           | Extra             |
| ----------- | ------------ | ---- | --- | ----------------- | ----------------- |
| id          | bigint       | NO   | PRI | NULL              | auto_increment    |
| name        | varchar(100) | NO   |     | NULL              |                   |
| data        | longtext     | YES  |     | NULL              |                   |
| owner       | bigint       | NO   |     | NULL              |                   |
| share       | bigint       | NO   |     | 0                 |                   |
| share_token | varchar(100) | YES  |     | NULL              |                   |
| create_time | timestamp    | NO   |     | CURRENT_TIMESTAMP | DAFAULT_GENERATED |

#### Dataset

| Field       | Type         | Null | Key | Default           | Extra             |
| ----------- | ------------ | ---- | --- | ----------------- | ----------------- |
| id          | bigint       | NO   | PRI | NULL              | auto_increment    |
| name        | varchar(100) | NO   |     | NULL              |                   |
| data        | longtext     | NO   |     | NULL              |                   |
| owner       | bigint       | NO   |     | NULL              |                   |
| create_time | timestamp    | NO   |     | CURRENT_TIMESTAMP | DAFAULT_GENERATED |

#### Record

| Field       | Type         | Null | Key | Default           | Extra             |
| ----------- | ------------ | ---- | --- | ----------------- | ----------------- |
| id          | bigint       | NO   | PRI | NULL              | auto_increment    |
| account     | varchar(100) | NO   |     | NULL              |                   |
| operation   | varchar(100) | NO   |     | NULL              |                   |
| create_time | timestamp    | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |

#### User

| Field     | Type         | Null | Key | Default | Extra          |
| --------- | ------------ | ---- | --- | ------- | -------------- |
| id        | bigint       | NO   | PRI | NULL    | auto_increment |
| account   | varchar(100) | NO   |     | NULL    |                |
| password  | varchar(100) | NO   |     | NULL    |                |
| phone     | varchar(100) | YES  |     | NULL    |                |
| authority | varchar(100) | NO   |     | user    |                |

## Maintainer

[![@GeniusCorn](https://avatars.githubusercontent.com/u/12198452?s=150&v=4)](https://github.com/GeniusCorn)
[@GeniusCorn](https://github.com/GeniusCorn)

## License

[MIT](license.md)
