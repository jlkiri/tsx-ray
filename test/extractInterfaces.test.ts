import { extractInterfaces } from '../src';

const expectedOutput = {
  Address: {
    city: ['string', 'number'],
    country: 'string',
  },
  Attendee: {
    id: 'string',
    person: {
      name: 'string',
      phoneNumbers: ['string'],
      address: {
        city: ['string', 'number'],
        country: 'string',
      },
    },
    accompaniedBy: {
      name: 'string',
      phoneNumbers: ['string'],
      address: {
        city: ['string', 'number'],
        country: 'string',
      },
    },
  },
  Person: {
    name: 'string',
    phoneNumbers: ['string'],
    address: {
      city: ['string', 'number'],
      country: 'string',
    },
  },
};

describe('Interfaces', () => {
  it('Extracts interfaces', () => {
    const result = extractInterfaces('testfiles/interfaces.ts');
    expect(result).toEqual(expectedOutput);
  });
});
