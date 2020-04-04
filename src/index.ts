import {
  Project,
  InterfaceDeclaration,
  Type,
  SourceFile,
  ImportDeclaration,
} from 'ts-morph';
import * as ts from 'typescript';
import {
  TypenameToUnresolvedRefsMap,
  InterfaceDefinitions,
  InterfaceDefinition,
  Filepath,
} from './types';
import { PrimitiveType } from './types';
import { merge } from './utils';

const project = new Project({
  compilerOptions: {
    outDir: 'tsoutput',
    declaration: true,
    jsx: ts.JsxEmit.React,
  },
});

const isImport = (text: string) => {
  return text.includes('import');
};

const getNameFromType = (type: Type) => {
  return type.getSymbol()!.getName();
};

const convertToPrimitiveRepresentation = (type: Type): PrimitiveType => {
  const text = type.getText();
  switch (text) {
    case 'string':
      return PrimitiveType.String;
    case 'number':
      return PrimitiveType.Number;
    default:
      return PrimitiveType.Nothing;
  }
};

const convertToArrayRepresentation = (type: Type): [PrimitiveType] => {
  const text = type.getText();
  switch (text) {
    case 'string':
      return [PrimitiveType.String];
    case 'number':
      return [PrimitiveType.Number];
    default:
      return [PrimitiveType.Nothing];
  }
};

export const extractInterfaces = (filepath: Filepath) => {
  const sourceFile = project.addSourceFileAtPath(filepath);
  return parseInterfacesFromSourceFile(sourceFile);
};

export const parseInterfacesFromSourceFile = (
  sourceFile: SourceFile
): InterfaceDefinitions => {
  const interfaces = sourceFile.getInterfaces();
  const imports = sourceFile.getImportDeclarations();

  const getParsedInterfacesFromImports = (imports: ImportDeclaration[]) => {
    if (imports.length > 0) {
      const importedSources = imports
        .map((i) => i.getModuleSpecifierSourceFile())
        .filter(Boolean) as SourceFile[];
      const importedParsedInterfaces = importedSources.map(
        parseInterfacesFromSourceFile
      );
      return importedParsedInterfaces;
    }
    return [];
  };

  const interfaceDefinitions: InterfaceDefinitions = {};
  const unresolvedTypes: Set<string> = new Set();
  const typeReferences: TypenameToUnresolvedRefsMap = {};

  const importedInterfaces = getParsedInterfacesFromImports(imports);

  const allInterfaceDefinitions =
    importedInterfaces.length > 0
      ? importedInterfaces.reduce(
          (acc, current) => merge(acc, current),
          interfaceDefinitions
        )
      : interfaceDefinitions;

  const parseInterfaceProperties = (intf: InterfaceDeclaration) => {
    const properties: InterfaceDefinition = {};
    for (const property of intf.getProperties()) {
      const type = property.getType();

      if (type.isArray()) {
        const typeArgs = type.getTypeArguments();
        const arrayElementType = convertToArrayRepresentation(typeArgs[0]);
        properties[property.getName()] = arrayElementType;
      } else if (type.isUnion()) {
        const unionTypes = type
          .getUnionTypes()
          .map(convertToPrimitiveRepresentation) as [
          PrimitiveType,
          PrimitiveType
        ];
        properties[property.getName()] = unionTypes;
      } else if (type.isInterface()) {
        const rawText = type.getText();
        const nameOfType = isImport(rawText) ? getNameFromType(type) : rawText;

        unresolvedTypes.add(nameOfType);

        const unresolvedPropertyRef = {
          ref: properties,
          name: property.getName(),
        };

        if (!typeReferences[nameOfType]) {
          typeReferences[nameOfType] = [];
        }

        typeReferences[nameOfType].push(unresolvedPropertyRef);
      } else {
        properties[property.getName()] = convertToPrimitiveRepresentation(type);
      }
    }
    return properties;
  };

  for (const intf of interfaces) {
    allInterfaceDefinitions[intf.getName()] = parseInterfaceProperties(intf);
  }

  for (const unresolvedType of Array.from(unresolvedTypes)) {
    if (!allInterfaceDefinitions[unresolvedType]) {
      console.warn(`No definition found for ${unresolvedType}`);
    }

    const unresolvedReferences = typeReferences[unresolvedType];

    for (const unresolvedPropertyRef of unresolvedReferences) {
      const ref = unresolvedPropertyRef.ref;
      ref[unresolvedPropertyRef.name] = allInterfaceDefinitions[unresolvedType];
    }
  }

  return allInterfaceDefinitions;
};
