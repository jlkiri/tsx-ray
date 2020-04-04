import { Address } from './address';

interface Attendee {
  id: ID;
  person: Person;
  accompaniedBy?: Person;
}

interface Person {
  name: string;
  isUnderage: boolean;
  address: Address;
  phoneNumbers: PhoneNumbers;
}

type ID = string;
type PhoneNumbers = string[];
