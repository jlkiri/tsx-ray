import * as ts from 'typescript';

type Filename = string;

interface UnresolvedTypeReference {
  ref: InterfaceDefinition;
  name: string;
}

interface UnresolvedTypesByName {
  [key: string]: Array<UnresolvedTypeReference>;
}

interface InterfaceDefinitions {
  [key: string]: InterfaceDefinition;
}

interface InterfaceDefinition {
  [key: string]: string | InterfaceDefinition;
}

const jsStandardTypes = ['number', 'string'];

export const extractInterfaces = (filename: Filename): InterfaceDefinitions => {
  const interfaceDefs: InterfaceDefinitions = {};
  const unresolvedTypes: Set<string> = new Set();
  const typeReferences: UnresolvedTypesByName = {};

  const program = ts.createProgram([filename], {});
  const sourceFile = program.getSourceFile(filename);

  if (!sourceFile) {
    process.exit(1);
  }

  const typeChecker = program.getTypeChecker();

  const traverse = (node: ts.Node): void => {
    /* if (ts.isTypeAliasDeclaration(node)) {
      const typeAlias = typeChecker.getTypeAtLocation(node);
      console.log(typeChecker.typeToString(typeAlias));
    } */
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

        if (!jsStandardTypes.includes(nameOfType)) {
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

  for (const unresolvedType of Array.from(unresolvedTypes)) {
    if (!interfaceDefs[unresolvedType]) {
      console.warn(`No definition found for ${unresolvedType}`);
    }

    const refPropPairs = typeReferences[unresolvedType];

    for (const unresolvedPropertyRef of refPropPairs) {
      const ref = unresolvedPropertyRef.ref;
      ref[unresolvedPropertyRef.name] = interfaceDefs[unresolvedType];
    }
  }

  return interfaceDefs;
};
/* 
console.log(
  JSON.stringify(extractInterfaces('testfiles/interfaces-a.ts'), null, 2)
); */
