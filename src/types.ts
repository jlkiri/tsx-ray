export type Filename = string;
export type JSType = 'string' | 'number' | 'string[]' | 'number[]';
export type StandardJSTypes = JSType[];

export interface UnresolvedTypeReference {
  ref: InterfaceDefinition;
  name: string;
}

export interface TypenameToUnresolvedRefsMap {
  [key: string]: Array<UnresolvedTypeReference>;
}

export interface TypeAliasDefinitions {
  [key: string]: string;
}

export interface InterfaceDefinitions {
  [key: string]: InterfaceDefinition;
}

export type InterfaceProperty = string | InterfaceDefinition;

export interface InterfaceDefinition {
  [key: string]: InterfaceProperty;
}
