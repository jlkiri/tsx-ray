export type Filename = string;

export enum PrimitiveType {
  String = 'string',
  Number = 'number',
  Nothing = 'nothing',
}

export enum ArrayType {
  String = 'string[]',
  Number = 'number[]',
  Nothing = 'nothing',
}

export type UnionType<T1 extends PrimitiveType, T2 extends PrimitiveType> = [
  T1,
  T2
];

export interface UnresolvedTypeReference {
  ref: InterfaceDefinition;
  name: string;
}

export interface TypenameToUnresolvedRefsMap {
  [key: string]: Array<UnresolvedTypeReference>;
}

export interface TypeAliasDefinitions {
  [key: string]: string;
}

export interface InterfaceDefinitions {
  [key: string]: InterfaceDefinition;
}

export type InterfaceProperty =
  | PrimitiveType
  | [PrimitiveType]
  | UnionType<PrimitiveType, PrimitiveType>
  | InterfaceDefinition;

export interface InterfaceDefinition {
  [key: string]: InterfaceProperty;
}
