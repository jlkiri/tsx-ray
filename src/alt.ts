import { Project, InterfaceDeclaration, Type } from 'ts-morph';
import * as ts from 'typescript';

const project = new Project({
  compilerOptions: {
    outDir: 'tsoutput',
    declaration: true,
    jsx: ts.JsxEmit.React,
  },
});

const sourceFile = project.addSourceFileAtPath('testfiles/interfaces-a.tsx');
const interfaces = sourceFile.getInterfaces();

const formattedInts: any = {};

const getInterfaceProperties = (intf: InterfaceDeclaration) => {
  const properties: any = {};
  for (const property of intf.getProperties()) {
    const type = property.getType();
    if (!type.isInterface()) {
      properties[property.getName()] = type.getText();
    } else {
      properties[property.getName()] = getInterfacePropertiesFromType(type);
    }
  }
  return properties;
};

const getInterfacePropertiesFromType = (intf: Type) => {
  const properties: any = {};
  for (const property of intf.getProperties()) {
    const type = property.getTypeAtLocation(property.getValueDeclaration()!);
    if (type.isInterface()) {
      properties[property.getName()] = getInterfacePropertiesFromType(type);
    } else {
      properties[property.getName()] = type.getText();
    }
  }
  return properties;
};

interfaces.forEach(int => {
  formattedInts[int.getName()] = getInterfaceProperties(int);
});

console.log(JSON.stringify(formattedInts, null, 2));

// Get props of interfaces that themselves are properties. Uses function from ts module?

/* interfaces.forEach(int => {
  console.log(int.getProperties().length);
  int.getProperties().forEach(prop => {
    const type = prop.getType();
    if (type.isInterface()) {
      console.log('interface!');

      type
        .getProperties()
        .forEach(p =>
          console.log(p.getTypeAtLocation(p.getValueDeclaration()!).getText())
        );
    }
  });
}); */

const diagnostics = project.getPreEmitDiagnostics();
// project.emitSync();
console.log(project.formatDiagnosticsWithColorAndContext(diagnostics));
