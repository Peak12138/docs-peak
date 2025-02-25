# 基础整理vue2
## 命令式与声明式

命令式框架的特点式是**关注过程**，声明式框架更**关注结果**

声明式框架是由数据支持着页面的渲染

比如我们要实现下面的功能

```
获取 id 为 app的div标签
它的文本内容为hello world
绑定点击事件
点击时弹出提示：ok
```

javascript实现 （命令式框架 命令式编程）

```js
// 获取div
const div = document.querySelector('#app')
// 设置文本内容
div.innerText = 'hello world'
// 绑定点击事件
div.addEventListener('click', () => { alert('ok') })
```

vue.js实现 (声明式框架 声明式编程)

```html
<div @click="() => alert('ok')">hello world</div>
```

### 性能与可维护性

**声明式代码的性能 < 命令式代码的性能**

**声明式代码的可维护性 > 命令式代码的可维护性**



### 虚拟 DOM 的性能

我们知道声明式框架的更新性能消耗 = 找出差异的性能消耗 + 直接修改的性能消耗
在理论中声明式框架的性能应该是不会超过命令式代码，但是在实际中，我们很难开发出绝对优化的命令式代码。所以**声明式**的找出差异的性能消耗可以忽略不记，但是从写法上可以大大简化，**可维护性高，**让开发者更多的专注于数据层的修改。



### 两者的性能[差异](https://blog.csdn.net/hzy199772/article/details/125558440)

如果我们把直接修改的性能消耗定义为A，把找出差异的性能消耗定义为B，那么有：
命令式代码的更新性能消耗 = A
声明式代码的更新性能消耗 = B + A

当找出差异的性能消耗为0时，声明式代码与命令式代码的性能相同，但是无法做到超越。**毕竟框架本身就是封装了命令式代码才实现了面向用户的声明式**，所以说，声明式代码的性能不优于命令式代码的性能





## 模板语法介绍

对于声明式框架，vue有一套自己的模板语法规范



### 插值(胡子语法)

基本用法

```html
<div>Message: {{ msg }}</div>
```

1. 双大括号会将数据解释为普通文本
2. 双大括号内部支持javascript表达式



### 指令 

基本用法

```html
<a v-bind:href="url"></a>
<a v-on:click="doSomething"></a>
```

### 面试题：v-html的弊端

v-html它是能够接受一个HTML字符串，将它转换为真实的Dom，挂载到指定的界面下，正式由于这个特性，v-html其实并不适用于接受用户表单输入的内容。当input接受到用户输入的Script标签，v-html会直接渲染成Dom，那样的话很容易收到注入攻击，也叫XSS攻击。

## 响应式原理的介绍

Vue 最独特的特性之一，是其非侵入性的响应式系统。数据模型仅仅是普通的 JavaScript 对象。而当你修改它们时，视图会进行更新。

##### 手写一个双向绑定的实现

```js
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <input id="input" type="text" />
    <p><span>输入的内容为：</span><span id="inpText"></span></p>
    <button id="btn">点击重制</button>
    <script>
      // 模拟Vue中的双向绑定

      // 先获取到dom元素
      const input = document.getElementById("input");
      const inpText = document.getElementById("inpText");
      const btn = document.getElementById("btn");

      // 给input绑定监听事件
      input.addEventListener("input", function (e) {
        // console.log(e.target.value);
        data.inputValue = e.target.value;
        // console.log(input.value);
        // data.inputValue = input.value;
        // inpText.innerText = data.inputValue;
      });

      // 给btn绑定监听事件
      btn.addEventListener("click", function () {
        data.inputValue = "已经重置数据";
      });

      // 定义响应式数据
      let data = {
        inputValue: "default"
        // 如果其中的inputValue是属于不可枚举的属性，就为其配置 enumerable
      };

      // let it = data.inputValue; // 定义一个变量，防止重复调用get方法 但是这种会导致作用域链链的延长，造成全局污染

      // Object.defineProperty(data, "inputValue", {
      //   // 对data中的inputValue进行监听，并且实现get和set的配置
      //   // value:1
      //   enumerable: true, // 是否可以枚举
      //   configurable: true, // 是否可以删除
      //   get() {
      //     // 访问调用get
      //     console.log("get");
      //     // return data.inputValue;//不能这样写，因为这样会再次调用get方法
      //     return it;
      //   },
      //   set(val) {
      //     // 修改调用set
      //     console.log("set");
      //     inpText.innerText = val;
      //     it = val;
      //     input.value = val;
      //   },
      // });
      Object.keys(data).forEach(key =>defineReactive(data,key,data[key]));
      // 封装好defineProperty函数，为响应式对象数据的每一个成员都添加get和set
      function defineReactive(obj, key, value) {
        Object.defineProperty(data, key, {
          // 对data中的inputValue进行监听，并且实现get和set的配置
          enumerable: true, // 是否可以枚举
          configurable: true, // 是否可以删除
          get() {
            console.log("get");
            return value;
          },
          set(val) {
            console.log("set");
            inpText.innerText = val;
            value = val;
            input.value = val;
          },
        });
      }
    </script>
  </body>
</html>

```

> 如果对象中的属性是属于不可枚举的属性，就为其配置 enumerable
>
> ​      //   enumerable: true, // 是否可以枚举
>
> ​      //   configurable: true, // 是否可以删除





## 动态参数

### 基本写法

```html
<!-- 动态属性 -->
<a v-bind:[attributeName]="url"> ... </a>

<!-- 简写 -->
<a :[attributeName]="url"> ... </a>


<!-- 动态事件 -->
<button v-on:[event]="event"> ... </button>

<!-- 简写 -->
<button @[event]="event"> ... </button>
```

### 对动态参数的约束

1. 动态参数的值要求是一个string类型，否则会被忽略。
2. 动态参数的表达式由于语法约束，不能有空格和引号，可以使用**计算属性**来解决。
3. 动态参数里面尽量不用大写字符，因为浏览器会把 attribute 名全部强制转为小写。





## 常见修饰符

修饰符是.指明的特殊后缀，用于指出一个指令特殊方法的绑定。

### 事件修饰符

- .stop （写在内部函数里，阻止事件冒泡）
- .prevent（先执行绑定的函数，阻止默认事件的发生）
- .capture（从捕获阶段就进行目标事件处理、即函数执行）
- .self（只关注自身事件，冒泡阶段此修饰符的函数会被忽略）
- .once（当前修饰的事件只执行一次）

