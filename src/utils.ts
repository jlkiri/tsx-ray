import { Type } from 'ts-morph';
import { PrimitiveType } from './types';

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
