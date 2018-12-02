# send-sms
An Express based API server supports send SMS to phone
<!-- toc -->

- [Overview](#overview)
- [System Requirements](#system-requirements)
- [Install and Build](#install-and-build)
- [Configure](#configure)
- [Run](#run)
- [API](#api)
- [Implementation Details](#implementation-details)
- [Unit Test](#unit-test)
<!-- tocstop -->

## Overview
- A REST based api server which supports send SMSs to the given phone no
- Supports replace the http url to bilty shorten url
- Support send up to 3 SMSs to given phone no
- Written in ES6/7 and babel transpiled
- Use Eslint for static code analysis
- Use pre-commit hook for auto running Eslin and unit test

## System Requirements
- node 8.14.0
- npm

## Install and Build
```bash
git clone https://github.com/qs-wang/send-sms.git
cd send-sms
npm install
npm run build
```
## Configure

- All default config can be found in src/config.js
- Secrets should go in .env fiile which should contain following keys
- .env file should be created manully
```
BITLY_API_KEY=
BITLY_LOGIN=
BURST_API_KEY=
BURST_API_SECRET=
```
- Anything to override can be modified in .env or set explicitly

## Run
- By default app will start at `http://localhost:8000/`
```
npm run start
```

## API

### POST /sms
 - Send SMSs
 - JSON format body only
 - Request body should be:
   ```
    {
     "to" : "123456",
     "messages" : [
       "hi",
       "",
       "the website www.example.com is cool"
     ]
    }
   ```
  - Sample response would be:
    ```
    [
      'Delived',
      'Delivery Failed',
      'Delived'
    ]
    ```

## Implementation Details
- ES6/7 is used and babel is used to transpile
- Versioning of API is done
- Used Jest for test
- Used winston for logging
- Used supertest for integration test
- Support retry of all 3rd party REST API calls
- Cors enabled

## Unit Test
```
npm run test
```

## Integration Test
You can run the integration test with jest cli to verify the backend api

For example for run the /sms api you can run
```
export BURST_TEST_PHONE=123456
npx jest test/integration/index.spec.js
```