```html
<!-- 阻止单击事件继续传播 -->
<a v-on:click.stop="doThis"></a>

<!-- 提交事件不再重载页面 -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- 修饰符可以串联 -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- 只有修饰符 -->
<form v-on:submit.prevent></form>

<!-- 添加事件监听器时使用事件捕获模式 -->
<!-- 即内部元素触发的事件先在此处理，然后才交由内部元素进行处理 -->
<div v-on:click.capture="doThis">...</div>

<!-- 只当在 event.target 是当前元素自身时触发处理函数 -->
<!-- 即事件不是从内部元素触发的 -->
<div v-on:click.self="doThat">...</div>
```

### 表单修饰符

- .lazy（当前修饰的属性在change（失焦）时更新）
- .number（将用户的输入值转为数值类型）
- .trim（过滤用户输入内容的首尾空白字符 ）

```html
<!-- 在“change”时而非“input”时更新 -->
<input v-model.lazy="msg">

<!-- 将用户的输入值转为数值类型 -->
<input v-model.number="age" type="number">

<!-- 过滤用户输入的首尾空白字符 -->
<input v-model.trim="msg">
```

### 按钮修饰符

- .enter（当键盘中的enter按下就会触发）
- .tab
- .delete (捕获“删除”和“退格”键)
- .esc
- .space
- .up
- .down
- .left
- .right
- .sync

```html
<!-- 只有在 `key` 是 `Enter` 时调用 `vm.submit()` -->
<input v-on:keyup.enter="submit">
```

>重点为事件修饰符和表单修饰符

**.sync能够实现属性间的双向绑定**





## 动态Class

### 对象语法

基本语法

```html
<!-- 传入class对象 -->
<div v-bind:class="{ active: isActive, 'text-danger': hasError }"></div>

<!-- v-bind:class 指令也可以与普通的 class attribute 共存 -->
<div
  class="static"
  v-bind:class="{ active: true, 'text-danger': false }"
></div>
```

可以动态修改class的值

> 在项目中一般有一个默认的class名还有一个动态绑定的class，动态class在用户点击时进行改变，然后来添加样式

```js
data: {
    return {
        classObj: {
            isaAtive: false,
            item: true
        }
    }
},
methods: {
    setActive() {
        this.classObj.isaAtive = !this.classObj.isaAtive
    }
}
```

可以绑定一个计算数据来实现

```js
data: {
  isActive: true,
  error: null
},
computed: {
  classObject: function () {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```



### 数组语法

基本语法

```html
<!-- 传入一个数组 -->
<div v-bind:class="[activeClass, errorClass]"></div>

<!-- 可以使用三元表达式 -->
<div v-bind:class="[isActive ? 'active' : '', 'text-danger']"></div>

数组中也可以使用对象语法
<div v-bind:class="[{ active: isActive }, 'text-danger']"></div>
```



**注意在组件上绑定class会添加到该组件的根元素上面**



##### 绑定内联样式

v-bind:style 的对象语法十分直观——看着非常像 CSS，但其实是一个 JavaScript 对象。CSS property 名可以用驼峰式 (camelCase) 或短横线分隔 (kebab-case，记得用引号括起来) 来命名：

```js
<!-- 传入一个对象 -->
<div v-bind:style="{ color: red, fontSize: 30 + 'px' }"></div>
```





## 条件渲染

### v-if

用于条件性的渲染内容，只有在表达式结果为true才会渲染

```html
<!-- 基本语法 -->
<h1 v-if="n">hi Vue!</h1>

<!-- 搭配v-else-if和v-else一起使用 -->
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
<!-- 注意：v-else-if和v-else必须紧跟在v-if后面 -->
```

**注意：v-else-if和v-else必须紧跟在v-if后面；必须相邻，并不能出现结构打断** 



template可以看作一个不可见的包裹元素，一般用于判断条件中代码块的包裹

可以结合v-if、v-else-if、v-else实现页面切换

```js
<template v-if="n===1">
  <div>Hi!Vue</div>
<div>Hello world</div>
  </template>
<template v-else>
  <div>Hi!React</div>
<div>Hello world</div>
  </template>
```



##### 用 key 管理可复用的元素

```html
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address">
</template>

<button>切换显示内容</button>
```

vue为什么能高效的渲染？

我们的页面在进行的是时候，虚拟Dom节点在进行比对的时候， Vue会判断节点是否能够复用，这就导致了，如果相同的标签在进行替换的时候，标签不会重新渲染，而是会直接替换到标签节点里面的属性



如果想要切换为不同的input，就使用属性key，为ket添加不同的属性值



### v-show

用于条件性的渲染内容，区别在于v-show内部内容通过css样式来控制显示与隐藏



v-if在进行条件渲染的时候，会将当前的节点挂载到当前的页面，隐藏的时候会将这个节点卸载掉



### 为什么说v-if是惰性的？

因为v-if是懒加载，当初始为false时，不会渲染，因为它是通过添加和删除dom元素来控制显示和隐藏的，因此初始渲染开销较小，切换开销比较大。



### v-if和v-show的使用场景

对于用户频繁点击触发样式切换的这种操作可以使用v-show，因为不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 的 “display” 属性进行切换。

在做权限管理的时候就可以使用v-if，这种日常点击操作并不频繁，并且可以很好的保护安全性。因为它是通过添加和删除dom元素来控制显示和隐藏的，因此初始渲染开销较小，切换开销比较大。





## 列表渲染

