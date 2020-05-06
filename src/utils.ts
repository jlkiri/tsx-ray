import { Type } from 'ts-morph';
import { PrimitiveType } from './types';

export const prettyPrint = (obj: object) => JSON.stringify(obj, null, 2);

export const merge = (obj1: object, obj2: object) => ({ ...obj1, ...obj2 });

export const removeQuotesIfLiteral = (type: Type) => {
  if (type.isStringLiteral()) {
    return type.getText().replace(/"/g, ``);
  }
  if (type.isNumberLiteral()) {
    return Number(type.getText().replace(/"/g, ``));
  }
  return type.getText();
};

export const isImport = (text: string) => {
  return text.includes('import');
};

export const getNameFromType = (type: Type) => {
  return type.getSymbol()!.getName();
};

export const convertToPrimitiveRepresentation = (
    type: Type
): PrimitiveType | boolean | string => {
  const text = type.getText();
  switch (text) {
    case 'string':
      return PrimitiveType.String;
    case 'number':
      return PrimitiveType.Number;
    case 'boolean':
      return PrimitiveType.Boolean;
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return type.getText();
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
