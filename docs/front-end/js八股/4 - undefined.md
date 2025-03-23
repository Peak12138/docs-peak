# undefined

## 1. 有关于类型

```js
      console.log(undefined == null); // true
      console.log(typeof undefined); // "undefined"
      console.log(typeof null); // "object"
```



## 2. Void 0

`void` 运算符会评估其后的表达式，并总是返回 `undefined`。这意味着无论你在 `void` 后面放什么表达式，整个 `void` 表达式的值总是 `undefined`。例如：

```js
console.log(void 0); // 输出: undefined
console.log(void(1 + 2)); // 输出: undefined
console.log(void {name: "Alice"}); // 输出: undefined
```