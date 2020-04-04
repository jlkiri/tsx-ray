export const prettyPrint = (obj: object) => JSON.stringify(obj, null, 2);

export const merge = (obj1: object, obj2: object) => ({ ...obj1, ...obj2 });