将数据按照一种固定的格式进行显示的效果
![pc列表的显示](https://peak-1316803036.cos.ap-beijing.myqcloud.com/01.png)
![移动端列表的显示](https://peak-1316803036.cos.ap-beijing.myqcloud.com/02.png)

### 在 v-for 里使用数组

基本语法

```html
<!-- v-for="(item, index) in array" -->
<!-- item为数组中的每一个元素 -->
<!-- index则为当前元素的索引 -->
<!-- 这里的in可以改写为of -->
<ul>
  <li v-for="item in items" :key="item.id">
    {{ item.message }}
  </li>
</ul>
```

```js
data() {
    return {
        items: [
            {id: 0, message: '西瓜'},
            {id: 1, message: '苹果'},
            {id: 2, message: '香蕉'}
        ]
    }
}
```

**key的作用是vue内部虚拟 DOM 在更新过程中辨别新旧节点，在数据顺序发生变化的时候，能够快速找到可以复用的dom节点**

vue通过key去判断当前的节点是否能够复用



#### 面试题：有关于key值的应用和唯一性

[链接](https://blog.csdn.net/weixin_62277266/article/details/123119237?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522171535324116800225586018%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fall.%2522%257D&request_id=171535324116800225586018&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~first_rank_ecpm_v1~rank_v31_ecpm-4-123119237-null-null.142^v100^pc_search_result_base2&utm_term=v-for%E4%B8%ADkey%E7%9A%84%E4%BD%9C%E7%94%A8&spm=1018.2226.3001.4187)



**思考下，这里添加点击对应项高亮的功能，如何实现？**

通过添加选中项的动态class绑定的方式实现

### ![截屏2024-04-23 18.21.52](https://peak-1316803036.cos.ap-beijing.myqcloud.com/%E6%88%AA%E5%B1%8F2024-04-23%2018.21.52.png)在 v-for 里使用对象

```html
<!-- v-for="(value, name, index) in object" -->
<ul>
  <li v-for="value in object">
    {{ value }}
  </li>
</ul>
```

```js
data() {
    return {
        object: {
            name: 'allen',
            age: '18',
            sex: '男'
        }
    }
}
```

### vue对数组操作的方法进行了封装

当对vue中的数组通过下标访问并进行更改的时候，不会改变页面上数组中内容的渲染，因为在更改时没有将新内容进行getter和setter的绑定



#### 怎么解决？

##### 方式1

Vue 将被侦听的数组的变更方法进行了包裹，所以它们也将会触发视图更新。这些被包裹过的方法包括：

- push()
- pop()
- shift()
- unshift()
- splice()
- sort()
- reverse()

**注意：修改数组不能通过下标的方式直接修改**
****

##### 方式2

对数组进行深拷贝，修改数据后再整体进行赋值

```js
const newItems = Json.prase(JSON.stringfy(this.items))
newItems[0]= [id:0,message:菠萝]
this.items = newItems // 整体进行赋值
```



这种情况对于对象数据也是一样的

**对于对象属性的添加需要通过vue.set方法**

语法：

`vue.set(当前的数据,所需要添加的属性,属性所对应的值)`


### v-for对于template同样适用

```html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

**使用场景：当我想要通过v-for渲染一个代码块**







## 事件处理

### 绑定监听事件

使用v-on 指令监听 DOM 事件

```html
<!-- 事件处理的方法 -->
<!-- 点击按钮记录点击次数 -->
<div>
  <button>Add 1</button>
  <p>click {{ counter }} times</p>
</div>

对于复杂的事件操作，定义在methods中
```

### 内联处理器中的方法

需要在事件中传入参数

```html
<div v-for="product in productList" :key="product.id">
    <p>商品名称：{{product.name}}</p>
    <p>商品价格：{{product.price}}</p>
</div>
```

注意：获取事件对象需要传入$event（在事件传参数时，写上$event）

打印结果为一个名为PointerEvent的对象数据

在html上绑定的事件在vue内部已经做了处理，在ViewModel被销毁的时候，所有监听的事件会被解绑。





## 生命周期钩子

### 生命周期钩子

vue生命周期表示在组件创建后的一系列变化，其中钩子函数会在生命周期的关键节点中被调用

![生命周期](https://peak-1316803036.cos.ap-beijing.myqcloud.com/lifecycle.png)

### **（1）生命周期是什么？**

Vue 实例有一个完整的生命周期，也就是从开始创建、初始化数据、编译模版、挂载 Dom -> 渲染、更新 -> 渲染、卸载等一系列过程，我们称这是 Vue 的生命周期。

### **（2）各个生命周期的作用**

| 生命周期      | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| beforeCreate  | data和methods都没有创建，可以在这里添加loading               |
| created       | 组件实例已经完全创建，属性也绑定，但真实 dom 还没有生成，$el 还不可用，data和methods都已经创建。对下拉数据二次处理，添加label或者是value等属性、异步请求，初始化表单数据。 |
| beforeMount   | 在挂载开始之前被调用：相关的 render 函数首次被调用           |
| mounted       | el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子    |
| beforeUpdate  | 组件数据更新之前调用，发生在虚拟 DOM 打补丁之前              |
| update        | 组件数据更新之后                                             |
| activited     | keep-alive 专属，组件被激活时调用                            |
| deactivated   | keep-alive 专属，组件被销毁时调用                            |
| beforeDestory | 组件销毁前调用                                               |
| destoryed     | 组件销毁后调用                                               |



### 面试题：父子组件创建时，created和mounted的先后顺序？

父组件的created、子组件的created、子组件的mounted，父组件的mounted。这是因为created是一个由外到内的过程，而mounted是一个由内向外的过程，如果有更多的层级，也是遵循这样的规律。





## vue-cli

使用脚手架需要node环境

切换node环境需要使用nvm



下载yarn

```bash
npm i yarn -g
```



创建项目不能用驼峰命名



在package.json中的scripts下的命令，都是vue中可以直接运行的命令



解决vue中项目代码以及vue文件首行代码报错的问题

在pakeage.json下的eslintConfig属性下添加如下：(但是会跳过Babel检查)

```js
 "requireConfigFile": "false",
```

![截屏2024-05-06 08.52.41](https://peak-1316803036.cos.ap-beijing.myqcloud.com/%E6%88%AA%E5%B1%8F2024-05-06%2008.52.41.png)





## 组件的基本用法

### 组件注册

全局注册

```js
// 定义一个名为 my-component 的新组件
Vue.component('my-component', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<h1>这是一个全局组件</h1>'
})
```

局部注册

```js
// 组件A
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  }
}
```

[解决](https://blog.csdn.net/Insist_bin/article/details/119182525)报错：

![截屏2024-05-06 09.27.04](https://peak-1316803036.cos.ap-beijing.myqcloud.com/%E6%88%AA%E5%B1%8F2024-05-06%2009.27.04.png)

在导入vue实例的时候使用如下语句

```js
import Vue from 'vue/dist/vue.esm.js'
```



### 组件命名

在页面中使用时的命名

```html
<!-- kebab-case -->
<my-component />

<!-- PascalCase -->
<MyComponentName />
```

注意：如果是大写驼峰命名的组件，可以使用小写命名的方式来进行使用，反之用小写注册命名的组件，不能用小写横杠的方式来使用



### 数据隔离

定义组件data数据时，**必须要是一个函数**，这样可以实现数据隔离

```html
<!-- 子组件 my-button -->
<button @click="handleClick">计数{{count}}</button>

<!-- 父组件中引入 -->
<my-button />
<my-button />
<my-button />
```

### 面试题：为什么data必须是一个函数

因为组件是用来复用的，且 JS 里对象是引用关系，如果组件中 data 是一个对象，那么这样作用域没有隔离，子组件中的 data 属性值会相互影响，如果组件中 data 选项是一个函数，那么每个实例可以维护一份被返回对象的独立的拷贝，组件实例之间的 data 属性值不会互相影响；而 new Vue 的实例，是不会被复用的，因此不存在引用对象的问题。

### props传递数据（父传子）

通过Prop向子组件传递数据

```html
<!-- 父组件 -->
<blog-post title="标题" :tips="tips" />
```

```js
// blog-post 组件
export default {
  props: ['title', 'tips']
}
```

如果传入的prop很多，可以使用传入整体props对象

```html
<blog-post
  v-for="post in posts"
  v-bind:key="post.id"
  v-bind:title="post.title"
  v-bind:content="post.content"
  v-bind:publishedAt="post.publishedAt"
  v-bind:comments="post.comments"
