export interface Address {
  city: City | CityCode;
  country: Country;
}

type Country = string;
type City = string;
type CityCode = number;
