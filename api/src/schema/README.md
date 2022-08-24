# schema
the schema is the definition of the API.

with the introduction of [graphql-relay](https://github.com/graphql/graphql-relay-js)
the ```schema.gql``` file is no longer used for generation, it is just a "shorthand"
indicating the desired API. the API is now generated programmatically so as to ease
the inclusion of standard patterns such as [Connections](https://relay.dev/graphql/connections.htm) (and because I can...).
