import { extractInterfaces } from '../src';

const expectedOutput = {
  Attendee: {
    person: {
      name: 'string',
      address: {
        city: 'number',
        country: 'string',
      },
    },
  },
  Person: {
    name: 'string',
    address: {
      city: 'number',
      country: 'string',
    },
  },
  Address: {
    city: 'number',
    country: 'string',
  },
};

describe('Interfaces', () => {
  it('Extracts interfaces', () => {
    const result = extractInterfaces('testfiles/interfaces-a.ts');
    expect(result).toEqual(expectedOutput);
  });
});
