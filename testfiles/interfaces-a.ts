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

type ID = string[];
type Country = string;
type City = number;
