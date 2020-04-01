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

type ID = string;
type PhoneNumbers = string[];
type Country = string;
type City = number;
