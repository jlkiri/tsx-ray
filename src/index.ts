import {
  Project,
  InterfaceDeclaration,
  SourceFile,
  ImportDeclaration,
} from 'ts-morph';
import * as ts from 'typescript';
// eslint-disable-next-line
import type {
  TypenameToUnresolvedRefsMap,
  InterfaceDefinitions,
  InterfaceDefinition,
  Filepath,
} from './types';
import { PrimitiveType, ArrayType, ParsedType, UnionType, ObjectType } from './types';
import {
  merge,
  isImport,
  getNameFromType,
  convertToArrayRepresentation,
  convertToPrimitiveRepresentation,
} from './utils';

export const compileFile = (filepath: Filepath, outDir: string) => {
  const project = new Project({
    compilerOptions: {
      outDir,
      declaration: false,
      jsx: ts.JsxEmit.React,
    },
  });
  const sourceFile = project.addSourceFileAtPath(filepath);
  sourceFile.emitSync();
};

export const compileSourceSync = (sourceFile: SourceFile) =>
  sourceFile.emitSync();

export const extractInterfaces = (sourceFile: SourceFile) =>
  parseInterfacesFromSourceFile(sourceFile);

export const getDefaultImports = (sourceFile: SourceFile) => {
  return sourceFile
    .getImportDeclarations()
    .filter((imp) => imp.getDefaultImport());
};

export const extractInterfacesFromFile = (filepath: Filepath) => {
  const project = new Project({
    compilerOptions: {
      jsx: ts.JsxEmit.React,
    },
  });
  const sourceFile = project.addSourceFileAtPath(filepath);
  return parseInterfacesFromSourceFile(sourceFile);
};

const parseInterfacesFromSourceFile = (
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
      } else if (type.isBoolean()) {
        properties[property.getName()] = convertToPrimitiveRepresentation(type);
      } else if (type.isUnion()) {
        console.log(type
          .getUnionTypes().map(t=>t.getText()))
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

export { PrimitiveType, ArrayType, ObjectType, ParsedType, UnionType };
