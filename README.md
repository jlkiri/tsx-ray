TS interface to JS object extractor

Turns this

```typescript
type ID = string;
type PhoneNumbers = string[];
type Country = string;
type City = number;

interface Attendee {
  id: ID;
  person: Person;
  accompaniedBy?: Person;
}

interface Address {
  city: City;
  country: Country;
}

interface Person {
  name: string;
  address: Address;
  phoneNumbers: PhoneNumbers;
}
```

into this

```javascript
{ 
  "Attendee": { 
    "id": "string", 
    "person": { 
      "name": "string", 
      "address": { 
        "city": "number", 
        "country": "string" 
      }, 
      "phoneNumbers": "string[]" 
    }, 
    "accompaniedBy": { 
      "name": "string", 
      "address": { 
        "city": "number", 
        "country": "string" 
      }, 
      "phoneNumbers": "string[]" 
    } 
  }, 
  "Address": { 
    "city": "number", 
    "country": "string" 
  }, 
  "Person": { 
    "name": "string", 
    "address": { 
      "city": "number", 
      "country": "string" 
    }, 
    "phoneNumbers": "string[]" 
  } 
} 
```
