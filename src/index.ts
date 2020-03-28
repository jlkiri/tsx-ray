import * as ts from "typescript";

type Filename = string;

interface Interfaces {
  [key: string]: InterfaceProperties;
}

interface InterfaceProperties {
  [key: string]: string;
}

export const extractInterfaces = (filename: Filename): Interfaces => {
  const interfaces: Interfaces = {}

  const program = ts.createProgram([filename], {});
  const sourceFile = program.getSourceFile(filename);

  if (!sourceFile) {
    process.exit(1);
  }

  const typeChecker = program.getTypeChecker();

  const traverse = (node: ts.Node): void => {
    if (ts.isInterfaceDeclaration(node)) {
      const interfaceType = typeChecker.getTypeAtLocation(node)
      const name = interfaceType.getSymbol()!.getName()

      let props: InterfaceProperties = interfaces[name] = {}

      interfaceType.getProperties().map(prop => {
        const propName = prop.getName()
        props[propName] = typeChecker.typeToString(
          typeChecker.getTypeOfSymbolAtLocation(prop, prop.valueDeclaration)
        )
      })
    }

    node.forEachChild(child => traverse(child))
  }

  traverse(sourceFile)

  return interfaces;
}