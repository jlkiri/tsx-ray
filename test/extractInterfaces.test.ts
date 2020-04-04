import { parseInterfaces } from '../src';

const expectedOutput = {
  Attendee: {
    id: 'string',
    person: {
      name: 'string',
      address: {
        city: ['string', 'number'],
        country: 'string',
      },
      phoneNumbers: ['string'],
    },
    accompaniedBy: {
      name: 'string',
      address: {
        city: ['string', 'number'],
        country: 'string',
      },
      phoneNumbers: ['string'],
    },
  },
  Address: {
    city: ['string', 'number'],
    country: 'string',
  },
  Person: {
    name: 'string',
    address: {
      city: ['string', 'number'],
      country: 'string',
    },
    phoneNumbers: ['string'],
  },
};

describe('Interfaces', () => {
  it('Extracts interfaces', () => {
    const result = parseInterfaces('testfiles/interfaces-a.ts');
    expect(result).toEqual(expectedOutput);
  });
});
