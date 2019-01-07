# servereless-template

##### Quick links
- [Install and Run](#install)
- [Features](#Features)
  - [Easy setup](#h-1)
  - [Local development](#h-2)
    - [No mocks required](#h-3)
    - [No deployments required](#h-4)
  - [Quality error handling](#h-5)
    - [Produce human readable errors to the client](#h-6)
    - [Log stack traces to the console and cloudwatch](#h-7)
  - [Easy testing](#h-8)
    - [No mocking required](#h-8)
    - [Test code front to back](#h-8)
    - [Run tests in ci without any extra setup](#h-8)
  - [asyncEndpoint goodness](#h-9)
    - [Auto add cors header](#h-10)
    - [Auto stringify body](#h-11)
  - [Documentation](#h-12)
    - [Produce swagger docs from the serverles.yml with a single command](#h-12)
    - [Docs are served with a interactive website](#h-12)
  - [Direct invocation](#h-15)

## <a name="install"></a>Install and run
#### Install dependencies
```bash
npm i
```

#### Setup local
This only needs to be run once after npm install
```bash
npm run setup
```

#### Produce swagger docs
Please run this and commit the openapi.json if you make changes to the api documentation
```bash
npm run docs
```

#### Run local
This will start everything (service, DynamoDB)
```bash
npm start
```

#### Access DynamoDB-local shell
This is a great tool. There is documentation and code examples in the shell that can help you learn how to use DynamoDB. You can also debug you data in this shell.

[http://localhost:8000/shell](http://localhost:8000/shell)

### Postman collection
[web link](https://documenter.getpostman.com/view/5996612/Rzn8Pgx3)



## Features

#### Highlights
  - [Easy setup](#h-1)
  - [Local development](#h-2)
    - [No mocks required](#h-3)
    - [No deployments required](#h-4)
  - [Quality error handling](#h-5)
    - [Produce human readable errors to the client](#h-6)
    - [Log stack traces to the console and cloudwatch](#h-7)
  - [Easy testing](#h-8)
    - [No mocking required](#h-8)
    - [Test code front to back](#h-8)
    - [Run tests in ci without any extra setup](#h-8)
  - [asyncEndpoint goodness](#h-9)
    - [Auto add cors header](#h-10)
    - [Auto stringify body](#h-11)
  - [Documentation](#h-12)
    - [Produce swagger docs from the serverles.yml with a single command](#h-12)
    - [Docs are served with a interactive website](#h-12)
  - [Direct invocation](#h-15)

### In-depth

#### <a name="h-1"></a>Easy setup
Run 2 commands and you are good to go
```bash
npm i
npm run setup

# start will source you env vars for you
npm start
```


#### <a name="h-2"></a>Local development
We are using serverless http endpoints with a local database running. To run the endpoints locally we are using a plugin for serverless called `serverless-offline`. To run DynamoDB locally we are using a plugin called `serverless-dynamodb-local`, this will handle both the installation and database creation automatically so you don't need anything setup prior.

- <a name="h-3"></a>**No mocks required**
  - A local version of Dynamodb is running locally using `serverless-dynamodb-local`. No prior installations or setup is required for this to work.
- <a name="h-4"></a>**No deployments required**
  - You can run the service locally using `serverless-offline`
  - Since all the needed components run locally on your machine you do **not** need to deploy code to run or test is


#### <a name="h-5"></a>Quality error handling
  The `asyncEndpoint` util adds quality error handling without any special setup. This will prevent errors from being swallowed/lost and clients not getting a response when an error happens.
  <a name="h-6"></a><a name="h-7"></a>
```javascript
const { asyncEndpoint, ResponseError } = require('./utils');

exports.handler = asyncEndpoint(async event => {
  throw Error('Missing everything');
  // you can also use ResponseError if you want to change the status code
  throw ResponseError('Missing everything', 409);
  return { body: {} }
})

// --- Client response ---
{
  statusCode: 500,
  body: { message: "Missing everything" }
}

// --- Console logs ---
[1546131531203] ERROR (18186 on GLGPCAdmins-MBP): Error: Missing everything
  at exports.handler.asyncEndpoint (/some-path/handler.js:22:9)
  at process._tickCallback (internal/process/next_tick.js:68:7)
```

#### <a name="h-8"></a>Easy testing
Since everything runs locally we can easily test the code as is without mocks.
```bash
npm test
```

We are not using any servers (express) so invoking the handler is equivalent to hitting the http endpoint. This means we can simply load the handler file and invoke the method.
```javascript
// handler.js
exports.handler = asyncEndpoint(async event => {
  return { body: { message: 'ok' } };
})
```

```javascript
// handler.test.js
const { handler } = require('./handler.js');

describe('handler test', () => {
  test('check it', async () => {
    const user = await handler();
    const body = JSON.parse(user.body);
    expect(body.message).toBe('ok');
  });
});
```

#### <a name="h-9"></a>asyncEndpoint goodness
The `asyncEndpoint` util provides some nice automation to make handler code simpler.
```javascript
// sample handler with asyncEndpoint
exports.someHandler = asyncEndpoint(async event => {
  const { id } = event.pathParameters || {};
  const some = await service.getSome();
  // if some throws an error async endpoint will handle it so there is not need to catch it in the handler
  return { body: { some } };
});
```

<a name="h-10"></a>
```javascript
// automatically adds the `Access-Control-Allow-Origin` header for cors
if (!response.headers) response.headers = {};
response.headers['Access-Control-Allow-Origin'] = '*';
```
<a name="h-11"></a>
```javascript
// automatically stringify body. This is required by lambda
if (response.body && typeof response.body === 'object') response.body = JSON.stringify(response.body);
```
```javascript
// This checks if the event is a scheduled event and immediately returns to keep endpoint warm
if (event.source && event.source === 'aws.events') return {};
```

#### <a name="h-12"></a>Documentation
Using a plugin called `serverless-openapi-documentation` we can easily produce Swagger v3 compatible documentation. Even better we can maintain the serverless config and the docs in a single file so they do not get out of sync. We are using the swagger-ui to provide interactive api documentation.
```yml
functions:
  some-handler:
    handler: app/handler.someHandler
    logForwarding:
    events:
      - http:
          path: somePath
          method: get
          documentation:
            summary: "some summary"
            description: "some description"
            requestHeaders:
              -
                name: "Authorization"
                description: "Bearer token"
            methodResponses:
                -
                  statusCode: "200"
                  responseBody:
                    description: "List of users"
                  responseModels:
                    "application/json": "User"
                -
                  statusCode: "409"
                  responseModels:
                    "application/json": "ErrorResponse"
```

#### <a name="h-15"></a>Direct invocation
Since we are providing simple Lambda handlers we can also directly invoke each endpoint so lambdas can talk to each other without passing through api gateway.
```javascript
var AWS = require('aws-sdk');
AWS.config.region = 'eu-west-1';
var lambda = new AWS.Lambda();

lambda.invoke(params, (err, data) => {
  if (err) console.error(err);
  else console.log(data.Payload);
})
```
