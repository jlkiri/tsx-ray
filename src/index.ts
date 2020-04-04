import { Project, InterfaceDeclaration, Type } from 'ts-morph';
import * as ts from 'typescript';
import type {
  TypenameToUnresolvedRefsMap,
  InterfaceDefinitions,
  InterfaceDefinition,
  Filename,
} from './types';
// import { PrimitiveType } from './types';

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

const project = new Project({
  compilerOptions: {
    outDir: 'tsoutput',
    declaration: true,
    jsx: ts.JsxEmit.React,
  },
});


const convertToPrimitiveRepresentation = (type: Type): PrimitiveType => {
  const text = type.getText();
  switch (text) {
    case 'string':
      return PrimitiveType.String;
    case 'number':
      return PrimitiveType.Number;
    default:
      return PrimitiveType.Nothing
  }
}

const convertToArrayRepresentation = (type: Type): [PrimitiveType] => {
  const text = type.getText();
  switch (text) {
    case 'string':
      return [PrimitiveType.String];
    case 'number':
      return [PrimitiveType.Number];
    default:
      return [PrimitiveType.Nothing]
  }
}

const filename = 'testfiles/interfaces-a.tsx';

export const parseInterfaces = (filename: Filename): InterfaceDefinitions => {
  const sourceFile = project.addSourceFileAtPath(filename);
  const interfaces = sourceFile.getInterfaces();
  
  const parsedInterfaces: InterfaceDefinitions = {};
  const unresolvedTypes: Set<string> = new Set();
  const typeReferences: TypenameToUnresolvedRefsMap = {};

  const parseInterfaceProperties = (intf: InterfaceDeclaration) => {
    const properties: InterfaceDefinition = {};
    for (const property of intf.getProperties()) {
      const type = property.getType();
      
      if (type.isArray()) {
        const typeArgs = type.getTypeArguments();
        const arrayElementType = convertToArrayRepresentation(typeArgs[0]);
        properties[property.getName()] = arrayElementType;
      } 
  
      else if (type.isUnion()) {
        const unionTypes = type
        .getUnionTypes()
        .map(convertToPrimitiveRepresentation) as [PrimitiveType, PrimitiveType];
        properties[property.getName()] = unionTypes
      }
  
      else if (type.isInterface()) {
        const nameOfType = type.getText();
  
        unresolvedTypes.add(nameOfType);
  
        const unresolvedPropertyRef = {
          ref: properties,
          name: property.getName(),
        };
  
        if (!typeReferences[nameOfType]) {
          typeReferences[nameOfType] = [];
        }
  
        typeReferences[nameOfType].push(unresolvedPropertyRef);
      }
      
      else {
        properties[property.getName()] = convertToPrimitiveRepresentation(type);
      }
    }
    return properties;
  };

  for (const intf of interfaces) {
    parsedInterfaces[intf.getName()] = parseInterfaceProperties(intf);
  }
  
  for (const unresolvedType of Array.from(unresolvedTypes)) {
    if (!parsedInterfaces[unresolvedType]) {
      console.warn(`No definition found for ${unresolvedType}`);
    }
  
    const unresolvedReferences = typeReferences[unresolvedType];
  
    for (const unresolvedPropertyRef of unresolvedReferences) {
      const ref = unresolvedPropertyRef.ref;
      ref[unresolvedPropertyRef.name] = parsedInterfaces[unresolvedType];
    }
  }

  return parsedInterfaces;
}


console.log(JSON.stringify(parseInterfaces(filename), null, 2));

const diagnostics = project.getPreEmitDiagnostics();
// project.emitSync();
console.log(project.formatDiagnosticsWithColorAndContext(diagnostics));
