# ES6学习整理笔记
## let、const、var

### let

#### 特点

##### 不存在变量提升

var命令会发生“变量提升”现象，即变量可以在声明之前使用，值为undefined。这种现象多多少少是有些奇怪的，按照一般的逻辑，变量应该在声明语句之后才可以使用。
为了纠正这种现象，let命令改变了语法行为，它所声明的变量一定要在声明后使用，否则报错。

```js
// var 的情况
console.log(foo); // 输出undefined
var foo = 2;
// let 的情况
console.log(bar); 
// 报错ReferenceError
let bar = 2;
```



##### 暂时性死区

在代码块内，使用let命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”（temporal dead zone，简称 TDZ）。

```js
if (true) {
  tmp = 'abc'; // ReferenceError  
let tmp;
}
```



##### typeof 不再是百分百不会报错

```js
typeof x; // ReferenceError
let x;

typeof uuu

let x = x
```



##### 不允许重复声明

```js
// 全局的
    var x = 1;
    let x = 2;
// 报错


// 函数内部

function get(){
        var b =1;
        let b =6;
}

function get(b){
       let b 
}


```

##### 块级作用域

1. 为什么要有块级作用域?
   ES5 只有全局作用域和函数作用域，没有块级作用域，这带来很多不合理的场景

- 第一种场景，内层变量可能会覆盖外层变量。

```js
var tmp = new Date();
function f() {
console.log(tmp);
  if (false) {
    var tmp = 'hello world';
  }}
f(); // undefined
```

- 第二种场景，用来计数的循环变量泄露为全局变量

```js
var s = [1,2,3,4,5];
for (var i = 0; i < s.length; i++) {
  console.log(s[i]);
}
console.log(i); // 5

var i = 0;
for (; i < s.length;) {
  console.log(s[i]);
  i++
}

```

2. 特點：允许块级作用域的任意嵌套

- 每一层都是一个单独的作用域。每一層中的數據是不互通的

```js
{
        {
            let a = 123;
        }
        console.log(a) // 報錯
}


// 裏面的可以訪問外賣的
{
        {
            let a = 123;
            {
                console.log(a)
            }
        }
        
    }


```

3. 对比es5之前的代码块

```js
 let a = '全局';
    {
        let a = '局部'
        console.log(a);
    }
    console.log(a);

    var aa = '全局';
    (function(){
        var aa = '局部'
        console.log(aa);
        
    })()
    console.log(aa);


```



### const

#### const特殊的地方

1. const声明一个只读的常量。一旦声明，常量的值就不能改变

```js
const PI = 3.1415;
PI // 3.1415
PI = 3;

```

2. const声明的变量不得改变值，这意味着，const一旦声明变量，就必须立即初始化，不能留到以后赋值

```js
const foo;
// SyntaxError: Missing initializer in const declaration

```

上面代码表示，对于const来说，只声明不赋值，就会报错。
本质
**内存地址不变 里面的东西可以变**

```js
const foo = {};
// 为 foo 添加一个属性，可以成功foo.prop = 123;
foo.prop // 123
// 将 foo 指向另一个对象，就会报错
foo = {}; // TypeError: "foo" is read-only
```

下面是另一个例子。（使用对象冻结的方法）

```js
const a = [];
a.push('Hello'); // 可执行a.length = 0;    // 可执行
a = ['Dave'];    // 报错
// 上面代码中，常量a是一个数组，这个数组本身是可写的，但是如果将另一个数组赋值给a，就会报错。
// 如果真的想将对象冻结，应该使用Object.freeze方法。
const foo = Object.freeze({});
// 常规模式时，下面一行不起作用；// 严格模式时，该行会报错
foo.prop = 123;
'use strict';
const foo = Object.freeze({});
foo.prop = 123; // 報錯

```

上面代码中，常量foo指向一个**冻结的对象**，所以添加新属性不起作用，严格模式时还会报错。

> 案例 for循环的计数器，就很合适使用let命令。

```js
for (let i = 0; i < 10; i++) {
  // ...}

console.log(i);
// ReferenceError: i is not defined
```

上面代码中，计数器i只在for循环体内有效，在循环体外引用就会报错。
下面的代码如果使用var，最后输出的是10。

```js
var a = [];
for (var i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i);
  };}
a[6](); // 10
```

上面代码中，变量i是var命令声明的，在全局范围内都有效，所以全局只有一个变量i。每一次循环，变量i的值都会发生改变，而循环内被赋给数组a的函数内部的console.log(i)，里面的i指向的就是全局的i。也就是说，所有数组a的成员里面的i，指向的都是同一个i，导致运行时输出的是最后一轮的i的值，也就是 10。
如果使用let，声明的变量仅在块级作用域内有效，最后输出的是 6。

```js
var a = [];for (let i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i);
  };}
a[6](); // 6
```

上面代码中，变量i是let声明的，当前的i只在本轮循环有效，所以每一次循环的i其实都是一个新的变量，所以最后输出的是6。你可能会问，如果每一轮循环的变量i都是重新声明的，那它怎么知道上一轮循环的值，从而计算出本轮循环的值？这是因为 JavaScript 引擎内部会记住上一轮循环的值，初始化本轮的变量i时，就在上一轮循环的基础上进行计算。
另外，for循环还有一个特别之处，就是设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域。

```js
for (let i = 0; i < 3; i++) {
  let i = 'abc';
  console.log(i);
}
// abc// abc// abc

```

上面代码正确运行，输出了 3 次abc。这表明函数内部的变量i与循环变量i不在同一个作用域，有各自单独的作用域。（循环变量的作用域和循环体的作用域不是同一个作用域）



## 解构赋值



### 数组的解构赋值

重点放在**赋值**

#### 数组解构赋值定义

ES6 允许按照一定模式，从数组中提取值，对变量进行赋值，这被称为解构赋值
解构赋值可以方便地将一组参数与变量名对应起来。
（可以很方便的提取我们数组中的值）
入门：以前我们提取数组里面的值 只能是取到数组的每一项 然后进行赋值的操作

```js
let arr = [1,2,3]
// 获取数组的第一项
let first = arr[0]
let second = arr[1]
let third = arr[2]
console.log(first);
// ES6 允许写成下面这样。
let [a, b, c] = [1, 2, 3];
```

#### 模式匹配

只要等号两边的**模式相同**，左边的变量就会被赋予对应的值

```js
let [foo, [[bar], baz]] = [1, [[2], 3]];
foo // 1
bar // 2
baz // 3
let [ , , third] = ["foo", "bar", "baz"];
third // "baz"
let [x, , y] = [1, 2, 3];
x // 1
y // 3
let [head, ...tail] = [1, 2, 3, 4];
head // 1
tail // [2, 3, 4]
let [x, y, ...z] = ['a'];
x // "a"
y // undefined 
z // []


```

注意：如果解构不成功，变量的值就等于undefined。

```js
let [foo] = [];
let [bar, foo] = [1];
// 以上两种情况都属于解构不成功，foo的值都会等于undefined。

```

看一个实际例子：

