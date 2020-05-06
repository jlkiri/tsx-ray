## Intro

This library extracts interface definitions from a TypeScript source file and parses it into a JSON-compatible JavaScript object.

Use it to turn this

```typescript
interface Attendee {
  id: ID;
  person: Person;
  accompaniedBy?: Person;
  status: 'beginner' | 'experienced' | 'pro';
  accessLv: 1 | 2 | 3;
}

interface Person {
  name: string;
  isUnderage: boolean;
  address: Address;
  phoneNumbers: PhoneNumbers;
}

interface Address {
  city: City | CityCode;
  country: Country;
}

type Country = string;
type City = string;
type CityCode = number;
type ID = string;
type PhoneNumbers = string[];
```

into this

```javascript
{
  Address: {
    city: ['string', 'number'],
    country: 'string',
  },
  Attendee: {
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
}
```

## Usage

The exported function `extractInterfacesFromFile` takes a filepath argument:

```javascript
import { extractInterfacesFromFile } from 'tsx-ray';

const result = extractInterfacesFromFile('src/mytsfile.ts');

console.log(result);

/* Person: {
    name: 'string',
    isUnderage: 'boolean',
    phoneNumbers: ['string'],
    address: {
      city: ['string', 'number'],
      country: 'string',
    },
  } */
```
