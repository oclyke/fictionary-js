// these classes are only meant to deal with the GraphQL interface, so they have similar fields
// todo: generate suitable classes automatically from the api interface code (we mostly have the tech except the bundlers seem to dislike importing from a parent directory)

export class User {
  id?: string = undefined;
  name: string | null = null;
  color: string | null = null;

  constructor(id?: string, base?: Partial<User>) {
    if (typeof id !== 'undefined') { this.id = id; }
    if (typeof base !== 'undefined') { this.fromBase(base); }
  }

  fromBase(base: Partial<User>): User {
    if (typeof base.name !== 'undefined') { this.name = base.name; }
    if (typeof base.color !== 'undefined') { this.color = base.color; }
    return this;
  }

  static gqlFields(): string {
    return `
      id
      name
      color
    `;
  }
}
