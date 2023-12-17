# Maternal and Child Health Care API
This is a Backend side of MCH Application. 
The purpose of this project is to help current medical staff to increase their productivity regarding report and manajement.

## API Documentation
The API Documentation is available at: https://bump.sh/mnfaizp/doc/mch-api

## Database Strcuture
Database will be using PostgreSQL. The structure of the database is as follows: https://dbdiagram.io/d/MCH-657b6e3e56d8064ca00edb6c

## Architectural Concept
Using Clean Architecture form R.C Martin knowns as Uncle Bob

## Requirements
1. Node.js v14.15.4 or later, you can download it [here](https://nodejs.org/en/download/)
```bash
# check node version
node -v

# check npm version
npm -v
```
2. PostgreSQL v12.x or later, you can download it [here](https://www.postgresql.org/download/)
```bash
# check postgres version
psql --version
```

## How to run
1. Clone this repository
```bash
git clone https://github.com/mnfaizp/mch-api.git
```

2. Install all dependencies using `npm install`
```bash
npm install
``

3. Create a `.env` file and fill it with the required environment variables
```yml
# HTTP Server
HOST=localhost
PORT=5000

# POSTGRES
PGHOST=localhost
PGUSER=postgres
PGDATABASE=mch_api_developement
PGPASSWORD=password
PGPORT=5432
 
# POSTGRES TEST
PGHOST_TEST=localhost
PGUSER_TEST=postgres
PGDATABASE_TEST=mch_api_test
PGPASSWORD_TEST=password
PGPORT_TEST=5432

# CREDENTIAL
ACCESS_TOKEN_KEY=access_token
REFRESH_TOKEN_KEY=refresh_token
```

4. Create a database with the name `mch_api_developement` and `mch_api_test`
```bash
# login to postgres
psql -U postgres -d postgres

# create database
CREATE DATABASE mch_api_developement;
CREATE DATABASE mch_api_test;
```

5. Run the database migration using `npm run migrate`
```bash
npm run migrate
```

3. Run the server using `npm run dev`
```bash
npm run dev
```