></blog-post>
<!-- 等价于 -->
<blog-post
  v-for="post in posts"
  v-bind:key="post.id"
  v-bind:post="post"
></blog-post>
```





## 组件间的通信

#### Vue组件通信的方式

#### props/$emit 

可以实现父子组件的双向通信，父组件通过props的方式向子组件传递数据（父组件定义的数据通过v-bind绑带到子组件中，子组件通过props的方式进行获取），而通过$emit 子组件可以向父组件通信（子组件通过this.$emit传递一个方法带出一个值，通过调用监听子组件相应的方法@add=‘add（第一个是子组件的方法，带有子组件的值，第二个是父组件的方法）’，在父组件调用一个方法去获取到这个值）。

#### V-model/.sync

**实现组件间的属性绑定，父组件传入一个值，子组件修改这个值，并更新到父组件**，v-model缺点：无法实现语义化（v-bind固定绑定value，v-on**固定绑定input**）,（sync方式如果子组件想要修改父组件传来的值需要在$emit是添加update:修饰的属性）**sync实现的是在props方式父传子值的基础上，子组件可以更新修改父组件传过来的值**

.sync修饰符修饰的数据会隐式的向子组件传递一个同名的事件，可以使用$emit的方式去修改副组件中的值

##### V2、v3.sync的区别

v2的.sync

**父组件**

```vue
<comp :count.sync='count' />
```

子组件更新

```vue
this.$emit('updata:count',Math.random()*100)
```



v3没有.sync，将这个功能整合进了`v-model`

**父组件**

```vue
<comp v-model:count='count' />
```

> 第一个count是子组件中prop能够访问到的属性，第二个是父组件中定义的数据

**子组件更新**

```vue
this.$emit('updata:count',Math.random()*100)
```



#### v-slot：（和以上不同的是可以传入Dom）

可以实现父子组件单向通信（父向子传值），在实现可复用组件，向组件中传入DOM节点、html等内容以及某些组件库的表格值二次处理等情况时，可以优先考虑v-slot。

#### $children/$parent/$refs/$root 

父组件通过this.$children的方式获取组件列表，但是$children获取的列表并不保证顺序，也不是响应式的。子组件可以通过$parent获取到父组件的实例。（$refs在html元素上返回的是dom元素，在组件上返回的是组件实例;它是通过在子组件中定义方法后，在父组件中通过获取组件实例并调用实例中的这个方法传入一个值更新到子组件中。可以通过这个实现组件通信；弊端：本来逻辑是在子组件中操作子组件的数据，使用这个方法会在父组件操作子组件的数据,先获取到子组件的实例 ）

父组件代码：

```vue
<template>
  <div id="app">
    <span>这是父组件的输入框：</span><input type="text" @keyup="receive">
    <p>这是子组件传过来的值：<span>{{ smallMsg }}</span></p>
    <my-component ref="child"/>
    

  </div>
</template>

<script>
// 注册局部组件
import MyComponent from './components/MyComponent.vue'