```js
const items = [
  ['name', '张三'],
  ['title', 'Author']
];
items.forEach(
  ([key, value]) => (console.log(key,value))
  
  
item.forEach(function([key, value]){
  console.log(key,value)
})
```



 

### 对象的解构赋值

#### 定义用法注意点

##### 是什么？

对象解构赋值允许你使用对象字面量的语法将对象的属性赋给各种变量。

##### 作用：

解构赋值可以方便地将一组参数与变量名对应起来。
（可以很方便的提取我们对象中的值）



#### 特点

##### 解构不仅可以用于数组，还可以用于对象。

```js
let person = {
  name:'张三',
  age:12
}
let {name,age} = person;
console.log(name);
console.log(age);

```

**对象的解构与数组有一个重要的不同。数组的元素是按次序排列的，变量的取值由它的位置决定；而对象的属性没有次序，变量必须与属性同名，才能取到正确的值**

```js
let { bar, foo } = { foo: 'aaa', bar: 'bbb' };
foo // "aaa"
bar // "bbb"

// 注意：如果解构失败，变量的值等于undefined。
let {foo} = {bar: 'baz'};
foo // undefined
// 上面代码中，等号右边的对象没有foo属性，所以变量foo取不到值，所以等于undefined。
```

**注意对象的解构赋值的内部机制，是先找到同名属性，然后再赋给对应的变量。真正被赋值的是后者，而不是前者。**

> 这里的后者 指的是下面代码中的baz 

```js
let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
baz // "aaa"
foo // error: foo is not defined
```

**注意：与数组一样，解构也可以用于嵌套结构的对象。**

```js
let obj = {
  p: [
    'Hello',
    { y: 'World' }
  ]};
let { p: [x, { y }] } = obj;
x // "Hello"
y // "World"

```





##### 对象的解构赋值可以取到继承的属性。

```js
const obj1 = {};
const obj2 = { foo: 'bar' };
// Object.setPrototypeOf(obj1, obj2);
// obj1.__proto__ = obj2
const { foo } = obj1;
console.log(foo);

```



##### 指定默认值

**对象的解构也可以指定默认值。**

```js
var {x = 3} = {};x // 3
var {x, y = 5} = {x: 1};x // 1y // 5
var {x: y = 3} = {};y // 3
var {x: y = 3} = {x: 5};y // 5
var { message: msg = 'Something went wrong' } = {};
msg // "Something went wrong"
// 默认值生效的条件是，对象的属性值严格等于undefined。
var {x = 3} = {x: undefined};x // 3
var {x = 3} = {x: null};
x // null
// 上面代码中，属性x等于null，因为null与undefined不严格相等，所以是个有效的赋值，导致默认值3不会生效。

```

> Object.setPrototypeOf(obj1, obj2);可以绑定前者的原型为后者

模式匹配中有默认值



##### 提取json数据

```js
let jsonData = {
  id: 42,
  status: "OK",
  data: [867, 5309]
};

let { id, status, data: number } = jsonData;
console.log(id, status, number);
```





## Symbol 

### 概念以及引入原因

Symbol，表示独一无二的值。它是 JavaScript 语言的第七种数据类型，前六种是：undefined、null、布尔值（Boolean）、字符串（String）、数值（Number）、对象（Object）。

```js
let s = Symbol();
typeof s  // symbol
```

### 作用

保证每个对象属性的名字都是独一无二的，只要创建就是全局唯一

### 特性

#### 接收字符串作为参数

Symbol函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分。

```js
let s1 = Symbol('foo');
let s2 = Symbol('bar');
s1 // Symbol(foo)
s2 // Symbol(bar)


```

注意1： Symbol 的参数是一个对象，就会调用该对象的toString方法，将其转为字符串，然后才生成一个 Symbol 值。
注意2：Symbol函数的参数只是表示对当前 Symbol 值的描述，因此相同参数的Symbol函数的返回值是不相等的。

注意3:一个对象数据中的key为string类型，如果不是就会调用Object中的toString方法，转换为字符串。

```js
// 没有参数的情况let s1 = Symbol();let s2 = Symbol();
s1 === s2 // false
// 有参数的情况
let s1 = Symbol('foo');let s2 = Symbol('foo');
s1 === s2 // false

```



#### Symbol 值不能与其他类型的值进行运算，会报错。

```js
let sym = Symbol('My symbol');
"your symbol is " + sym
// TypeError: can't convert symbol to string`your symbol is ${sym}`
// TypeError: can't convert symbol to string
```



#### Symbol 值可以显式转为字符串。

```js
let sym = Symbol('My symbol');
String(sym) // 'Symbol(My symbol)'
sym.toString() // 'Symbol(My symbol)'
```



#### Symbol 值也可以转为布尔值，但是不能转为数值。

```js
let sym = Symbol();
Boolean(sym) // true
!sym  // false
Number(sym) // TypeErrorsym + 2 // TypeError
```



#### Symbol.iterator属性

对象的Symbol.iterator属性，指向该对象的默认遍历器方法。iterator本质就是一个接口
对象进行for...of循环时，会调用Symbol.iterator方法，返回该对象的默认遍历器。	



#### symbol不可枚举

```js
    let obj = {
      a: 1,
      b: 2
    }
    let c = Symbol()
    obj[c] = 3
    for (const key in obj) {
      console.log(key); // 只输出a和b 因为symbol是不可枚举的 
    }
    console.log(Object.keys(obj)); // keys方法以数组的格式返回可枚举的属性
```



#### 怎么获取对象中Symbol

Object.getOwnPropertySymbols方法
Object.getOwnPropertySymbols方法，可以获取指定对象的所有 Symbol 属性名。

```js
const obj = {};
let a = Symbol('a');
let b = Symbol('b');
obj[a] = 'Hello';
obj[b] = 'World';
const objectSymbols = Object.getOwnPropertySymbols(obj);
objectSymbols
// [Symbol(a), Symbol(b)]
```



> Object.getOwnPropertySymbols方法返回一个数组，成员是当前对象的所有用作属性名的 Symbol 值。



### 实际应用

1. 作为对象的私有属性（因为不可枚举的属性）
2. 对象中不能遍历，就使用Symbol.iterator的属性来添加遍历手段

```js
// 常量枚举 js没有枚举类型的
    const CODE_ONE = 1;
    const CODE_TWO = 2;
    // 产生一个问题 1 2 不能重复  重复的话判断就会出错
    // symbol 哪怕你写重复了也没问题
   // 私有属性
   let private = Symbol('private')
   var obj = {
    _name:'张三',
    [private]:'私有的属性',
    say:function(){
        console.log(this[private])
    }
   }

   console.log(Object.keys(obj))
```



## Set

### 性质

Set是新的引用型的数据结构 它类似于数组，但是成员的值都是唯一的，没有重复的值。



- set的成员中没有重复的

```js
const set = new Set([1, 2, 3, 4, 4]);
console.log(set); // Set(4) {1, 2, 3, 4}
```



- 属于引用数据类型

```js
let set = new Set([1,2,3,4])
let res = set instanceof Set
let resSet = Object.prototype.toString.call(set)
console.log(res); // true
console.log(resSet); // [object Set]
```

