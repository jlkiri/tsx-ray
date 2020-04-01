import { extractInterfaces } from '../src';

const expectedOutput = {
  Attendee: {
    id: 'string',
    person: {
      name: 'string',
      address: {
        city: 'number',
        country: 'string',
      },
      phoneNumbers: 'string[]',
    },
    accompaniedBy: {
      name: 'string',
      address: {
        city: 'number',
        country: 'string',
      },
      phoneNumbers: 'string[]',
    },
  },
  Address: {
    city: 'number',
    country: 'string',
  },
  Person: {
    name: 'string',
    address: {
      city: 'number',
      country: 'string',
    },
    phoneNumbers: 'string[]',
  },
};

describe('Interfaces', () => {
  it('Extracts interfaces', () => {
    const result = extractInterfaces('testfiles/interfaces-a.ts');
    expect(result).toEqual(expectedOutput);
  });
});
