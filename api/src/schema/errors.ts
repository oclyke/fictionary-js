import {
  GraphQLError,
} from 'graphql'

export class ContextError extends GraphQLError {
  constructor(message = "", ...args: []) {
    super(message, ...args);
    // this.message = message + " has not yet been implemented.";
  }
}

export class DatabaseContextError extends ContextError {
  constructor(message = 'Invalid context database.', ...args: []) {
    super(message)
  }
}

export class UnimplementedError extends GraphQLError {
  constructor(message = "", ...args: []) {
    super(message, ...args);
    this.message = message + " has not yet been implemented.";
  }
}
