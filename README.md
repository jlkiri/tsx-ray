TS interface to JS object extractor

Turns this

```typescript
interface Attendee {
  id: ID;
  person: Person;
  accompaniedBy?: Person;
}

interface Person {
  name: string;
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
}
```
