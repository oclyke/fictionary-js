/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import * as faker from 'faker';

const mocks = {
  Facility: () => ({
    name: faker.company.companyName,
  }),
  Service: () => ({
    name: faker.commerce.department,
    confirmed: faker.datatype.boolean,
  }),
  Skill: () => ({
    name: faker.commerce.department,
    confirmed: faker.datatype.boolean,
  }),
  User: () => ({
    name: faker.company.companyName,
  }),
  Location: () => ({
    address: faker.address.streetAddress,
  }),
  Individual: () => ({
    first: faker.name.firstName,
    last: faker.name.lastName,
    phone: faker.phone.phoneNumber,
    email: faker.internet.email,
  }),
  Timespan: () => ({
    start: faker.time.recent,
    stop: faker.time.recent,
  }),
};

export default mocks;
