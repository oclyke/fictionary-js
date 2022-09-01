import {
  nodeDefinitions,
  fromGlobalId,
} from 'graphql-relay'

export {
  nodeInterface,
  nodeField,
}

/**
 * We get the node interface and field from the relay library.
 *
 * The first method is the way we resolve an ID to its object. The second is the
 * way we resolve an object that implements node to its type.
 */
const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId)
    switch (type) {
      case 'Meta':
        return (() => { console.warn('unimplemented'); return undefined })()
      case 'Definition':
        return (() => { console.warn('unimplemented'); return undefined })()
      case 'Player':
        return (() => { console.warn('unimplemented'); return undefined })()
      case 'Game':
        return (() => { console.warn('unimplemented'); return undefined })()
    }
  },
  (obj) => {
    if (obj.____typename === null || typeof obj.____typename === 'undefined') {
      throw new Error('could not identify object\'s type with \'____typename\' field')
    }
    return obj.____typename
  },
);
