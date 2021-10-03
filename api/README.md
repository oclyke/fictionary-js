# api (rapid-trex)

![rex](./docs/assets/rex.png)

api for freestyle
we are using graphql as the api

## dev setup

1. Make a copy of `.env.example` named `.env` and update vars to appropriate values
2. Launch with `yarn run start:dev`

### add ngrok tunnel for external services
services such as auth0 may require to access the local dev environment - we can use ngrok to allow this.

1. navigate to ngrok executable location 
  ```cd /usr/local/bin```
2. start ngrok http tunnel to the endpoint
  ```./ngrok http 4000```
3. note the forwarding url
   ```https://7bdfe56a9572.ngrok.io```
  
make sure to use the updated forwarding url in the external services - it changes each time ngrok services are started

## generating typescript types from the schema:
thanks to the ```graphql-codegen``` package this is really easy (and you should do it if you modify the schema)

* [```yarn codegen```](https://www.graphql-code-generator.com/)

(the codegen tool requires the graphql endpoint to be up and running b/c that's how it gets the schema definition)

## notes
just some stupid notes for myself and anyone else willing to listen

**throwing errors in resolvers**: the graphql library seems to catch these and pass them along to the client... this is cool. its an easy way to pass along problems to someone else (haha) and keep resolver code simple. but keep in mind that these messsages will go out to anyone who can access the endpoint.

**about input types**
graphql requires a special input type for query/mutation arguments. see ['field must be of input type'](https://stackoverflow.com/questions/45806368/graphql-error-field-type-must-be-input-type-but-got) on SO.

**how to use variables in queries within graphql playground**
![example](./docs/assets/example_query_w_vars.png)

**how to add a JWT token to auth headers in graphql playground**
![example](./docs/assets/example_query_w_auth_headers.png)
