import { Type } from 'ts-morph';
import {
  PrimitiveType,
  ParsedType,
  ObjectType,
  ArrayType,
  UnionType,
} from './types';

export const prettyPrint = (obj: object) => JSON.stringify(obj, null, 2);

export const merge = (obj1: object, obj2: object) => ({ ...obj1, ...obj2 });

export const isImport = (text: string) => {
  return text.includes('import');
};

export const getNameFromType = (type: Type) => {
  return type.getSymbol()!.getName();
};

export const convertToPrimitiveRepresentation = (type: Type): PrimitiveType => {
  const text = type.getText();
  switch (text) {
    case 'string':
      return PrimitiveType.String;
    case 'number':
      return PrimitiveType.Number;
    case 'boolean':
      return PrimitiveType.Boolean;
    default:
      return PrimitiveType.Nothing;
  }
};

export const convertToArrayRepresentation = (type: Type): [PrimitiveType] => {
  const text = type.getText();
  switch (text) {
    case 'string':
      return [PrimitiveType.String];
    case 'number':
      return [PrimitiveType.Number];
    case 'boolean':
      return [PrimitiveType.Boolean];
    default:
      return [PrimitiveType.Nothing];
  }
};

export const isString = (t: ParsedType): t is PrimitiveType.String => {
  return t === PrimitiveType.String;
};

export const isBoolean = (t: ParsedType): t is PrimitiveType.Boolean => {
  return t === PrimitiveType.Boolean;
};

export const isNumber = (t: ParsedType): t is PrimitiveType.Number => {
  return t === PrimitiveType.Number;
};

export const isObject = (t: ParsedType): t is ObjectType => {
  return typeof t === 'object' && t !== null && !Array.isArray(t);
};

export const isArray = (t: ParsedType): t is ArrayType => {
  return Array.isArray(t) && t.length === 1;
};

export const isUnion = (
  t: ParsedType
): t is UnionType<PrimitiveType, PrimitiveType> => {
  return Array.isArray(t) && t.length === 2;
};
