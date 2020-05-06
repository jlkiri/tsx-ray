import { Type } from 'ts-morph';

export type Filepath = string;

export enum PrimitiveType {
  String = 'string',
  Boolean = 'boolean',
  Number = 'number',
  Nothing = 'nothing',
}

export enum ArrayType {
  String = 'string[]',
  Number = 'number[]',
  Boolean = 'boolean[]',
  Nothing = 'nothing',
}

export type ObjectType = Record<string, any>;

export type ParsedType = PrimitiveType | ArrayType | ObjectType;

export type UnionType<T extends PrimitiveType> = T[];

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
  | UnionType<PrimitiveType>
  | InterfaceDefinition
  | boolean
  | ReturnType<Type['getText']>;

export interface InterfaceDefinition {
  [key: string]: InterfaceProperty;
}