> 可以看出set为引用数据类型，并且构造函数为Set()



- 和数组之间进行数据转化

  - Array.from(set)

  - 扩展运算符

```js
    let set = new Set([1,2,4])
    set.add(3)
    console.log(Array.from(set));//(3) [1, 2, 4]
     console.log([...set]);// [1 2 4]
```



- Set内部判断成员是否唯一的机制

类似于严格相等“===”

```js
    let set = new Set([1,2,4])
    set.add(5).add('5')
    console.log(set);
    console.log(Array.from(set));
```



- 对于引用数据类型比较的是地址

```js
    let set = new Set([1,2,4])
    set.add({}).add({})
    console.log(set);
```

> 虽然添加的两次对象值是一样的，但是对于地址是不同的

![截屏2024-04-18 19.38.08](https://peak-1316803036.cos.ap-beijing.myqcloud.com/%E6%88%AA%E5%B1%8F2024-04-18%2019.38.08.png)

### Set中的方法

- size()

返回`Set`实例的成员总数。

```js
let set = new Set();
s.add(1).add(2).add(2);
// 注意2被加入了两次
s.size // 2
```



- add()

添加某个值，返回 Set 结构本身。

```js
    let set = new Set([1,2,4])
    set.add(3)
    console.log(set); // Set(4) {1, 2, 4, 3}
```

- delete()

删除某个值，返回一个布尔值，表示删除是否成功。

```js
    let set = new Set([1,2,4])
    set.add(3)
    console.log(set.delete(3)); // true
		console.log(set.delete(5)); // false
    console.log(set); // Set(3) {1, 2, 4}
```

- has()

返回一个布尔值，表示该值是否为`Set`的成员。

```js
    let set = new Set([1,2,4])
    set.add(3)
    console.log(set.has(3)); // true
    console.log(set.has(5)); // false
```

- clear()

清除所有成员，没有返回值。

```js
    let set = new Set([1,2,4])
    set.add(3)
    set.clear()
    console.log(set); // Set(0) {size: 0}
```





### set的应用

#### 遍历

- forEach
- for...of输出的是值

```js
    let set = new Set([1, 2, 4])
    set.forEach((key, value) => {
      console.log(key + '-----' + value);
    })
    for(x of set){
      console.log(x);
    }
```



#### 数组去重

- 数组去重

```js
    let arr = [1,2,2,3,4]
    console.log([...new Set(arr)]); // (4) [1, 2, 3, 4]
```

- 字符串去重

```js
    console.log([...new Set('ssss223344')].join('')); // s234
```



#### 求集合

根据set特殊的性质，可以求并集、交集、差集

- 并集

```js
    let arr1 = [1, 2, 3]
    let arr2 = [4, 3, 2]
    let a = new Set(arr1);
    let b = new Set(arr2);
    // 并集
    let union = new Set([...a, ...b]); // Set {1, 2, 3, 4}
```



- 交集

```js
    let arr1 = [1, 2, 3]
    let arr2 = [4, 3, 2]
    let a = new Set(arr1);
    let b = new Set(arr2);
    // 交集
    let intersect = new Set([...a].filter(x => b.has(x)));// set {2, 3}

```



- 差集

```js
    let arr1 = [1, 2, 3]
    let arr2 = [4, 3, 2]
    let a = new Set(arr1);
    let b = new Set(arr2);
    // 差集
    let difference = new Set([...a].filter(x => !b.has(x)));// Set {1}
```

> filter()创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。



## Map

ES6 提供的另一种新的引用类型的数据结构 它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键）

Object 结构提供了“字符串—值”的对应，
Map 结构提供了“值—值”的对应，是一种更完善的 “键值对” 结构实现。

在对象的声明中如果键为一个对象，会隐性的调用一个toString（）方法，将键的数据类型转变为字符串类型

### 性质

- “键值对”的数据结构，其中键可以为任意类型的值（包括变量）

```js
    let map = new Map()
    let x = [1,2,3]
    map.set(x,'arr')
    console.log(map);
```

![截屏2024-04-18 21.06.51](https://peak-1316803036.cos.ap-beijing.myqcloud.com/%E6%88%AA%E5%B1%8F2024-04-18%2021.06.51.png)



- 是引用类型数据

```js
let map = new Map()
let res = map instanceof Map
let resMap = Object.prototype.toString.call(map)
console.log(res); // true
console.log(resMap); // [object Map]
```

为什么要调用Object原型上的toString方法，不调用数组或者是对象上的toString方法？

因为在数组实例 或者 对象实例上的toString **可能**会被改写



- 接收数组（表示键值对的数组）作为参数

```js
    let obj = {name:'name'}
    const map = new Map([
      ['name', '张三'],
      [{name:'name'}, 'Author'],
      [obj,'Author']
    ]);
    map.get('name') // "张三"
    map.get({name:'name'}) // "undefined"
    map.get(obj) // Author
```

如果其中有一个键为对象，那么就无法通过get(对象名)的方法进行访问 



- 传址特点--对象作为键名，传输的是地址，所以下例中的两个{x:1}虽然长相一样，但实际值不同（存储在堆内存的两个位置）

```js
let m = new Map([
    [123,'abc'],
    [{x:1},'cdf'],]);
console.log(m.get({x:1}));-->undefined
// 可以修改成下面形式
let obj = {x:1};
let m = new Map([
    [123,'abc'],
    [obj,'cdf'],]);
console.log(m.get(obj));-->cdf


```



- Map构造函数接受数组作为参数的本质

```js
    let items = [
      ['name','赵高'],
      ['nickname','高要']
    ]
    let map = new Map()
    items.forEach(([key,value],index) => {
      map.set(key,value)
    });
    console.log(map);
```









### Map中的方法

#### 实例上的方法

- size 属性

`size`属性返回 Map 结构的成员总数。

```javascript
const map = new Map();
map.set('foo', true);
map.set('bar', false);

map.size // 2
```



- Map.prototype.set(key, value)

`set`方法设置键名`key`对应的键值为`value`，然后返回整个 Map 结构。如果`key`已经有值，则键值会被更新，否则就新生成该键。

```javascript
const m = new Map();

m.set('edition', 6)        // 键是字符串
m.set(262, 'standard')     // 键是数值
m.set(undefined, 'nah')    // 键是 undefined
```

`set`方法返回的是当前的`Map`对象，因此也可以采用链式写法。

```javascript
let map = new Map()
  .set(1, 'a')
  .set(2, 'b')
  .set(3, 'c');
```



- Map.prototype.get(key)

`get`方法读取`key`对应的键值，如果找不到`key`，返回`undefined`。

```javascript
const m = new Map();

const hello = function() {console.log('hello');};
m.set(hello, 'Hello ES6!') // 键是函数

m.get(hello)  // Hello ES6!
```



- Map.prototype.has(key)

`has`方法返回一个布尔值，表示某个键是否在当前 Map 对象之中。

```javascript
const m = new Map();

m.set('edition', 6);
m.set(262, 'standard');
m.set(undefined, 'nah');

m.has('edition')     // true
m.has('years')       // false
m.has(262)           // true
m.has(undefined)     // true
```



- Map.prototype.delete(key)

`delete()`方法删除某个键，返回`true`。如果删除失败，返回`false`。

```javascript
const m = new Map();
m.set(undefined, 'nah');
m.has(undefined)     // true

m.delete(undefined)
m.has(undefined)       // false
```



- Map.prototype.clear()

`clear()`方法清除所有成员，没有返回值。

```javascript
let map = new Map();
map.set('foo', true);
map.set('bar', false);

map.size // 2
map.clear()
map.size // 0
```



#### 遍历方法

- `Map.prototype.keys()`：返回键名的遍历器。
- `Map.prototype.values()`：返回键值的遍历器。
- `Map.prototype.entries()`：返回所有成员的遍历器。
- `Map.prototype.forEach()`：遍历 Map 的所有成员。

```js
//2.创建一个Map(可以区分两个对象obj_2,obj_1)
const map =new Map([
    ['name','张三'],
    ['age',18],
    ['sex','男'],
    [obj_1,'天空'],
    [obj_2,'大海']
]);
console.log(map);
console.log(map.size);
map.set('pet',['哈士奇','阿拉斯加']);
console.log(map);
console.log(map.get('pet'));
console.log(map.get(obj_2));
console.log(map.delete(obj_2));
console.log(map.keys());
console.log(map.values());
// 对键值对的遍历
console.log(map.entries());
let res = map.entries()
for(i of res){
    console.log(i)
}
//3.遍历
map.forEach(function(value,index){
    console.log(index+':'+value);
})
```



## Iterator 和 for...of 循环

### iterator 概念

ES6 添加了Map和Set。这样就有了四种数据集合需要一种统一的接口机制，来处理所有不同的数据结构遍历器（Iterator）就是这样一种机制。**它是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。**

### iterator的作用

**Iterator 接口的目的，就是为所有数据结构，提供了一种统一的访问机制，即for...of循环**（详见下文）。当使用for...of循环遍历某种数据结构时，该循环会自动去寻找 Iterator 接口。
for... of循环的遍历过程

1. 创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。
2. 第一次调用指针对象的next方法，可以将指针指向数据结构的第一个成员。
3. 第二次调用指针对象的next方法，指针就指向数据结构的第二个成员。
4. 不断调用指针对象的next方法，直到它指向数据结构的结束位置。
   每一次调用next方法返回一个包含value和done两个属性的对象。
   其中，value属性是当前成员的值，done属性是一个布尔值，表示遍历是否结束。
   下面是一个模拟next方法返回值的例子。

```js
var it = makeIterator(['a', 'b']);
it.next() // { value: "a", done: false }
it.next() // { value: "b", done: false }
it.next() // { value: undefined, done: true }
function makeIterator(array) {
  var nextIndex = 0;
  return {
    next: function() {
      return nextIndex < array.length ?
        {value: array[nextIndex++], done: false} :
        {value: undefined, done: true};
    }
  };}
```

> Iterator 接口部署在数据结构的Symbol.iterator属性(重中之中)
> 换句话说就是一个数据结构只要具有Symbol.iterator属性，就可以认为是“可遍历的”,也就是可以使用for..of进行遍历的（重中之中不好理解多讲一遍）

> 理解：（重点）
> Symbol.iterator属性本身是一个函数，就是当前数据结构默认的遍历器生成函数。执行这个函数，就会返回一个遍历器对象（该对象的根本特征就是具有next方法。每次调用next方法，都会返回一个代表当前成员的信息对象，具有value和done两个属性。）。至于属性名Symbol.iterator，它是一个表达式，返回Symbol对象的iterator属性
> （对象的Symbol.iterator属性，指向该对象的默认遍历器方法。）
> 根据上面的描述代码如下：

```js
const obj = {
  [Symbol.iterator] : function () {
    return {
      next: function () {
        return {
          value: 1,
          done: true
        };
      }
    };
  }};


```

### 原生具备iterator接口

ES6 的有些数据结构原生具备 Iterator 接口（比如数组），即不用任何处理，就可以被for...of循环遍历。原因在于，这些数据结构原生部署了Symbol.iterator属性，另外一些数据结构没有（比如对象）。凡是部署了Symbol.iterator属性的数据结构，就称为部署了遍历器接口。调用这个接口，就会返回一个遍历器对象。
原生具备 Iterator 接口的数据结构如下。

- Array
- Map
- Set
- String
- 函数的 arguments 对象
  arguments对象理解
  arguments对象不是一个 Array 。它类似于Array，但除了长度之外没有任何Array属性。例如，它没有 pop 方法。
  但是它可以被转换为一个真正的Array：from

```js
var args = Array.prototype.slice.call(arguments);
var args = [].slice.call(arguments);
// ES2015
const args = Array.from(arguments);
const args = [...argunments]
function get(a,b,c){
    console.log(arguments);
    console.log(Array.from(arguments)); // [1,2,3] 实参
    return a+b+c
}

get(1,2,3)

// s例如数组的Symbol.iterator属性。
let arr = ['a', 'b', 'c'];
let iter = arr[Symbol.iterator]();
iter.next() // { value: 'a', done: false }
iter.next() // { value: 'b', done: false }
iter.next() // { value: 'c', done: false }
iter.next() // { value: undefined, done: true }


```

> 对于原生部署 Iterator 接口的数据结构，不用自己写遍历器生成函数，for...of循环会自动遍历它们。
> 除此之外，其他数据结构（主要是对象）的 Iterator 接口，都需要自己在Symbol.iterator属性上面部署，这样才会被for...of循环遍历。
> 对象不具备Iterator 接口
> 原因：对象（Object）之所以没有默认部署 Iterator 接口，是因为对象的哪个属性先遍历，哪个属性后遍历是不确定的，需要开发者手动指定。
> 如果对象想具备Iterator 接口需要自己在Symbol.iterator属性上面部署，这样才会被for...of循环遍历。

如下例子

```js
let obj = {
  data: [ 'hello', 'world' ],// 声明一个[Symbol.iterator]
  [Symbol.iterator]() {
    const self = this;
    let index = 0;
    return {
      next() {
        if (index < self.data.length) {
          return {
            value: self.data[index++],
            done: false
          };
        } else {
          return { value: undefined, done: true };
        }
      }
    };
  }
};
for (var i of obj){
    console.log(i);
    
}

```





## 箭头函数&方法扩展

### 写法

```js
// 传统函数的声明
function fn () {}
var fn = function () {}

// 箭头函数
var fn = () => {}

// 如果函数内有返回值
var fn = v => v + 1
// 返回值如果不是表达式
var fn = v => ({ obj: v })
```



#### 箭头函数和普通函数的区别

this指向的问题
箭头函数本身是没有this的，他的this是从他作用域链的上一层继承来的，**并且无法通过call和apply改变this指向**

箭头函数的this为箭头函数定义位置的所在的作用域

this不是在调用的位置，而是定义的位置

```js
// 第一题
var fn = function () {
  return () => { console.log(this.name) }
}
var obj1 = {
  name: '张三'
}
var obj2 = {
  name: '李四'
}
var name = '王五'
obj1.fn = fn
obj2.fn = fn
obj1.fn()() // 张三
obj2.fn()() // 李四
fn()() // 王五

// 第二题
    var user = {
      name: '张三',
      fn: function () {
        var obj = {
          name: '李四'
        }
        var f = () => this.name
        return f.call(obj)
      }
    }
    console.log(user.fn()); // 张三
```

2. 不能作为构造函数 没有prototype属性

```js
    let fn = () => {

    }
    let Fn = function(){

    }
    console.log(fn.prototype);
    console.log(new fn());
```

![截屏2024-04-19 00.52.11](https://peak-1316803036.cos.ap-beijing.myqcloud.com/%E6%88%AA%E5%B1%8F2024-04-19%2000.52.11.png)



3. 没有arguments对象

```js
    let fn = () => {
      console.log(arguments);
    }
    fn(a=3,b=2)
```

![截屏2024-04-19 00.54.37](https://peak-1316803036.cos.ap-beijing.myqcloud.com/%E6%88%AA%E5%B1%8F2024-04-19%2000.54.37.png)

但是可以这样改写

    let fn = (...arguments) => {
      console.log(arguments);
    }
    fn(a=3,b=2)



4. 不能使用yield命令，因此箭头函数不能用作 Generator 函数(Generator被asyc和awiat替代)

```js
// 普通函数定义Generator
    function * Fn () {
      yield '1';
      yield '2';
      return 'ending'
    }
    let F = Fn()
    console.log(F.next());
    console.log(F.next());
    console.log(F.next());
```

![截屏2024-04-19 01.04.25](https://peak-1316803036.cos.ap-beijing.myqcloud.com/%E6%88%AA%E5%B1%8F2024-04-19%2001.04.25.png)

```js
// 箭头函数定义Generator
    let fn = () => {
      yield '1';
      yield '2';
      return 'ending'
    }
```

![截屏2024-04-19 01.03.42](https://peak-1316803036.cos.ap-beijing.myqcloud.com/%E6%88%AA%E5%B1%8F2024-04-19%2001.03.42.png)

#### 箭头函数的实际运用

#### 箭头函数相关面试题

```js
var name = 'window'
var obj = {
  name: 'obj',
  methods: () => {
    console.log(this.name)
  },
  fn: function (cb) {
    cb()
  }
}
obj.fn1 = function () {
  obj.fn(() => { console.log(this.name) })
}
var fn1 = obj.fn1
obj.methods()
obj.fn(() => { console.log(this.name) })
fn1()
obj.fn1()
```

#### 函数新扩展的方法

1. 给函数的参数指定默认值

```js
// 使用短路运算来给默认值
function fn (x, y) {
  y = y || 1
  console.log('合计：'x + y)
}
// 与解构赋值默认值配合使用
function fn1 ({x, y = 1}) {
  console.log('合计：'x + y)
}
fn1({x: 1})
```

看一道习题

```js
function m1({x = 0, y = 0} = {}) {
  return [x, y];
}
function m2({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}
console.log(m1())
console.log(m2())
console.log(m1({x: 3}))
console.log(m2({x: 3}))
```

2. 通过rest参数获取函数的多余参数

```js
function fn (x, ...y) {
  console.log(x)
  console.log(y)
}
fn(1, 2, 3, 4)
```





## Promise

Promise 是异步编程的一种解决方案

```js
const promise = new Promise(function(resolve, reject) {
  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
})
```

> 其中，我们也可以通过then()方法获取reject的结果

```js
.then(()=>{},()=>{clg(err)})
```

Promise的三种状态
待定（pending）: 初始状态，既没有被兑现，也没有被拒绝。
已兑现（fulfilled）: 意味着操作成功完成。
已拒绝（rejected）: 意味着操作失败。



### 特点

**Promise的状态一旦状态改变，就不会再变**

```js
// 思考这里的打印结果
new Promise((resolve, reject) => {
  reject('bad code')
  resolve('hello world')
}).then(val => {
  console.log(val)
}).catch(err => {
  console.log(err)
})
```



思考题：在不使用Promise的情况下，如果实现一个计数器将输入的2个数字相加，在间隔1s后，将所得结果再进行下一次计算

1. 使用回调函数（多次运算出现回调地狱）

```js
    // 在不使用Promise的情况下，如果实现一个计数器将输入的2个数字相加，在间隔1s后，将所得结果再进行下一次计算
    function counter(x, y, wait, cb) {
      cb(x + y)
    }
    counter(1, 2, 1000, function (num) {
      console.log(num);
      counter(num, 1, 1000, function (num) {
        console.log(num);
      })
    })
```

首先在counter中的定时起setimeout是异步任务，并且属于宏任务（优先级：微>宏），可以通过Promise创建一种异步解决方案

2. 使用Promise构造函数

```js
    // 使用Promise
    function counter(x, y, wait) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          resolve(x + y)
        }, wait)
      })
    }
    counter(1, 2, 1000).then(
      value => {
        console.log(value)
        return counter(value, 1, 1000) // 返回一个新的Promise对象 并传入新的值
      }
    ).then(
      value => {
        console.log(value);
      }
    )
```

> 大大改变了回调函数写法上的不便利性



### Promise相关的方法

##### Promise.resolve()

Promise.resolve()方法会返回一个状态为fulfilled的promise对象。

```js
Promise.resolve(2).then((val) => {
  console.log(val)
})
```

##### Promise.reject()

Promise.reject()方法返回一个带有拒绝原因的Promise对象。

```js
Promise.reject({ message: '接口返回错误' }).catch((err) => {
  console.log(err)
})
```

##### Promise.all()

Promise.all() 方法接收一个promise的iterable类型（注：Array，Map，Set都属于ES6的iterable类型）,返回一个promise实例。

```js
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
  setTimeout(() => { 
    resolve('hello')
  }, 1000);
});
const promise4 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('world')
  }, 2000);
});

Promise.all([promise1, promise2, promise3, promise4]).then((values) => {
  console.log(values);
});
```



### 手写Promise

想要进行手写Promise，首先需要知道**promise 的基本特性及用法**

- promise 有三种状态，pending等待、fulfilled 完成、rejected 失败

- pending 可以转为 fulfilled，也可转为 rejected，一旦状态转变了，状态不可再更改

- resolve 为成功，状态由 pending 转为 fulfilled，并且接收参数 value

- reject 为失败，状态由 pending 转为 rejected，并且接收参数 reason

- then 方法接收两个参数分别为 onFulfilled 和 onRejected，当 pending => fulfilled 后执行 onFulFilled，当 pending => rejected 后执行 onRejected

- 支持链式调用，可以在创建promise后通过.then一直触发

- 静态方法的实现，比如Promise.resolve()和Promise.reject()，Promise.all()方法

**实现一个最基本的 promise案例**，**这个是我们代码完成后要实现的效果**

```js
let p = new Promise((resolve, reject) => {
  resolve('success')
  // reject('error')
})
p.then(data => {
  console.log(data)
})
```

#### 1.1 需要创建一个类，并且添加一个回调方法 executor，作为Promise 的参数

```js
class MPromise {
 constructor(executor) {
    // 回调函数
    executor()
  }
}
```

#### 1.2 executor接收resolve 和 reject 作为参数

```js
class MPromise {
 constructor(executor) {
     //成功的参数
    this.value = undefined
     //失败的参数
    this.reason = undefined
     
    const resolve = (value) => {
      this.value = value
    }
    const reject = (reason) => {
      this.reason = reason
    }
    executor(resolve, reject)
  }
}
```

#### 1.3 定义promise的三种状态，实现then方法

```js
class MPromise {
 constructor(executor) {
    //成功的参数
    this.value = undefined
    //失败的参数
    this.reason = undefined
    // 定义promise的状态
    this.state = 'pending'
    
    const resolve = (value) => {
      if (this.state === 'pending') {
        // 状态修改为成功
        this.state = 'fulfilled'
        this.value = value
      }
      
    }
    const reject = (reason) => {
      // 状态修改为失败
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.reason = reason
      }
    }
    executor(resolve, reject)
  }
  // 实现 then 方法
  then(onFulfilled, onRejected) {
    if (this.state === 'fulfilled') {
      // 接收成功传来的数据
      onFulfilled(this.value)
    }
    if (this.state === 'rejected') {
      // 接收失败传来的数据
      onRejected(this.reason)
    }
  }
}
```

执行案列

```js
const p = new MPromise((resolve, reject) => {
  resolve('success')
})
console.log(p)
p.then((val) => {
  console.log(val, 'val')
})
```

很显然 上面的案例是一个同步操作，我们来看下第二个案例

```js
const p = new MPromise((resolve, reject) => {
  // 添加定时器
  setTimeout(() => {
      resolve('success')
  }, 1000)
})
console.log(p, 'p')
p.then((val) => {
  // 无法触发
  console.log(val, 'val')
})
```

##### 原因：

因为到目前为止，实现的 promise 都是同步的，当我们执行 executor 时先把同步操作执行完成，发现有一个异步操作 settimeout，先让他去排队了(这里需要了解一下事件循环机制)，然后立刻去同步执行了 then 方法。

##### 解决思路：

既然 then 自己无法知道 resolve 什么时候执行，是否执行了，那resolve执行完后就需要有个东西告诉then，执行完了。

```js
class MPromise {
 constructor(executor) {
    //成功的参数
    this.value = undefined
    //失败的参数
    this.reason = undefined
    // 定义promise的状态
    this.state = 'pending'
    // 定义数组，存放稍后要完成的任务
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []

    const resolve = (value) => {
      if (this.state === 'pending') {
        // 状态修改为成功
        this.state = 'fulfilled'
        this.value = value
        /* 成功了，在这个例子中，相当于过了 1秒了开始执行resolve了，
        状态改变后，把我们预约好的任务拿出来依次执行 */
        this.onResolvedCallbacks.forEach(fn => fn())
      }
      
    }
    const reject = (reason) => {
      // 状态修改为失败
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.reason = reason
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }
    executor(resolve, reject)
  }
  // 实现 then 方法
  then(onFulfilled, onRejected) {
    if (this.state === 'fulfilled') {
      // 接收成功传来的数据
      onFulfilled(this.value)
    }
    if (this.state === 'rejected') {
      // 接收失败传来的数据
      onRejected(this.reason)
    }
    if(this.state === 'pending') {
      /* 因为异步导致 state 还在 pending 状态 
      所以把 要做的任务先放到预约的数组队列里
      */
      this.onResolvedCallbacks.push(() => {
        onFulfilled(this.value)
      })
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason)
      })
    }
  }
}
```

#### 2.1 链式调用

链式调用的本质是需要调用then方法后返回一个promise对象

```js
let p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('延迟1秒')
  }, 1000)
})
p.then(data => {
  let str = data + '我再第一个 then 里！'
  console.log(str)
  return str
}).then(data => {
  let str = data + '我在第二个 then 里！'
  console.log(str)
})
```

代码实现

```js
class MPromise {
 constructor(executor) {
    //成功的参数
    this.value = undefined
    //失败的参数
    this.reason = undefined
    // 定义promise的状态
    this.state = 'pending'
    // 定义数组，存放稍后要完成的任务
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []

    const resolve = (value) => {
      if (this.state === 'pending') {
        // 状态修改为成功
        this.state = 'fulfilled'
        this.value = value
        /* 成功了，在这个例子中，相当于过了 1秒了开始执行resolve了，
        状态改变后，把我们预约好的任务拿出来依次执行 */
        this.onResolvedCallbacks.forEach(fn => fn())
      }
      
    }
    const reject = (reason) => {
      // 状态修改为失败
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.reason = reason
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }
    executor(resolve, reject)
  }
  // 实现 then 方法
  then(onFulfilled, onRejected) {
    return new MPromise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        // 接收成功传来的数据
        resolve(onFulfilled(this.value))
      }
      if (this.state === 'rejected') {
        // 接收失败传来的数据
        reject(onRejected(this.reason))
      }
      if(this.state === 'pending') {
        /* 因为异步导致 state 还在 pending 状态 
        所以把 要做的任务先放到预约的数组队列里
        */
        this.onResolvedCallbacks.push(() => {
          resolve(onFulfilled(this.value))
        })
        this.onRejectedCallbacks.push(() => {
          reject(onRejected(this.reason))
        })
      }
    })
  }
}
```

#### 2.2 添加静态方法

```js
class MPromise {
 constructor(executor) {
    //成功的参数
    this.value = undefined
    //失败的参数
    this.reason = undefined
    // 定义promise的状态
    this.state = 'pending'
    // 定义数组，存放稍后要完成的任务
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []

    const resolve = (value) => {
      if (this.state === 'pending') {
        // 状态修改为成功
        this.state = 'fulfilled'
        this.value = value
        /* 成功了，在这个例子中，相当于过了 1秒了开始执行resolve了，
        状态改变后，把我们预约好的任务拿出来依次执行 */
        this.onResolvedCallbacks.forEach(fn => fn())
      }
      
    }
    const reject = (reason) => {
      // 状态修改为失败
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.reason = reason
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }
    executor(resolve, reject)
  }
  // 实现 then 方法
  then(onFulfilled, onRejected) {
    return new MPromise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        // 接收成功传来的数据
        resolve(onFulfilled(this.value))
      }
      if (this.state === 'rejected') {
          // 接收失败传来的数据
          try {
              if (!onRejected) {
                  reject(onFulfilled(this.reason))
              } else {
                  reject(onRejected(this.reason))
              }
          } catch (err) {
              console.log(err)
          }
      }
      if(this.state === 'pending') {
        /* 因为异步导致 state 还在 pending 状态 
        所以把 要做的任务先放到预约的数组队列里
        */
        this.onResolvedCallbacks.push(() => {
          resolve(onFulfilled(this.value))
        })
        this.onRejectedCallbacks.push(() => {
          reject(onRejected(this.reason))
        })
      }
    })
  }
  static resolve(value) {
    return new MPromise(resolve => resolve(value))
  }
  static reject(reason) {
    return new MPromise((resolve, reject) => reject(reason))
  }
  static all(promises) {
    return new MPromise((resolve, reject) => {
      // 存储promise的结果
      const results = []
      let count = 0
      promises.forEach((promise, index) => {
        // 获取到每个promise然后执行
        promise.then(value => {
          results[index] = value
          count++
          if (count === promises.length) {
            resolve(results)
          }
        })
      })
    })
  }
}
```







### 面试题：

#### 请输入下面的执行结果

```js
function fn () {
  return new Promise((resolve) => {
    console.log('Promise1')
    fn1()
    setTimeout(() => {
      console.log('Promise2')
      resolve()
      console.log('Promise3')
    }, 0);
  })
}
async function fn1() {
  var p = Promise.resolve().then(() => {
    console.log('Promise6')
  })
  await p.then(() => {
    console.log('Promise7')
  })
  console.log('end')
}
console.log('script')
setTimeout(() => {
  console.log('setTimeout')
}, 0)
fn().then(() => {
  console.log('Promise4')
})
```



#### 谈谈你对Promise的理解

1. promise做为一个构造函数，他可以生成具有特定状态的实例，这些状态包括pending(等待)，resolved(成功)，和rejected(失败),这种状态管理机制，使得异步操作的结果变得可预测和可控，。
2. promise即承诺，后续肯定要兑现，一旦兑现就不可更改，所以promise的状态只可更改一次，
3. promise是对回调函数的一种封装，他改进了异步编程的方式，传统的异步编程往往依赖于回调函数，然而回调函数的嵌套过深，很容易导致代码结构的混乱，形成所谓的回调地狱问题，而promise则允许我们以同步的方式，表达异步操作，从而可以简化代码臃肿，以及可读性差的问题。
4. promise示例可以视为一个状态的展示器，我们可以利用promise来管理具有状态改变的业务逻辑，结合async，await，进一步提升程序的清晰度和便捷性
5. promise在前端技术体系中，有这广泛的应用比如Axios,fetchAPI等等，都采用了promise对象来处理异步操作,因此熟练掌握并合理使用promise是前端开发者必备的技能。
6. 当项目中存在着多个异步操作，并且这些操作之间存在着相互依赖的关系时，promise可以通过链式调用的方式，来处理这些操作，使得代码更加**简洁和易读**比如说在用户登录后我们需要根据用户信息去加载对应的数据，这时我们可以使用promise的链式调用，确保这些操作按照**预期的顺序执行**，从而实现业务的连贯性和流畅性
7. 尽管promise解决了很多问题，但我们也不能滥用它，例如使用promise.all时，一个失败就会全军覆没，这可能会导致一些非关键性数据加载失败，影响到整个流程的执行，因此在实际使用中我们通常只在，需要确保所有步骤都成功完成后再进行后续操作的场景下使用promise.all,如图片的预加载功能，还有别嵌套太多。



## async&&await



### async函数

async的出现让我们可以用一种更简洁的方式写出基于Promise的异步行为

```js
function p () {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('异步结果')
    }, 1000)
  })
}
```

async函数的返回值为一个promise，通过then和catch来捕获内部的返回值

```js
async function fn () {
  return 'hello world' 
}
```

>  “async” 这个单词表达了一个简单的事情：即这个函数总是返回一个 promise。其他值将自动被包装在一个 resolved 的 promise 中。



### await关键字

关键字 await 让 JavaScript 引擎等待直到 promise 完成（settle）并返回结果。





### 特性

1. async函数内部会返回一个promise对象，如果看起来不是promise，那么它将会隐式的包装在promise中
2. await能获取到promise状态改变后的值，如果后面不是一个promise，await 会把该值转换为已正常处理的Promise
3. await后面promise的状态是reject，则await后的代码不会执行，async函数将返回状态为reject的promise
4. async函数内部如果存在await，await表达式会暂停整个async函数的执行，等当前位置promise状态改变后才能恢复



### 面试题

```js
async function fn () {
  setTimeout(function () {
    console.log(1)
  }, 0)
  Promise.resolve().then(() => console.log(4))
  await setTimeout(function () {
    console.log(5)
  }, 0)
  await Promise.resolve().then(() => console.log(6))
  Promise.resolve().then(() => console.log(7))
  console.log(3)
}
fn()
```







## Proxy

### Proxy是什么？

Proxy 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（**如属性查找、赋值、枚举、函数调用等**）。属于“元编程”，即对编程语言进行编程。



### 基本语法

```js
// 创建对象的代理
const p = new Proxy(target, handler)
// 创建一个可撤销的代理对象
const { proxy: p, revoke } = Proxy.revocable(data, handler)
```

![截屏2024-04-19 16.29.39](https://peak-1316803036.cos.ap-beijing.myqcloud.com/%E6%88%AA%E5%B1%8F2024-04-19%2016.29.39.png)

> 带方括号的属性是不能够枚举的属性，参考`Symbol`

- target: 要使用 Proxy 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理)。

- handler: 一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 p 的行为。handler里面的函数在触发的时候指向的handler 
- isRevaked:表示代理是否被撤销

```js
handler.get()
// 方法用于拦截对象的读取属性操作。
var p = new Proxy(target, {
  get (target, property, receiver) {
  }
  // target：目标对象
  // property：返回被获取的属性名
  // receiver：Proxy或者继承了Proxy的对象
})
```

该方法会拦截目标对象的以下操作

1. 访问属性：proxy[foo] 和 proxy.bar
2. 访问原型链上的属性：Object.create(proxy)[foo]
3. Reflect.get()

```js
handler.set()
// handler.set() 方法是设置属性值操作的捕获器。
const p = new Proxy(target, {
  set: function(target, property, value, receiver) {
  }
});
```

该方法会拦截目标对象的以下操作

1. 指定属性值：proxy[foo] = bar 和 proxy.foo = bar
2. 指定继承者的属性值：Object.create(proxy)[foo] = bar
3. Reflect.set()

其他的方法：[文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)



### 利用proxy实现的功能

1. 验证对象的传值

```js
// 需要实现的功能
// 1. 验证age属性的数据类型是否为整数
// 2. 验证值的范围是否小于等于200
```

2. 通过属性查找数组中的特定对象

```js
var data = [
  { name: 'Firefox'    , type: 'browser' },
  { name: 'SeaMonkey'  , type: 'browser' },
  { name: 'Thunderbird', type: 'mailer' }
]
// 需要实现的功能
// 1. 通过索引返回对应数据 proxy[0]
// 2. 通过number属性返回数组长度 proxy.number
// 3. 通过name获取对应的数据 proxy['Firefox']
// 4. 通过type返回对应的数据 proxy['browser']
// 5. 通过types返回data中的type products.types
```



handler中的函数触发之后，this指向hadler







## Class

### class的基本语法

class可以理解为是一个语法糖，将js只能通过构造函数创建实例的方法进行了补充

```js
function Person ({ name, age=18 }) {
  this.name = name
  this.age = age
}
new Person({name: '张三'})
```

将上述例子转为class写法如何来写？

```js
class Person {
  constructor ({ name, age=18 }) {
    this.name = name
    this.age = age
  }
}
new Person({name: '张三'})
```

### 深入了解class的特性

1. class的数据类型是一个函数（和构造函数一样）

2. class的原型的constructor指向class（构造函数原型的constructor指向构造函数本身）

3. 通过 new 关键字创建出的实例的constructor指向该class（和构造函数一样）

4. class内部的方法实际上都是定义在类的prototype上（构造函数内部定义的函数在函数内部，在原型上挂载的函数定义在原型上）

5. 通过类创建对象的本质是调用类的constructor，如果类未定义constructor，则会在使用时默认（隐式）添加（构造函数创造对象本质是使用new）

6. class不能直接调用，需要通过new关键字（构造函数可以直接调用）

7. class内部方法指向的是实例,class内部是严格模式（构造函数内部的方法直接调用指向的是window‘谁调用指向谁’）

```js
     // 类 fn
      class fn {
        constructor(name, sex, age) {
          this.name = name;
          this.sex = sex;
          this.age = age;
          this.sayAge = this.sayAge.bind(this);
        }
        sayName() {
          console.log(this.name);
        }
        sayWin = () => {
          console.log(this.sex,'我是改变之后的sayWin');
        };
        sayAge() {
          console.log(this.age,'我是改变之后的sayAge');
        }
      }
      // 构造函数 Fn
      function Fn(name, sex) {
        this.name = name;
        this.sex = sex;
        this.sayName = function () {
          console.log(this.name);
        };
      }
      Fn.prototype.saySex = function () {
        console.log(this.sex);
      };

      // 1.class的数据类型是一个函数
      console.log(typeof fn, "fn"); // function fn
      console.log(typeof Fn, "Fn"); // function Fn
      // 2.class的原型的constructor指向class
      console.log(fn.prototype.constructor === fn, "fn"); // true
      console.log(Fn.prototype.constructor === Fn, "Fn"); // true
      // 3.通过 new 关键字创建出的实例的constructor指向该class（和构造函数一样）
      let f = new fn("章三", "男",18); // 用class创建一个实例
      let F = new Fn("李四", "女"); // 用构造函数创建一个实例
      console.log(f.constructor === fn, "fn"); //true
      console.log(F.constructor === Fn, "Fn"); //true
      // 4.class内部的方法实际上都是定义在类的prototype上
      console.log(f);
      console.log(F);
      // 5.通过类创建对象的本质是调用类的constructor，如果类未定义constructor，则会在使用时默认（隐式）添加
      class fnA {}
      class fnB {
        constructor() {}
      }
      let A = new fnA();
      let B = new fnB();
      console.log(A, B); // fnA {}, fnB {}
      // 6.class不能直接调用，需要通过new关键字（构造函数可以直接调用）
      // console.log(fn()); //class不能直接调用，需要通过new关键字（构造函数可以直接调用）
      console.log(Fn()); // undefined
      // 7.class内部方法指向的是实例,class内部是严格模式
      f.sayName(); // 章三
      F.sayName(); // 李四
      let { sayName } = f; // 解构出实例对象中的sayName方法
      // sayName() // 222.html:19 Uncaught TypeError: Cannot read properties of undefined (reading 'name')
      // 注意方法如果单独使用会报错，class内部是严格模式，所以 this 实际指向的是undefined
      let { saySex } = F; // 解构出构造函数对象中的saySex方法
      saySex(); // undefined

      // 解决单独使用类中方法的方法
      // 1.在类中定义一个方法，该方法内部使用箭头函数，箭头函数中的this指向实例 saySex方法
      // 2.使用bind改变this指向 sayAge方法
      let { sayWin, sayAge } = f;
      sayWin() // 男 我是改变之后的sayWin
      sayAge() // 18 '我是改变之后的sayAge'
```





### class的其他语法

取值函数（getter）和存值函数（setter）

```js
class A {
  get name () {
    return '1'
  }
  set name (value) {
    console.log('setter:'+value)
  }
}
```

类的属性名可以动态设置

```js
var methodName = 'methodName'
class A {
  [methodName] () {}
}
new A()
```

静态方法/属性
通过在属性和方法前添加static关键字，静态方法和属性不会被实例继承

```js
class A {}
A.a = 1
A.fn = function () {}

class A {
  static a = 1
  static fn () {
    
  }
}
```

静态方法里面的this指向的是类**而不是实例**

```js
class A {
  static fn () {
    this.getValue()
  }
  static getValue () {
    console.log('张三')
  }
  getValue() {
    console.log('李四')
  }
}
```

定义实例的属性

```js
class A {
  a = 1
  b = 'SUCCESS'
}
```

### class的继承

类的继承通过extends关键字

```js
class F {
  money = '100w'
  fn () {}
}
class S extends F{
}
```

子类中的constructor必须调用super，否则就会报错。

```js
class F {
  money = '100w'
  fn () {}
}
class S extends F{
  constructor () {}
}
```

子类调用super会触发父类的constructor并将参数传递过去

```js
class F {
  constructor (sMoney) {
    this.money = 100 + sMoney
  }
  fn () {}
}
class S extends F{
  constructor (money) {
    // 在super调用前子类是没有this，如果使用会报错
    super(money)
  }
}
console.log(new S(10))
```

类在继承时属性会被直接添加到实例中，方法则保留在类的原型上
S.prototype.__proto__ === F.prototype

class在创建实例这一点和构造函数一样

typeof能检验出来的数据类型



在JS严格模式下，如果调用一个函数，没有调用者的话，this的指向为undefined，且严格模式下，不存在变量提升

如果为undefined，该怎么去解决？

如果this的作用域为一个函数，可以使用箭头函数来解决，也可以使用bind的方式

```js
class F {
  money = '100w'
  fn () {}
}
class S extends F{
}
```



### 面试题：构造函数与class的区别？

PS：结合上面的class特性来

数据类型，两者都是function

原型的constructor指向：class指向本身，构造函数指向的也是本身

实例的constructor指向：class指向class，构造函数指向的构造函数

实例的方法声明位置不同：class都是在原型进行声明，构造函数如果方法中声明就存在于实例中，如果采用原型挂载的方式，就存在于原型上

通过new创建实例方式不同：class创建实例是通过new调用内部的constructor方法，如果内部没有constructor方法的话，就隐性创建一个。而构造函数是通过new调用构造函数来创建实例

class不能直接调用，需要通过new关键字来调用，而构造函数可以

因为class内部是严格模式，所以class内部this的指向为实例，如果直接调用class中的方法，会报错，但是可以通过将函数改写为箭头函数或者在constructor中使用bind改变this的指向来解决。而构造函数中声明的方法调用并不会报错，因为直接调用this指向的是window，如果window上没有声明这个变量，那么输出值为undefined。

