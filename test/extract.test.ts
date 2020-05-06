import { extractInterfacesFromFile } from '../src';

const expectedOutput = {
  Address: {
    city: ['string', 'number'],
    country: 'string',
  },
  Attendee: {
    container: true,
    id: 'string',
    person: {
      name: 'string',
      isUnderage: 'boolean',
      phoneNumbers: ['string'],
      address: {
        city: ['string', 'number'],
        country: 'string',
      },
    },
    accompaniedBy: {
      name: 'string',
      isUnderage: 'boolean',
      phoneNumbers: ['string'],
      address: {
        city: ['string', 'number'],
        country: 'string',
      },
    },
    status: ['beginner', 'experienced', 'pro'],
    accessLv: [1, 2, 3],
  },
  Person: {
    name: 'string',
    isUnderage: 'boolean',
    phoneNumbers: ['string'],
    address: {
      city: ['string', 'number'],
      country: 'string',
    },
  },
};

describe('Interfaces', () => {
  it('Extracts interfaces', () => {
    const result = extractInterfacesFromFile('testfiles/interfaces.ts');
    expect(result).toEqual(expectedOutput);
  });
});
