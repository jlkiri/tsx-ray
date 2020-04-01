TS interface to JS object extractor

Turns this

```typescript
type ID = string;
type Country = string;
type City = number;

interface Attendee {
  id: ID;
  person: Person;
}

interface Address {
  city: City;
  country: Country;
}

interface Person {
  name: string;
  address: Address;
}
```

into this

```javascript
{
  "Attendee": { 
    "person": { 
      "name": "string", 
      "address": { 
        "city": "number", 
        "country": "string" 
      } 
    } 
  }, 
  "Person": { 
    "name": "string", 
    "address": { 
      "city": "number", 
      "country": "string" 
    } 
  },
  "Address": { 
    "city": "number", 
    "country": "string" 
  }, 
}
```
