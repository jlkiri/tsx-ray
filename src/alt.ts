import { Project, InterfaceDeclaration } from 'ts-morph';
import { JsxEmit } from 'typescript';

const project = new Project({
  compilerOptions: {
    outDir: 'tsoutput',
    declaration: true,
    jsx: JsxEmit.React,
  },
});

const sourceFile = project.addSourceFileAtPath('testfiles/interfaces-a.tsx');
const interfaces = sourceFile.getInterfaces();

const formattedInts: any = {};

const getInterfaceProperties = (intf: InterfaceDeclaration) => {
  const rawProps = intf.getProperties();
  const formattedProps: any = {};
  for (const prop of rawProps) {
    const type = prop.getType();
    formattedProps[prop.getName()] = type.getText();
  }
  return formattedProps;
};

interfaces.forEach(int => {
  formattedInts[int.getName()] = getInterfaceProperties(int);
});

console.log(formattedInts);

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