export default {
  data(){
    return{
      bigMsg:'111',
      smallMsg:''
    }
  },
  methods:{
    receive(data){
      let children = this.$refs.child
      console.log(children);
      children.send(data.target.value)//调用这个方法用来保存父组件传入子组件的数值
      this.smallMsg = data.target.value
    }
  },

  name: 'App',
  components: {
    MyComponent
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

```

子组件代码：

```vue
<template>
  <div>
    <h2>这是一个局部注册的组件</h2>
    <span>这是子组件的输入框：</span><input type="text" v-model="msg">
    <p>这是父组件传过来的值：<span>{{ msg }}</span></p>
  </div>
</template>

<script>
export default {
  components: {},
  props: [],
  data() {
    return {
      msg:''
    };
  },
  watch: {},
  computed: {},
  methods: {
    send(data){
      // this.$emit('update:bigMsg',this.msg)
      this.msg = data
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
</style>
```

#### $attrs/$listeners：

能够实现跨级双向通信，能够让你简单的获取传入的属性和绑定的监听，并且方便地向下级子组件传递，在构建高级组件时十分好用。

#### provide/inject 

父组件中通过provide来提供变量，子组件及子代组件通过inject来注入变量。provide/inject API主要是解决了跨级组件间的通信问题，不过它的使用场景，主要是子组件获取上级组件的状态。

#### EventBus 

可以实现全局通信，在项目规模不大的情况下，可以利用eventBus实现全局的事件监听。但是eventBus要慎用，避免全局污染和内存泄漏等情况。

#### Vuex：

可以实现全局通信，是vue项目全局状态管理的最佳实践。在项目比较庞大，想要集中式管理全局组件状态时，那么安装Vuex准没错！

![组件通信的方式](https://peak-1316803036.cos.ap-beijing.myqcloud.com/2.png)





## 插槽

### 基本语法

```html
<!-- blog组件 -->
<div>
    <p>博文的标题</p>
    <div>
        <p>博文的内容</p>
        <slot></slot>
    </div>
</div>
```

在父组件中使用

```html
<blog>
    <!-- 这里可以插入文案 -->
    今天是一个好天气
    <!-- 可以插入标签 -->
    <h1>我是一个h1</h1>
    <!-- 也可以插入组件 -->
    <hello-world></hello-world>
</blog>
```

注意：如果 blog组件内的 template 中没有包含一个slot元素，则该组件起始标签和结束标签之间的任何内容都会被抛弃。

### 编译作用域

父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。

### 插槽的后备内容

可以在slot中提前设置一段内容作为默认值，当父组件提供插槽内容时将会被覆盖

### vm.$slots（插槽常用API）

$slots只有在实例下面才会有，插槽实例需要通过给组件加上ref='xxx'的属性,然后this.$refs.xxx来获取这个插槽的实例。

进行高阶组件的内容编写，获取的都是虚拟DOM

用来访问被插槽分发的内容。

```html
<blog-post>
  <template v-slot:header>
    <h1>About Me</h1>
  </template>

  <p>Here's some page content, which will be included in vm.$slots.default, because it's not inside a named slot.</p>

  <template v-slot:footer>
    <p>Copyright 2016 Evan You</p>
  </template>

  <p>If I have some content down here, it will also be included in vm.$slots.default.</p>.
</blog-post>
```

可以通过渲染函数来进行页面渲染

```js
Vue.component('blog-post', {
  render: function (createElement) {
    var header = this.$slots.header
    var body   = this.$slots.default
    var footer = this.$slots.footer
    return createElement('div', [
      createElement('header', header),
      createElement('main', body),
      createElement('footer', footer)
    ])
  }
})
```



### 具名插槽（使用v-slot绑定不同的·插槽）

```html
<!-- layout组件 -->
<div class="container">
  <header>
    <!-- 页头放这里 -->
    <slot name="header"></slot>
  </header>
  <main>
    <!-- 主要内容放这里 -->
    <slot></slot>
  </main>
  <footer>
    <!-- 页脚放这里 -->
    <slot name="footer"></slot>
  </footer>
</div>
```

### 作用域插槽 

作用域插槽能够实现在父组件中获取子组件的数据

```html
<!-- current-user组件 -->
<span>
  <slot>{{ user.lastName }}</slot>
</span>

<!-- 在父组件使用，并换掉备用内容 -->
<current-user>
  {{ user.firstName }}
</current-user>

<!-- 上述代码需要改写 -->
<span>
  <slot v-bind:user="user">
    {{ user.lastName }}
  </slot>
</span>
<!-- 父组件中 -->
<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>
</current-user>
```

在vue的2.7.16版本中，无法使用v-solt:default来获取无具名插槽实例，但是可以使用solt-scope这个已经被废弃的属性

解决方法：

1. 确认你正在使用的 Vue 版本。如果是 Vue 2.6 或更高版本，应使用简化的 `#default` 语法。
2. 如果你的项目中混用了不同版本的 Vue，请确保统一语法。

示例代码：

Vue 2.5 或更早版本语法：

```html
<template v-slot:default="{ msg }">
  {{ msg }}
</template>
```

Vue 2.6 或更新版本语法：

```html
<template #default="{ msg }">
  {{ msg }}
</template>
```





### 总结：

**插槽分为三种：**
默认插槽 具名插槽 [作用域](https://so.csdn.net/so/search?q=作用域&spm=1001.2101.3001.7020)插槽

**1.默认插槽**
*定义：* 默认插槽是将父组件的结构和数据插入子组件中，默认插槽只有一个插入位置，要插入的html结构和data数据必须在父组件中，不过css可以在子组件中
*简述：* 将父组件的自定义html和data插入子组件的对应位置
*特点：* 父组件决定结构和数据

**2.具名插槽**
*定义：* 具名插槽简单地说就是具有名字的插槽，只是默认插槽只有一个插入位置，具名插槽可以有多个插入位置，根据名字来识别对应的插槽
*简述：* 将多个父组件的自定义html和data插入子组件的多个位置
*特点：* 父组件决定结构和数据

**3.作用域插槽**
*定义：* 作用域插槽的data数据固定写在子组件中，数据的html结构根据父组件传入的html结构来决定
*简述：* 根据父组件中不同的html结构解析data中的数据
*特点：* 子组件决定数据，父组件决定结构







## watch监听器

监听器适用于数据发生改变时做一些副作用相关的处理

### watch相关api

watch中可以对基本数据类型、引用数据类型（对象格式）、对象的属性、还有方法（监听一个属性，后面绑定一个方法，当数据发生变化的时候执行后面的监听函数 ）进行监听；还可以进行深度监听、立即执行监听函数、嵌套执行监听函数的操作

```js
var vm = new Vue({
  data: {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: {
      f: {
        g: 5
      }
    }
  },
  watch: {
    a: function (val, oldVal) {
      console.log('new: %s, old: %s', val, oldVal)
    },
    // 方法名
    b: 'someMethod',
    // 该回调会在任何被侦听的对象的 property 改变时被调用，不论其被嵌套多深
    c: {
      handler: function (val, oldVal) { /* ... */ },
      deep: true
    },
    // 该回调将会在侦听开始之后被立即调用
    d: {
      handler: 'someMethod',
      immediate: true
    },
    // 你可以传入回调数组，它们会被逐一调用
    e: [
      'handle1',
      function handle2 (val, oldVal) { /* ... */ },
      {
        handler: function handle3 (val, oldVal) { /* ... */ },
        /* ... */
      }
    ],
    // watch vm.e.f's value: {g: 5}
    'e.f': function (val, oldVal) { /* ... */ }
  }
})
vm.a = 2 // => new: 2, old: 1
```

**watch内部可以处理异步相关逻辑**

比如重新调用接口获取数据，应用场景：在做仓库管理系统的时候，有一个商品发生变化了之后，我需要在变化之后重新申请商品列表，那就在watch中当这个数据发生变化，就发出异步调用请求





## 计算属性

当需要计算一个属性需要依赖一个或者多个值的时候就可以使用计算属性

##### 计算属性

基础用法

```html
<div id="example">
  <p>Original message: "{{ message }}"</p>
  <p>Computed reversed message: "{{ reversedMessage }}"</p>
</div>
```

```js
var vm = new Vue({
  el: '#example',
  data: {
    message: 'Hello'
  },
  computed: {
    // 计算属性的 getter
    reversedMessage: function () {
      // `this` 指向 vm 实例
      return this.message.split('').reverse().join('')
    }
  }
})
```

计算属性的setter

```js
computed: {
  fullName: {
    // getter
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
```

特性

1. 计算属性会被加入到vue实例（方便开发者直接调用）
2. 计算属性所依赖的数据未发生变化，结果会被缓存（这个性质可以节省性能；当使用函数实行计算逻辑时，可能会遇到计算频繁的情况，遇到这种情况函数会出现频繁调用，出现占用性能的情况，而计算属性不会出现函数调用的情况他只会调用内部的get或者set属性来进行数据的计算修改或者获取）

并且如果想要去更改compute中的值，需要依赖对应的get和set





## Vuex 

#### 什么是Vuex？

> 实现跨级组件以及兄弟组件之间的通信

Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式 + 库。它采用集中式存储管理应用的所有组件的状态（将数据状态进行统一管理），并以相应的规则保证状态以一种可预测的方式发生变化。

#### 什么是“状态管理模式”？

状态，驱动应用的数据源；
视图，以声明方式将状态映射到视图；
操作，响应在视图上的用户输入导致的状态变化。

![单项数据流](https://peak-1316803036.cos.ap-beijing.myqcloud.com/flow.png)

如果多个视图依赖于同一状态。来自不同视图的行为需要变更同一状态。

![购物车](https://peak-1316803036.cos.ap-beijing.myqcloud.com/shop.png)

#### store包含哪些内容

[官方文档](https://vuex.vuejs.org/zh/)
state: 存储状态树的数据，可以用mapState辅助函数获取状态

```js
// 一般的获取state的方法
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return this.$store.state.count
    }
  }
}

// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapState } from 'vuex'

export default {
  // ...
  computed: {
        localComputed () { /* ... */ },
        // 使用对象展开运算符将此对象混入到外部对象中
        ...mapState({
            // ...
        })
    }
}
```

getter: 可以认为是 store 的计算属性，当所依赖的state的值发生变化就会重新触发，可以通过辅助函数mapGetters来获取

```js
// store中定义getters
const store = Vuex.createStore({
  state: {
    count: 1
  },
  getters: {
    counts: state => {
      return state.count * 2
    }
  }
})

// 直接引入
computed: {
    counts () {
        return store.getters.counts
    }
}
// 辅助函数引入
computed: {
    ...mapGetters([
      'counts'
      // ...
    ])
}

```

mutation: 用于修改store中的state，mutation中所定义的方法接受两个参数state和提交的数据payload，通过调用store.commit方法和mapMutations辅助函数来实现，**mutation 必须是同步函数**

```js
// 基本用法
store.commit('increment', 参数)

// 使用辅助函数
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`

      // `mapMutations` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    })
  }
}
```

action: **用于处理异步相关的操作**，在内部分发mutation修改state，通过dispath方法和辅助函数mapActions方法来实现

```js
// 基本用法
store.dispatch('increment')

// 使用辅助函数
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`

      // `mapActions` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    })
  }
}
```

module: 将状态树拆分成多个模块，每个模块拥有自己的 state、mutation、action、getter





## 动态组件&异步组件



### 动态组件

动态组件：不同组件之间进行动态切换，通过 Vue 的 元素加一个特殊的 is attribute 实现

动态路由的使用场景：不知道后端返回的数据结构的时候，使用动态组件，即根据不同的数据渲染不同的组件

##### 基本用法

```html
<!-- 组件会在 `currentTabComponent` 改变时改变 -->
<component v-bind:is="currentTabComponent"></component>
```

在上述示例中，

- currentTabComponent 可以包括

- 已注册组件的名字，或一个组件的选项对象

注意，这个 attribute 可以用于常规 HTML 元素，但这些元素将被视为组件，这意味着所有的 attribute **都会作为 DOM attribute 被绑定**。

**用法1**:实现组件的切换

```vue
<component :is="component"></component>
```

其中v-bind绑定的component是一个响应式数据，当点击事件触发时会改变compoent的值，然后实现组件的切换



**用法2**:实现传入一个HTML元素

```vue
<component is="a" herf="www.baidu.com"></component>
```

其中因为是传入的一个固定的HTML元素，所以不需要使用v-bind。添加a标签的herf属性就可以实现页面的跳转了。



**用法3**:**动态**传入一个HTML元素

```vue
<component v-bind="attr"></component>
```

其中attr是传入HTML元素的属性

```js
attr:{
  is:'a',
  herf:"www.baidu.com",
  target:"_blank" // 以新的标签页打开链接
}
```



### 解决eslint对于组件属性is的报错

方法1:使用声明标签

在语法前加入以下代码

```vue
<!-- eslint-disable vue/require-component-is -->
```

或者给vue项目添加一个vue.config.js配置文件，给她添加上以下内容后，就不再进行任何eslint的校验

```js
module.exports = {
  lintOnSave: true,
  runtimeCompiler:false
}
```




### 异步组件

减少页面首次加载时组件的数量，需要使用的时候再去加载。**通过异步组件能够提高页面首次加载的效率**

##### 基本用法

```js
// 全局注册
Vue.component('async-example', function (resolve, reject) {
  resolve({
    template: '<div>I am async!</div>'
  })
})

Vue.component(
  'async-webpack-example',
  // 这个动态导入会返回一个 `Promise` 对象。
  () => import('./my-async-component')
)
// 局部注册
new Vue({
  // ...
  components: {
    'my-component': () => import('./my-async-component')
  }
})
```

#### 重点：合理使用异步组件能够解决首页页面加载时间过长。





## mixin混入

在vue中提供了一种复用性的操作，所混入的对象包含任意组件的选项（data，生命周期，methods，watch，computed）

##### 基本使用

```js
// 定义一个混入对象
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}

// 定义一个使用混入对象的组件
var Component = Vue.extend({
  mixins: [myMixin]
})

var component = new Component() // => "hello from mixin!"
```

##### 选项合并冲突

因为使用mixin会将选项与目标页面或者会混入斤组件中的数据，所以可能会发生命名冲突。

data | computed：数据对象在内部会进行递归合并，并在发生冲突时以组件数据优先

```js
var mixin = {
  data: function () {
    return {
      message: 'hello',
      foo: 'abc'
    }
  }
}

new Vue({
  mixins: [mixin],
  data: function () {
    return {
      message: 'goodbye',
      bar: 'def'
    }
  },
  created: function () {
    console.log(this.$data)
    // => { message: "goodbye", foo: "abc", bar: "def" }
  }
})
```

生命周期 | watch：同名钩子函数将合并为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子之前调用

```js
var mixin = {
  created: function () {
    console.log('混入对象的钩子被调用')
  }
}

new Vue({
  mixins: [mixin],
  created: function () {
    console.log('组件钩子被调用')
  }
})

// => "混入对象的钩子被调用"
// => "组件钩子被调用"
```

methods：将被合并为同一个对象。两个对象键名冲突时，取组件对象的键值对

```js
var mixin = {
  methods: {
    foo: function () {
      console.log('foo')
    },
    conflicting: function () {
      console.log('from mixin')
    }
  }
}

var vm = new Vue({
  mixins: [mixin],
  methods: {
    bar: function () {
      console.log('bar')
    },
    conflicting: function () {
      console.log('from self')
    }
  }
})

vm.foo() // => "foo"
vm.bar() // => "bar"
vm.conflicting() // => "from self"
```


##### 全局混入

```js
// 为自定义的选项 'myOption' 注入一个处理器。
Vue.mixin({
  created: function () {
    var myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})

new Vue({
  myOption: 'hello!'
})
// => "hello!"
```

**尽量不用使用mixin全局混入，它将影响每一个之后创建的 Vue 实例（包括第三方插件 ）**



### 【面试题】mixin和组件的区别

mixin是混入，将mixin中的选项混入到页面中，并且mixin中是没有template的。在组件中的使用是引入，在父组件中引入子组件，并且组件中存在着数据隔离，当父组件中的数据与子组件的数据命名发生冲突的时候也不会互相影响。







## 虚拟节点&渲染函数

### 虚拟节点

虚拟节点（dom）本质上就是一个普通的JS对象，用于描述视图的界面结构，用来描述与真实DOM的关系


### 渲染函数

可以使用render对页面进行编程式的修改。字符串模板的代替方案，允许你发挥 JavaScript 最大的编程能力。该渲染函数接收一个 createElement 方法作为第一个参数用来创建 VNode。如果组件是一个函数组件，渲染函数还会接收一个额外的 context 参数。

```js
createElement(
  // {String | Object | Function}
  // 一个 HTML 标签名、组件选项对象，或者
  // resolve 了上述任何一种的一个 async 函数。必填项。
  'div',

  // {Object}
  // 一个与模板中 attribute 对应的数据对象。可选。可以将这个生成的DOM看作一个组件，这部分内容就是组件的属性，例如data，或者button中的click事件
  {
    // (详情见下一节)
  },

  // {String | Array}
  // 子级虚拟节点 (VNodes)，由 `createElement()` 构建而成，也就是渲染的具体内容
  // 也可以使用字符串来生成“文本虚拟节点”。可选。
  [
    '先写一些文字',
    createElement('h1', '一则头条'),
    createElement(MyComponent, {
      props: {
        someProp: 'foobar'
      }
    })
  ]
)
```

数据对象(Vnode中属性的含义)

```js
{
  // 与 `v-bind:class` 的 API 相同，
  // 接受一个字符串、对象或字符串和对象组成的数组
  'class': {
    foo: true,
    bar: false
  },
  // 与 `v-bind:style` 的 API 相同，
  // 接受一个字符串、对象，或对象组成的数组
  style: {
    color: 'red',
    fontSize: '14px'
  },
  // 普通的 HTML attribute
  attrs: {
    id: 'foo'
  },
  // 组件 prop
  props: {
    myProp: 'bar'
  },
  // DOM property
  domProps: {
    innerHTML: 'baz'
  },
  // 事件监听器在 `on` 内，
  // 但不再支持如 `v-on:keyup.enter` 这样的修饰器。
  // 需要在处理函数中手动检查 keyCode。
  on: {
    click: this.clickHandler
  },
  // 仅用于组件，用于监听原生事件，而不是组件内部使用
  // `vm.$emit` 触发的事件。
  nativeOn: {
    click: this.nativeClickHandler
  },
  // 自定义指令。注意，你无法对 `binding` 中的 `oldValue`
  // 赋值，因为 Vue 已经自动为你进行了同步。
  directives: [
    {
      name: 'my-custom-directive',
      value: '2',
      expression: '1 + 1',
      arg: 'foo',
      modifiers: {
        bar: true
      }
    }
  ],
  // 作用域插槽的格式为
  // { name: props => VNode | Array<VNode> }
  scopedSlots: {
    default: props => createElement('span', props.text)
  },
  // 如果组件是其它组件的子组件，需为插槽指定名称
  slot: 'name-of-slot',
  // 其它特殊顶层 property
  key: 'myKey',
  ref: 'myRef',
  // 如果你在渲染函数中给多个元素都应用了相同的 ref 名，
  // 那么 `$refs.myRef` 会变成一个数组。
  refInFor: true
}
```

虚拟DOM的渲染实例

```js
// 虚拟DOM的使用 和全局注册组件一样
Vue.component('VnodeTest', {
  // 组件调用render函数返回虚拟DOM
  render: function (createElement) {
    const vnode = createElement('div', { class: 'title' }, [
      createElement('button', {
        on:{
          click:function(){
            console.log('click')
          }
        }
      },'这是一个btn的虚拟DOM'),
      '这是一个div的虚拟DOM'
    ])
    return vnode
  }
})
```





## 路由vue-router

### vue-router的介绍

在之前的学习中，我们可以使用vue来创建单页应用，那么如何根据不同的 url 地址展示不同的内容或页面？

Vue Router 是 Vue.js (opens new window)官方的路由管理器。它和 Vue.js 的核心深度集成，让构建单页面应用变得易如反掌。包含的功能有：

- 嵌套路由映射
- 模块化的、基于组件的路由配置
- 路由参数、查询、通配符
- 基于 Vue.js 过渡系统的视图过渡效果
- 细致的导航控制
- 带有自动激活的 CSS class 的链接
- HTML5 历史模式或 hash 模式，在 IE9 中自动降级
- 自定义的滚动条行为
- URL 的正确编码



### vue-router使用流程

1. 下载vue-router依赖
2. 编写路由配置，全局注入router（编写路由表，Vue.use(VueRouter)）
3. 在vue实例上进行挂载(先improt导入，然后在new Vue的时候挂载)
4. 使用router-view用于承载页面（嵌套路由是有两个router-view的）



router-view是路由展示窗也是路由的入口，当前页面跳转后显示的内容将在router-view的位置进行展示



关于redirect的使用，如果是直接跳转到导入的layout页面，在页面中是没有任何内容的，如果在页面跳转的时候将路由重定向为子路由中的组件，那么layout初始时它是有内容的。

#### 【面试题】：为什么要进行全局注入router

在vue中，是没有例如`router-link`、`router-view`的标签的，如果想要在项目中使用，那就必须全局引入vue-router

### 动态路由匹配

使用场景：动态路由实现权限管理

页面级别权限管理的实现流程：

1、uid  =》 后端API	=》 路由权限API

2、后端  =》 用户对应的一个权限列表	=》 前端	=〉JSON

3、JSON  =》 数据树形结构化（根据pid处理成树形结构数据）

4、树形结构化的数据  =》 vue路由结构

5、vue路由结构  =》 静态路由

6、树形结构化的数据  =》 菜单组件



需要把某种模式匹配到的所有路由，全都映射到同个组件，可以实现组件的复用。

```js
// 某个仓库组件中通过id来区分仓库的内容

const router = new VueRouter({
  routes: [
    // 动态路径参数 以冒号开头
    { path: '/storehouse/:id', component: Storehouse }
  ]
})
```

动态路由解决了传参的安全问题（用户可以自定义url的位置，然后带入自己的id调用对应的接口，这是不安全的，例如这种是不安全的，会对外暴露`www.baidu.com/user?id=10086`），



### 嵌套路由

URL 中各段动态路径也按某种结构对应嵌套的各层组件

```js
const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: 'user',
          component: User
        },
        {
          path: 'storehouse',
          component: Storehouse
        }
      ]
    }
  ]
})
```

### 路由跳转的方式

#### 声明式路由

组件支持用户在具有路由功能的应用中 (点击) 导航。 通过 to 属性指定目标地址，默认渲染成带有正确链接的 a 标签.也就是通过	`<router-link>`的方式

#### 编程式导航

router.push

```js
// 字符串
router.push('home')

// 对象
router.push({ path: 'home' })

// 命名的路由
router.push({ name: 'user', params: { userId: '123' }})

// 带查询参数，变成 /register?plan=private
router.push({ path: 'user', query: { userId: '123' }})
```

> push方式的跳转如果传递的是name属性，如果当前路由表中没有name属性的话，就找不到要跳转的页面
>
> params的传参是一种隐式的传参，也就是在url中并没有参数的携带，也就是看不到。
>
> query的传参方式，就是一种显式传参方式。

router.replace（登陆的时候使用 、订单支付完成后，页面跳转，不能允许又返回到支付页面）
与router.push方法类似，通过替换历史堆栈中的当前路由，以编程方式导航到一个新的 URL。

router.resolve
返回路由地址的标准化版本。

```js
const url = router.resolve({ path: 'user', query: { userId: '123' }})
```

router.go

```js
// 在浏览器记录中前进一步，等同于 history.forward()
router.go(1)

// 后退一步记录，等同于 history.back()
router.go(-1)

// 前进 3 步记录
router.go(3)

// 如果 history 记录不够用，那就默默地失败呗
router.go(-100)
router.go(100)
```



### 【面试题】：push和replace的区别

push方式是在当前历史堆栈中新增一个路由来进行的跳转，而replace是通过替换当前历史堆栈的路由来实现页面的跳转，也就是A页面的路由替换到B页面，当使用浏览器的后退键时，不是返回的A页面，而是A页面之前的页面

### 导航守卫

导航守卫包含：

- 全局前置守卫(router.beforeEach)
- 全局后置守卫(router.afterEach)
- 全局解析守卫(router.beforeResolve)
- 路由独享的守卫(在路由配置上直接定义 beforeEnter 守卫)
- 组件内的守卫(组件内定义守卫)

##### 完成的导航解析流程

1. 导航被触发。
2. 在失活的组件里调用 beforeRouteLeave 守卫。
3. 调用全局的 beforeEach 守卫。
4. 在重用的组件里调用 beforeRouteUpdate 守卫(2.2+)。
5. 在路由配置里调用 beforeEnter。
6. 解析异步路由组件。
7. 在被激活的组件里调用 beforeRouteEnter。
8. 调用全局的 beforeResolve 守卫(2.5+)。
9. 导航被确认。
10. 调用全局的 afterEach 钩子。
11. 触发 DOM 更新。
12. 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。

##### 全局前置守卫

（登陆的守候，在登陆的时候判断登陆的状态，如果是登出状态，就让他跳转回登陆页面）

```js
const router = new VueRouter({ ... })

router.beforeEach((to, from, next) => {
  // to: Route: 即将要进入的目标 路由对象
  // from: Route: 当前导航正要离开的路由
  // next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
  
})
```

##### 全局后置守卫

（在路由跳转之后，需要对页面进行一个初始化的操作，比如dom节点的一些操作，就可以在这个守卫中操作。再比如监听窗口的变化）

```js
router.afterEach((to, from) => {
  // ...
})
```

### 路由懒加载

路由懒加载的优势：提高首页加载的速度、能够将打包之后不同的页面进行分包处理

路由懒加载可以实现在访问的时候去加载对应的组件，并且通过懒加载以及webpack的方式实现代码的分包

```js
const router = new VueRouter({
  routes: [{ path: '/foo', component: () => import('./Foo.vue') }]
})
```

在进行页面跳转的时候，它会单独去引入对应页面中的资源，而不是在懒加载之前一样，在页面打开时加载完毕所有的组件。





### router 3.x与4.x的区别

官方文档 https://router.vuejs.org/zh/guide/migration/index.html


- 3.x使用new VueRouter创建，4.x使用createRouter创建

```js
// 3.x
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})

// 4.x
const router = VueRouter.createRouter({
  routes, // `routes: routes` 的缩写
})
```

- 3.x的路由模式传入的是mode值为'hash'和'history'，4.x传入的是history值为createWebHashHistory()和createWebHistory()
  - url中带#：hash 
  - 没有#：history

```js
// 3.x
const router = new VueRouter({
  mode: 'history', // mode: 'hash'
  routes: [...]
})

// 4.x
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHashHistory(), // history: createWebHistory()
  routes,
})
```

- 3.x的挂载方式是通过router属性来挂载，4.x通过链式操作的方式进行挂载（先通过creatApp的方法创建实例，然后再调用use（router），最后调用mount来完成挂载）

```js
// 3.x
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

// 4.x
createApp(App).use(router).mount('#app')
```







## 学习less

[中文文档地址](https://less.bootcss.com/)

 使用less中的API可以帮助我们快速的编写css代码。

比如使用里面的嵌套、变量和函数来实现css中的封装性

### 变量（便利）

```less
// 变量
// box1的宽度为200px
// box2的宽度为300px
@width1: 200px;
@width2: @width1+200px;
@height: 200px;
.box1 {
  width: @width1;
  color: red;
}

// box2的宽度为300px
.box2 {
  width: @width2; // 使用运算的性质
  color: blue;
}
```



### 混入（实现css代码的复用性）

```less
// 混合
// 定义一个名为clearfix的混合
.common() {
  font-size: 14px;
  color: red;
  border: 1px solid black;
  text-align: center;
  line-height: @height;
}

// 使用混合
.box3 {
  width: @width1;
  height: @height;
  .common();
}
```







### 嵌套（避免了原生css中后代选择器的无限后代）

```less
// 嵌套
// 例如box4和box5存在着嵌套
.box4 {
  width: @width2;
  height: @height*2;
  color: red;
  .common();
  .box5 {
    width: @width1;
    height: @height;
    .common();
    color: blue;
  }
}
```

嵌套实例：实现ul中选中li的样式发生改变

```html
  <ul class="container">
    <li class="list-style">选项1</li>
    <li class="list-style active">选项2</li>
    <li class="list-style">选项3</li>
    <li class="list-style">选项4</li>
    <li class="list-style">选项5</li>
  </ul>
```

```less
.container{
  .list-style{
    font-size: 14px;
    color: red;
    &.active{
      color: blue;
    }
  }
}
```



### 命名空间

命名空间能够解决什么问题？

它能够避免我们css在使用的时候不会被less的mixin选项污染

> // 例如common样式，因为有命名空间的存在，在css的使用过程中就没有导致变量的污染

### 映射

获取到命名空间选项中的某一个具体的属性

```js
// 映射
// 例如box7
.box7{
  font-size: .common[font-size];
  color: .common[color];
}
```

