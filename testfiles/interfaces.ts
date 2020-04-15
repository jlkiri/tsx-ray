import { Address } from './address';

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

type ID = string;
type PhoneNumbers = string[];
