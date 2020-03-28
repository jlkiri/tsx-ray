import { extractInterfaces } from '../src';

const expectedOutput = {
  TestInterfaceA: {
    numberProp: 'number',
    stringProp: 'string',
  },
};

describe('Interfaces', () => {
  it('Extracts interfaces', () => {
    const result = extractInterfaces('testfiles/interfaces-a.ts');
    expect(result).toEqual(expectedOutput);
  });
});
