interface Attendee {
  id: number;
  person: Person;
}

interface Address {
  city: string;
  country: string;
}

interface Person {
  name: string;
  address: Address;
}
