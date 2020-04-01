import * as ts from 'typescript';

// eslint-disable-next-line prettier/prettier
import type {
  Filename,
  TypenameToUnresolvedRefsMap,
  TypeAliasDefinitions,
  InterfaceDefinitions,
  InterfaceDefinition,
  StandardJSTypes,
} from './types';

const standardJsTypes: StandardJSTypes = ['number', 'string', 'string[]', 'number[]'];

export const extractInterfaces = (filename: Filename): InterfaceDefinitions => {
  const interfaceDefs: InterfaceDefinitions = {};
  const typeAliasDefs: TypeAliasDefinitions = {};
  const unresolvedTypes: Set<string> = new Set();
  const typeReferences: TypenameToUnresolvedRefsMap = {};

  const program = ts.createProgram([filename], {});
  const sourceFile = program.getSourceFile(filename);

  if (!sourceFile) {
    process.exit(1);
  }

  const typeChecker = program.getTypeChecker();

  const traverse = (node: ts.Node): void => {
    if (ts.isTypeAliasDeclaration(node)) {
      const getDeclaredTypeAliasName = (node: ts.Node) => {
        const type = typeChecker.getTypeAtLocation(node);
        return typeChecker.typeToString(type);
      };

      const aliasedType = typeChecker.getTypeAtLocation(node);
      const symbol = aliasedType.getSymbol();

      if (symbol?.getName() === 'Array') {
        const typeArgs = typeChecker.getTypeArguments(
          aliasedType as ts.TypeReference
        );
        const arrayElementType = typeChecker.typeToString(typeArgs[0]);
        const declaredTypeAliasName = getDeclaredTypeAliasName(node);
        typeAliasDefs[declaredTypeAliasName] = `${arrayElementType}[]`;
      }
    }

    if (ts.isInterfaceDeclaration(node)) {
      const interfaceType = typeChecker.getTypeAtLocation(node);
      const name = interfaceType.getSymbol()!.getName();

      let props: InterfaceDefinition = (interfaceDefs[name] = {});

      for (const prop of interfaceType.getProperties()) {
        const propName = prop.getName();

        const typeOfSymbol = typeChecker.getTypeOfSymbolAtLocation(
          prop,
          prop.valueDeclaration
        );
        const nameOfType = typeChecker.typeToString(typeOfSymbol);

        props[propName] = nameOfType;

        if (!standardJsTypes.includes(nameOfType as any)) {
          unresolvedTypes.add(nameOfType);

          const unresolvedPropertyRef = {
            ref: props,
            name: propName,
          };

          if (!typeReferences[nameOfType]) {
            typeReferences[nameOfType] = [];
          }

          typeReferences[nameOfType].push(unresolvedPropertyRef);
        }
      }
    }

    node.forEachChild(child => traverse(child));
  };

  traverse(sourceFile);

  const typeDefs = { ...interfaceDefs, ...typeAliasDefs };

  for (const unresolvedType of Array.from(unresolvedTypes)) {
    if (!typeDefs[unresolvedType]) {
      console.warn(`No definition found for ${unresolvedType}`);
    }

    const unresolvedReferences = typeReferences[unresolvedType];

    for (const unresolvedPropertyRef of unresolvedReferences) {
      const ref = unresolvedPropertyRef.ref;
      ref[unresolvedPropertyRef.name] = typeDefs[unresolvedType];
    }
  }

  return interfaceDefs;
};
