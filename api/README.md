# fictionary API

```yarn start```: starts the development version of the api - this includes a graphql server
as well as a websocket session manager.

```yarn codegen```: starts an apollo graphql server using the schema then runs ```codegen.yml```
on the endpoint finally dumping the generated types in ```src/generated```.
