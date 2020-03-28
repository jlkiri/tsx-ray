TS interface to JS object extractor

Turns this

```typescript
interface TestInterfaceA {
  numberProp: number;
  stringProp: string;
}
```

into this

```javascript
{
  TestInterfaceA:
  {
    numberProp: 'number',
    stringProp: 'string'
  }
}
```
