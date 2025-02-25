# 基础整理vue3
##  组合式API

#### 组合式API的由来？

在vue2项目中，我们会将同一段逻辑的代码放到不同的地方，当我们的组件开始变得更大时，逻辑关注点的列表也会增长，这种写法会造成阅读代码的不便利。

比如现在有一个仓库列表，包含搜索和筛选功能，那么实现组件的代码大概如下

```js
export default {
    props: {
        user: { 
            type: String,
            required: true
        }
    },
    data() {
        return {
            repositories: [],
            filters: { ... },
            searchQuery: ''
        }
    },
    computed: {
        filteredRepositories () { ... }, // 仓库的过滤方法
        repositoriesMatchingSearchQuery () { ... } // 用户表单输入结果的处理方法
    },
    watch: {
        user: 'getUserRepositories'
    },
    methods: {
        getUserRepositories () {
            // 使用 `this.user` 获取用户仓库
        },
    },
    mounted () {
        this.getUserRepositories()
    }
}
```

组件包含的功能

1. 从假定的外部 API 获取该用户的仓库，并在用户有任何更改时进行刷新
2. 使用 searchQuery 字符串搜索仓库
3. 使用 filters 对象筛选仓库

可以看出代码的逻辑是分散的，为了解决这个问题，vue3新增了组合式 API通过这种方法可以把相同逻辑的代码放在一起，便于维护和阅读。

##### setup使用方法介绍

1. 返回一个函数，该函数将作为组件的render函数：

```js
// MyBook.vue

import { h, ref, reactive } from 'vue'

export default {
  setup() {
    const readersNumber = ref(0)
    const book = reactive({ title: 'Vue 3 Guide' })
    // 请注意这里我们需要显式使用 ref 的 value
    return () => h('div', [readersNumber.value, book.title])
  }
}
```

2. 返回一个对象，该对象中包含的数据将暴露给模板使用

```html
<!-- MyBook.vue -->
<template>
  <div>{{ collectionName }}: {{ readersNumber }} {{ book.title }}</div>
</template>

<script>
  import { ref, reactive } from 'vue'

  export default {
    props: {
      collectionName: String
    },
    setup(props) {
      const readersNumber = ref(0)
      const book = reactive({ title: 'Vue 3 Guide' })

      // 暴露给 template
      return {
        readersNumber,
        book
      }
    }
  }
</script>
```

上述的代码使用setup应该如何改写？

```js
export default {
    props: {
        user: { 
            type: String,
            required: true
        }
    },
    data() {
        return {
            repositories: [],
            filters: { ... },
            searchQuery: ''
        }
    },
    computed: {
        filteredRepositories () { ... }, // 仓库的过滤方法
        repositoriesMatchingSearchQuery () { ... } // 用户表单输入结果的处理方法
    },
    watch: {
        user: 'getUserRepositories'
    },
    methods: {
        getUserRepositories () {
            // 使用 `this.user` 获取用户仓库
        },
    },
    mounted () {
        this.getUserRepositories()
    }
}
```

setup修改后

```js
import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted, watch, toRefs, computed } from 'vue'
export default {
    // props: {
    //     user: { 
    //         type: String,
    //         required: true
    //     }
    // },
    data() {
        return {
            filters: { ... },
            searchQuery: ''
        }
    },
    setup(props) {
      const { user } = toRefs(props)
      let repositories = ref([])
      const getUserRepositories = async () => {
        repositories.value = await fetchUserRepositories(user)
      }
      onMounted(getUserRepositories)
      watch(user, getUserRepositories)
      const filteredRepositories = computed(() => {
        // 仓库的过滤方法
      })
      const repositoriesMatchingSearchQuery = computed(() => {
        // 用户表单输入结果的处理方法
      })
      return {
        repositories,
        getUserRepositories,
        filteredRepositories,
        repositoriesMatchingSearchQuery
      }
    },
}
```

在 setup 内注册生命周期钩子
![生命周期函数](https://peak-1316803036.cos.ap-beijing.myqcloud.com/01.png)


##### 单文件组件 script setup

script setup 是在单文件组件 (SFC) 中使用组合式 API 的编译时语法糖。相比于普通的 script 语法，它具有更多优势

- 更少的样板内容，更简洁的代码。
- 能够使用纯 TypeScript 声明 props 和抛出事件。
- 更好的运行时性能 (其模板会被编译成与其同一作用域的渲染函数，没有任何的中间代理)。
- 更好的 IDE 类型推断性能 (减少语言服务器从代码中抽离类型的工作)

```js
<script setup>
  console.log('hello script setup')
</script>
```

**注意：普通的script只会在组件首次引入的时候执行一次，script setup会在每次组件实例被创建的时候执行**





### 面试题：组合式API与选项式API的区别

写法：

后期项目维护，大型项目组合式API占优势





## Ref与reactive

#### 组合式API

##### ref()

用来定义响应式数据，可以接收一个基本数据类型或者引用数据类型作为参数，返回一个**对象**。

```js
const a = ref('hello')
const obj = ref({})
```

对于基本类型通过.value获取到原始值，对于引用类型.value返回的是调用reactive的返回值。

```js
const initial = {}
const data = ref(initial)
console.log(data.value === reactive(initial)) // true
```

要实现页面响应式的变化，如果是基本数据类型通过**.value**直接赋值就可以。如果是引用数据类型，可以修改内部的属性，也可以整体赋值。

##### reactive()

用来定义响应式数据，只能接收引入数据类型，返回一个**proxy**。

不能对内部的数据进行解构，否则会丢失响应式。
不能对reactive数据整体赋值，否则会丢失响应式。



> 其中通过ref或者reactive处理返回的对象中的带__的属性，它是对响应式数据的一种描述

![](https://peak-1316803036.cos.ap-beijing.myqcloud.com/%E6%88%AA%E5%B1%8F2024-05-12%2010.16.33.png)





## toRef和toRefs

这两个方法都能够提取到响应式数据中的属性，也都能一个响应式对象上创建一个新的变量

##### toRef

可以传入一个基本数据类型或者引用数据类型，用法类似于ref().

```js
const numberRef = toRef(1)
const objRef = toRef({})
```

也可以基于响应式对象上的一个属性，创建一个对应的 ref.

```js
const data = {count: 1}
const o = reactive(data)
// let { count } = o // 修改count不会触发响应式
const count = toRef(o, 'count')
// count.value++会修改原始数据
```

toRef可以传入一个对象：返回一个响应式对象



##### toRefs

可以传入一个响应式对象，然后把所有的的响应式属性返回成一个对象，而不是proxy

接收一个对象，返回一个普通对象。对象上每个属性都是指向源对象相应属性的 ref.

```js
// 传入一个对象
const data = {count: 1}
const o = reactive(data)
const { count } = toRefs(o)
```

对返回数据的修改会影响到原始数据

```js
// 上述例子修改count后data也会受到影响
count.value++
```





## watch和watchEffect

#### 组合式API

##### watch()

用来监听数据变化，默认是懒监听，watch调用有三个参数，第一个是监听的数据，数据包含以下几种情况：

- 一个ref
- 一个响应式对象（ref返回的对象不会开启深度监听，需要手动添加）
- 一个函数，返回一个值
- 由上述类型的值组成的数组

```js
/**
 * 一个ref
 */
const count = ref(0)
const handleChange = () => {
    count.value++
}
watch(count, (val, oldVal) => {
    console.log(val, oldVal)
})
/**
 * 一个响应式对象
 */
const userInfo = reactive({
    name: '张三',
    info: {
        age: 18,
        mobile: '13797053405'
    }
})
const handleChange = () => {
    userInfo.value.name = '李四'
}
// 当直接监听一个响应式对象时，监听器会自动启用深层模式
watch(userInfo, (val) => {
    console.log(val)
})
// 等价于
watch(userInfo, (val) => {
    console.log(val)
}, { deep: true })
// ----------------------------
watch(userInfo, (val, oldVal) => {
    // 新的值和旧的值一样 两个引用的同一个地址
    console.log(val === oldVal)
})
/**
 * 一个函数，返回一个值，用于监听响应式对象中的某一个属性
 */
const userInfo = reactive({
    name: '张三',
    info: {
        age: 18,
        mobile: '13797053405'
    }
})
// 需要监听userInfo其中的一个属性
watch(() => userInfo.name, (val, oldVal) => {
    // 当userInfo的name变化，函数会触发
})
/**
 * 由上述类型的值组成的数组
 */
// 当监听多个来源时，回调函数接受两个数组，分别对应来源数组中的新值和旧值
watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
  /* ... */
})
```

第二个参数是数据发生变化后的回调函数，该函数接收三个参数：新值、旧值，以及一个用于注册副作用清理的回调函数。

第三个可选的参数是一个对象，支持以下这些选项：

- immediate：在监听器创建时立即触发回调。
- deep：如果源是对象，强制深度遍历，以便在深层级变更时触发回调。

##### watchEffect()

立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行。可以对所有的响应式数据进行监听，并且不能监听响应式对象，并在页面首次加载的时候就会触发

- 第一个参数就是要运行的副作用函数。
- 第二个参数是一个可选的选项

```js
// 公里数
const num = ref(0)
// 燃油箱存量
const ml = ref(50)
const handleNum = () => {
    num.value += 1000
}
const handleMl = () => {
    ml.value -= 10
}
// 注意：不能监听响应式对象
watchEffect(() => {
    console.log('打印')
    if (ml.value < 10 || num.value > 5000) {
        alert('报警')
    }
})
```







## cumputer计算属性

#### 组合式API

##### computed()

接受一个 getter 函数，返回一个只读的响应式 ref 对象，也可以接受一个带有 get 和 set 函数的对象来创建一个可写的 ref 对象。

```js
const count = ref(1)
const plusOne = computed(() => count.value + 1)

console.log(plusOne.value) // 2

plusOne.value++ // 错误
```

计算属性默认是只读的，如果需要去修改计算属性的同时处理副作用，那么就需要用到 getter 和 setter 来创建。

```js
const plusOne = computed({
  get() {
    return count.value + 1
  },
  set() {
    count.value++
    if (count.value === 5) {
      alert('做点其他的事情')
    }
  }
})
```


##### 计算属性使用场景

- 根据响应式变量衍生出其他的属性（在订单页面计算总价格，总数量）

```html
<div class="container">
  <label for="number">人民币：</label>
  <input type="number" v-model="inputNumber" />
  <p>美元：{{ dollar }} $</p>
  <p>日元：{{ yen }} ￥</p>
</div>
```

```js
const inputNumber = ref(0)
const dollar = computed(() => {
  return (inputNumber.value * 0.14).toFixed(2)
})
const yen = computed(() => {
  return (inputNumber.value * 20.56).toFixed(2)
})
```

- 根据响应式对象派生出其他的属性（依赖于多个数据）

```html
<div class="container">
  <div class v-for="(item, index) in reactiveData" :key="index">
  <p>数量：{{ item.num }} 个</p>
  <p>
    <label for="number">价格：</label>
    <input type="number" v-model="item.price" />
  </p>
  </div>
</div>
<p>总价：{{ total }}</p>
```

```js
const reactiveData = reactive([{num: 1, price: 2}, {num: 2, price: 3}])
const total = computed(() => {
  return reactiveData.reduce((total, cur) => {
    return total + cur.num * cur.price
  }, 0)
})
```

- 根据多个响应式数据组装成新的数据

```html
<div class="container">
  <p>
    <label for="number">firstName：</label>
    <input v-model="firstName" />
  </p>
  <p>
    <label for="number">lastName：</label>
    <input v-model="lastName" />
  </p>
  <h1>{{ fullName }}</h1>
</div>
```

```js
const firstName = ref('San')
const lastName = ref('Zhang')
const fullName = computed(() => lastName.value + ' ' + firstName.value)
```





## defineProps()和defineEmits()

>  Props在vue中是单向数据流，在常规语法中只能实现单向通信，在子组件中不能对Props中的数据直接修改（直接修改也就是赋值，也可以说是修改数据源即更改数据以及地址 ）

> 单向数据流:父级 prop 的更新会向下流动到子组件中，但是反过来则不行。

##### defineProps()

接收一个数组里面包含对应prop的字符串(用来接受父组件中传过来的属性)

```js
<script setup>
  const props = defineProps(['data'])
  console.log(props.data)
</script>
```

在没有使用 \<script setup> 的组件中，prop 可以使用 props 选项来声明（在setup函数中不能使用props）

```js
export default {
  props: ['data'],
  setup(props) {
    // setup() 接收 props 作为第一个参数
    console.log(props.data)
  }
}
```

还可以使用对象的形式

```js
// 对传入的prop进行校验
defineProps({
  title: String,
  likes: Number
})
```

##### defineEmits()

通过传入一个数组声明它要触发的事件

```js
<script setup>
  const emit = defineEmits(['inFocus', 'submit'])

  function buttonClick() {
    emit('submit')
  }
</script>
```

在没有使用 \<script setup> 的组件中，需要通过 emits 选项来定义

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, ctx) {
    ctx.emit('submit')
  }
}
```

> ctx表示传入的上下文





### 项目应用场景

父组件：传入商品数据（价格、数量）、订单状态。

子组件：点击支付完成订单（改变订单状态）、更改订单商品的信息（如数量），并将这些数据传入给父组件。

![](https://peak-1316803036.cos.ap-beijing.myqcloud.com/%E6%88%AA%E5%B1%8F2024-05-15%2019.53.03.png)

可以使用toRaw将Proxy转化为普通对象





## 渲染器

虚拟DOM的本质就是一个javascript对象，这个对象中包含着页面上渲染的内容的描述

##### 声明式描述UI

声明式框架编写前端页面涉及的内容

1. DOM元素：例如是div标签还是a标签
2. 属性：如 a 标签的href属性，再加上id class等属性
3. 事件：如 click change
4. 元素的层级结构：DOM树的层级结构，既有子节点，又有父节点

通过框架来实现的方法

1. 使用与HTML一致的方法来描述DOM元素，比如div标签可以使用&#60;div&#62;&#60;/div&#62;
2. 使用与HTML一致的方法来描述属性，例如&#60;div id="app"&#62;&#60;/div&#62;
3. 使用：或v-bind来描述动态绑定的属性，例如&#60;div id="dynamicId"&#62;&#60;/div&#62;
4. 使用@或v-on来描述事件，例如点击事件&#60;div @click="handler"&#62;&#60;/div&#62;
5. 使用与HTML一致的方法来描述层级结构，例如一个具有 span 子节点的div标签&#60;div&#62;&#60;span&#62;&#60;/span&#62;&#60;/div&#62;

除了可以使用**模板**声明式的描述ui，还可以使用**javascript对象**来进行描述（虚拟DOM的表示 ）

```js
const title = {
    // 标签名称
    tag: 'h1',
    // 标签属性
    props: {
        onClick: handler
    },
    // 子节点 层级结构
    children: [
        { tag: 'span' }
    ]
}
```

javascript对象和描述UI的区别在于js对象描述UI更加灵活。比如我们要表示一个标题，根据标题级别不同，会分别渲染h1-h6这几个标签，思考下应该如何来写？



<details>
<summary>HTML来描述UI</summary>
<pre>
<code>
&#60;h1 v-if="level === 1"&#62;&#60;/h1&#62;
&#60;h2 v-else-if="level === 2"&#62;&#60;/h2&#62;
&#60;h3 v-else-if="level === 3"&#62;&#60;/h3&#62;
&#60;h4 v-else-if="level === 4"&#62;&#60;/h4&#62;
&#60;h5 v-else-if="level === 5"&#62;&#60;/h5&#62;
&#60;h6 v-else-if="level === 5"&#62;&#60;/h6&#62;
</code>
</pre>
</details>
<details>
<summary>javascript对象来描述</summary>
<pre>
<code>
let level = 3
const title = {
    tag: `h${level}`
}
</code>
</pre>
</details>
<br/>
可以发现，使用js对象来描述UI更加的灵活。“这种对象”在vue框架中被称为**虚拟DOM**，渲染函数内部可以创建虚拟DOM，然后vue.js可以将其内容进行渲染。

##### 渲染器的介绍

渲染器的作用就是把虚拟DOM渲染为真实DOM
![渲染过程](https://peak-1316803036.cos.ap-beijing.myqcloud.com/01.png)

思考下，我们有一个虚拟 DOM，如何将它转换为真实 DOM

```js
const vnode = {
    tag: 'div',
    props: {
        onClick: () => alert('hello')
    },
    children: 'click me'
}
```

实现渲染函数renderer

```js
/**
 * @vnode 虚拟 DOM 对象
 * @container 一个真实 DOM 元素，作为挂载点，渲染器会把虚拟 DOM 渲染到该挂载点
 */
function renderer(vnode, container) {
    // 使用vnode.tag作为创建的dom标签
    const el = document.createElement(vnode.tag)
    // 遍历vnode.props，将属性 事件添加到DOM上
    for (const key in vnode.props) {
        // 如果是事件
        if (/^on/.test(key)) {
            el.addEventListener(
                // 事件名称 onClick 转为 click
                key.substr(2).toLowerCase(),
                vnode.props[key] // 处理函数
            )
        }
    }

    // 处理 children
    if (typeof vnode.children === 'string') {
        // 如果 children 是字符串，说明它是元素的文本子节点
        el.appendChild(document.createTextNode(vnode.children))
    } else if (Array.isArray(vnode.children)) {
        // 递归的方式调用 renderer 函数渲染子节点，挂载在 el 元素下
        vnode.children.forEach(child => renderer(child, el))
    }

    // 将元素添加到挂载节点下
    container.appendChild(el)
}
```



‘

## 组件的本质

##### 组件的本质

**组件就是一组 DOM 元素的封装**，本质就是一个对象

如何利用javascript来描述一个组件？

```js
const MyComponent = {
    render() {
        return {
            tag: 'div',
            props: {
                onClick: () => alert('hello')
            },
            children: 'click Me'
        }
    }
}

const vnode = {
    tag: MyComponent
}
```

如何修改渲染器的内容？

```js
function renderer(vnode, container) {
    // 判断当前的tag的类型，如果是对象，说明vnode tag描述的是组件
    if (typeof vnode.tag === 'string') {
        mountElement(vnode, container)
    } else if (typeof vnode.tag === 'object') {
        // vnode.tag是组件对象，调用它的render函数得到组件的渲染内容（虚拟 DOM）
        const subtree = vnode.tag.render()
        renderer(subtree, container)
    }
}

function mountElement(vnode, container) {
    // 使用vnode.tag作为标签名称创建 DOM 元素
    const el = document.createElement(vnode.tag)
    // 遍历 vnode.props，将属性 事件添加到 DOM 元素
    for (const key in vnode.props) {
        if (/^on/.test(key)) {
            // 如果key以on开头，说明它是事件
            el.addEventListener(
                // 事件名称 onClick 转为 click
                key.substr(2).toLowerCase(),
                vnode.props[key] // 事件处理函数
            )
        }
    }

    // 处理 children
    if (typeof vnode.children === 'string') {
        // 如果 children 是字符串，说明它是元素的文本子节点
        el.appendChild(document.createTextNode(vnode.children))
    } else if (Array.isArray(vnode.children)) {
        // 递归地调用 renderer 函数渲染子节点，使用当前元素 el 作为挂载点
        vnode.children.forEach(child => renderer(child, el))
    }

    // 将元素添加到挂载点下
    container.appendChild(el)
}
```





## 响应式原理

#### 响应式原理

##### 命令式和声明式框架

**思考一个问题**
页面中存在一个按钮，点击后将div内的文案修改为“你好”

```html
<body>
    <div>hello world</div>
    <button>按钮</button>
</body>
```

<details>
<summary>命令式代码实现</summary>
<pre>
<code>
&nbsp;
    const div = document.getElementsByTagName('div')[0]
    const btn = document.getElementsByTagName('button')[0]
    btn.onclick = function () {
        div.innerText = '你好'
    }
</code>
</pre>
</details>
<details>
<summary>声明式代码实现</summary>
<pre>
<code>
&nbsp;
    &lt;body&gt;
        &lt;div&gt;{{text}}&lt;/div&gt;
        &lt;button @click="() => { text = '你好' }">按钮&lt;/button&gt;
    &lt;/body&gt;
    &lt;script>
    export default {
        data() {
            return {
                text: 'hello world'
            }
        }
    }
    &lt;/script&gt;
&nbsp;
</code>
</pre>
</details>


命令式框架关注过程
声明式框架关注结果

##### 双向绑定的实现

```html
<body>
    <div id="app">
        <input type="text" />
        <h1></h1>
        <button>按钮</button> 
    </div>
</body>
<script>
    const input = document.getElementsByTagName('input')[0]
    const h1 = document.getElementsByTagName('h1')[0]
    const btn = document.getElementsByTagName('button')[0]
    var data = { text: '' }
</script>
```

##### 响应式数据的基本实现

```js
const data = { text: '' }
function effect () {
    document.body.innerText = data.text
}
```

**响应式数据的关键是拦截对象属性的设置和读取操作**

##### vue2与vue3响应式数据实现区别

vue2的实现：当你把一个普通的 JavaScript 对象传入 Vue 实例作为 data 选项，Vue 将遍历此对象所有的 property，并使用 **Object.defineProperty** 把这些 property 全部转为 getter/setter。

vue3的实现：当我们从一个组件的 data 函数中返回一个普通的 JavaScript 对象时，Vue 会将该对象包裹在一个带有 get 和 set 处理程序的 **Proxy** 中

区别在于defineProperty是对对象的某个属性来进行响应式处理，在后期当前对象新增的属性会丢失响应式的属性，而proxy是对一个对象进行监听，将这个对象里面所有的属性都增加了响应式的性质 


vue3 proxy的实现

```js
// 初始数据
const data = { text: '' }
// 存储副作用函数的桶
const bucket = new Set()
// 对数据进行代理
const obj = new Proxy(data, {
    get(target, key) {
        bucket.add(effect)
        return target[key]
    },
    set(target, key, newVal) {
        target[key] = newVal
        bucket.forEach(fn => fn())
        return true
    }
})

function effect () {
    document.body.innerText = obj.text
}

effect()

setTimeout(() => {
    obj.text = '你好'
}, 1000)
```

思考一下 这一段代码的问题

1. 副作用函数的名称被写死（函数的重命名，利用了闭包的性质）

```js
let activeEffect

function effect(fn) {
    activeEffect = fn
    fn()
}

effect(() => {
    document.body.innerText = obj.text
})

const obj = new Proxy(data, {
    get(target, key) {
        if (activeEffect) {
            bucket.add(activeEffect)
        }
        return target[key]
    },
    set(target, key, newVal) {
        target[key] = newVal
        bucket.forEach(fn => fn())
        return true
    }
})
```

2. 没有建立副作用函数和目标字段之前明确的关系

```js
const obj = new Proxy(data, {
    get(target, key) {
        console.log(activeEffect, 'activeEffect')
        // 没有副作用函数，容错处理 直接return
        if (!activeEffect) return target[key]
        // 判断桶中是否已经存在key与target的关联关系
        let depsMap = bucket.get(target)
            // 创建一个新的Map结构与 target 关联
        if (!depsMap) {
            bucket.set(target, (depsMap = new Map()))
        }
        // 判断当前Map数据中是否存在key与effect的关联关系
        let deps = depsMap.get(key)
        // 不存在的话 则新建一个Set 与 key关联
        if (!deps) {
            depsMap.set(key, (deps = new Set()))
        }
        // 最后将当前激活的副作用函数添加到bucket中
        deps.add(activeEffect)
        return target[key]
    },
    set (target, key, newVal) {
        target[key] = newVal

        // 获取bucket下对应的数据
        const depsMap = bucket.get(target)
        if (!depsMap) return
        // 根据key 获取副作用的执行函数
        const effects = depsMap.get(key)
        // 执行副作用函数
        effects && effects.forEach(fn => fn())
    }
})

effect(() => {
    document.body.innerText = obj.text
})
effect(() => {
    document.title = obj.a
})
```







## 简单diff算法

#### Diff算法介绍

在vue中用于比较新旧vnode的子节点都是一组节点时，为了以最小的性能开销完成更新，需要比较两个子节点，用与比较的算法就叫作diff算法。

##### 简单diff算法

看一个例子，通过这组虚拟节点进行更新的步骤

```js
const oldVNode = {
    type: 'div',
    children: [
        { type: 'p', children: '1' },
        { type: 'p', children: '2' },
        { type: 'p', children: '3' }
    ]
}
const newVNode = {
    type: 'div',
    children: [
        { type: 'p', children: '4' },
        { type: 'p', children: '5' },
        { type: 'p', children: '6' }
    ]
}
```

<details>
<summary>代码实现</summary>
<pre>
<code>
function patchChildren(n1, n2) {
    if (typeof n2.chilren === 'string') {
        // 省略部分代码
    } else if (Array.isArray(n2.children)) {
        // 更新逻辑
        const oldChildren = n1.children
        const newChildren = n2.children
        for (let i = 0; i < newChildren.length; i++) {
            // 更新子节点
            patch(oldChildren[i], newChildren[i])
        }
    } else {
        // 省略部分代码
    }
}
</code>
</pre>
</details>


##### 如果节点的个数对不上怎么解决？

![截屏2024-05-16 14.27.15](https://peak-1316803036.cos.ap-beijing.myqcloud.com/%E6%88%AA%E5%B1%8F2024-05-16%2014.27.15.png)

```js
function patchChildren(n1, n2) {
    if (typeof n2.chilren === 'string') {
        // 省略部分代码
    } else if (Array.isArray(n2.children)) {
        // 更新逻辑
        const oldChildren = n1.children
        const newChildren = n2.children
        // 旧节点的长度
        const oldlen = oldChildren.length
        // 新节点的长度
        const newlen = newChildren.length

        const commonLength = Math.min(oldlen, newlen)

        for (let i = 0; i < commonLength; i++) {
            // 更新节点
            patch(oldChildren[i], newChildren[i])
        }
        // newlen > oldlen, 需要挂载
        if (newlen > oldlen) {
            for (let i = commonLength; i < newlen; i++) {
                patch(null, newChildren[i])
            }
        } else if (oldlen > newlen) {
            // oldlen > newlen, 需要卸载
            for (let i = commonLength; i < oldlen; i++) {
                unmount(null, newChildren[i])
            }
        }
    } else {
        // 省略部分代码
    }
}
```

patch方法用来更新新旧节点



##### 如果虚拟节点的顺序发生变化怎么解决？

```js
// type不同的虚拟节点
// oldVNode
[
    { type: 'p' },
    { type: 'div' },
    { type: 'span' },
]
// newChildren
[
    { type: 'span' },
    { type: 'p' },
    { type: 'div' },
]
// type相同数据不同的虚拟节点
// oldVNode
[
    { type: 'p', children: '1' },
    { type: 'p', children: '2' },
    { type: 'p', children: '3' }
]
// newChildren
[
    { type: 'p', children: '3' },
    { type: 'p', children: '2' },
    { type: 'p', children: '1' }
]
```

![虚拟节点对比2](https://peak-1316803036.cos.ap-beijing.myqcloud.com/03.png)

##### 思路分析

第一步：取新的一组子节点中的第一个节点p-3，它的key为3。尝试在旧的一组子节点中找到具有相同key值的可复用节点，如果能找到，记录旧子节点中当前节点的索引为2

第二步：取新的一组子节点中的第二个节点p-1，它的key为1。尝试在旧的一组子节点中找到具有相同key值的可复用节点，如果能找到，记录旧子节点中当前节点的索引为0

此时索引值的递增顺序被打破。节点p-1在旧children中的索引是0，它小于节点p-3在旧children中的索引2。**说明p-1在旧children中排在节点p-3前面，但在新的children中，他排在节点p-3后面。** 所以，我们得到结论：**节点p-1对应的真实DOM需要移动**。

第三步：取新的一组子节点中的第二个节点p-2，它的key为2。尝试在旧的一组子节点中找到具有相同key值的可复用节点，如果能找到，记录旧子节点中当前节点的索引为1

同理，**节点p-2在旧children中排在节点p-3前面，但在新的children中，它排在节点p-3后面。因此，节点p-2对应的真实DOM也需要移动**

此时索引值的递增顺序被打破。节点p-1在旧children中的索引是0，它小于节点p-3在旧children中的索引2。**说明p-1在旧children中排在节点p-3前面，但在新的children中，他排在节点p-3后面。** 所以，我们得到结论：**节点p-1对应的真实DOM需要移动**。

```js
function patchChildren(n1, n2) {
    if (typeof n2.chilren === 'string') {
        // 省略部分代码
    } else if (Array.isArray(n2.children)) {
        // 更新逻辑
        const oldChildren = n1.children
        const newChildren = n2.children
        
        // 用来存储寻找过程中最大的索引值
        let lastIndex = 0
        for (let i = 0; i < newChildren.length; i++) {
            const newVNode = newChildren[i]
            for (let j = 0; j < oldChildren.length; j++) {
                const oldVNode = oldChildren[i]
                if (newVNode.key === oldVNode.key) {
                    patch(oldVNode, newVNode)
                    if (j < lastIndex) {
                        // 如果当前找到的节点在旧Children中的索引小于lastIndex
                        // 说明我们的当前节点对应的真实dom是需要移动的
                    } else {
                        lastIndex = j
                    }
                }
                break;
            }
        }
    } else {
        // 省略部分代码
    }
}
```

##### 如何移动元素？

![虚拟节点对比3](https://peak-1316803036.cos.ap-beijing.myqcloud.com/04.png)

##### 思路分析

第一步：首先将旧子节点上的真实dom赋值给对应新节点的dom

第二步：找到需要移动的虚拟节点，将它上一个虚拟节点对应的真实DOM的下一个兄弟节点作为锚点

第三步：将当前虚拟节点对应的真实dom移动到锚点位置

```js
function patchChildren(n1, n2) {
    if (typeof n2.chilren === 'string') {
        // 省略部分代码
    } else if (Array.isArray(n2.children)) {
        // 更新逻辑
        const oldChildren = n1.children
        const newChildren = n2.children
        
        // 用来存储寻找过程中最大的索引值
        let lastIndex = 0
        for (let i = 0; i < newChildren.length; i++) {
            const newVNode = newChildren[i]
            for (let j = 0; j < oldChildren.length; j++) {
                const oldVNode = oldChildren[i]
                if (newVNode.key === oldVNode.key) {
                    patch(oldVNode, newVNode)
                    if (j < lastIndex) {
                        // 如果当前找到的节点在旧Children中的索引小于lastIndex
                        // 说明我们的当前节点对应的真实dom是需要移动的

                        // 先获取当前newVNode的上一个节点
                        const prevVNode = newChildren[i - 1]
                        if (prevVNode) {
                            // 如果prevVNode不存在，说明prevVNode就是第一个，不需要移动
                            const anchor = prevVNode.el.nextSibling
                            insert(newVNode.el, anchor)
                        }
                    } else {
                        lastIndex = j
                    }
                }
                break;
            }
        }
    } else {
        // 省略部分代码
    }
}
```





## 双端diff算法

#### 双端diff算法

![简单diff案例](https://peak-1316803036.cos.ap-beijing.myqcloud.com/g01.png)
在上述例子中，使用简单diff算法真实 DOM 节点会**移动两次**，但是实际上通过简单的观察可以发现只需要移动一次p-3就可以。
![简单diff案例](https://peak-1316803036.cos.ap-beijing.myqcloud.com/g02.png)

所以得出结论：简单diff算法的性能在某些场景下并不是最好的。对于上述的例子，使用双端diff算法的性能会更高。

##### 双端diff算法比较原理

双端diff是一种对新旧两组子节点的端点进行比较的算法。

```js
// oldChildren
[
    {type: 'p', children: '1'},
    {type: 'p', children: '2'},
    {type: 'p', children: '3'},
    {type: 'p', children: '4'}
]

// newChildren
[
    {type: 'p', children: '4'},
    {type: 'p', children: '2'},
    {type: 'p', children: '1'},
    {type: 'p', children: '3'}
]
```

![双端diff案例](https://peak-1316803036.cos.ap-beijing.myqcloud.com/d01.png)

在双端比较中，每一轮比较都分为四个步骤。

- 第一步：比较旧的一组子节点中的第一个子节点 p-1 与新的一组子节点中的第一个子节点 p-4，看它们是否相同。这里不相同，什么都不做。

- 第二步：比较旧的一组子节点中的最后一个子节点 p-4 与新的一组子节点中的最后一个子节点 p-3，看它们是否相同。这里不相同，什么都不做。

- 第三步：比较旧的一组子节点中的第一个子节点 p-1 与新的一组子节点中的最后一个子节点 p-3，看它们是否相同。这里不相同，什么都不做。

- 第四步：比较旧的一组子节点中的最后一个子节点 p-4 与新的一组子节点中的第一个子节点 p-4。由于它们key相同，所以可以进行 DOM 复用。

思考下，p-4节点所对应的真实 DOM 此时应该如何移动？代码如何实现？

![双端diff案例](https://peak-1316803036.cos.ap-beijing.myqcloud.com/d02.png)
![双端diff案例](https://peak-1316803036.cos.ap-beijing.myqcloud.com/d03.png)

```js
/*
* n1 旧的一组子节点
* n2 新的一组子节点
* container 真实 DOM 的锚点
*/
function patchKeyedChildren(n1, n2, container) {
    const oldChildren = n1.children
    const newChildren = n2.children

    // 端点的索引
    let oldStartIdx = 0
    let oldEndIdx = oldChildren.length - 1
    let newStartIdx = 0
    let newEndIdx = newChildren.length - 1

    // 四个端点索引对应的 vnode 节点
    let oldStartVNode = oldChildren[oldStartIdx]
    let oldEndVNode = oldChildren[oldEndIdx]
    let newStartVNode = newChildren[newStartIdx]
    let newEndVNode = newChildren[newEndIdx]

    // 双端比较
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (!oldStartVNode) {
            oldStartVNode = oldChildren[++oldStartIdx]
        } else if (!oldEndVNode) {
            newEndVNode = oldChildren[--oldEndIdx]
        } else if (oldStartVNode.key === newStartVNode.key) {
            // 节点在新的顺序中都处于头部， DOM 不需要移动的
            // 更新索引
            oldStartVNode = oldChildren[++oldStartIdx]
            newStartVNode = newChildren[++newStartIdx]
        } else if (oldEndVNode.key === newEndVNode.key) {
            // 节点在新的顺序中都处于尾部，DOM 不需要移动的
            // 更新索引尾部节点的变量
            oldEndVNode = oldChildren[--oldEndIdx]
            newEndVNode = newChildren[--newEndIdx]

        } else if (oldStartVNode.key === newEndVNode.key) {
            // 移动 DOM 操作
            // oldStartVNode.el 移动到 oldEndVNode.el.nextSibling
            insert(oldStartVNode.el, container, oldEndVNode.el.nextSibling)
            // DOM 移动完成后，更新索引值，然后指向下一个位置
            oldStartVNode = oldChildren[++oldStartIdx]
            newEndVNode = newChildren[--newEndIdx]
        } else if (oldEndVNode.key === newStartVNode.key) {
            // 移动 DOM 操作
            // oldEndVNode.el 移动到 oldStartVNode.el 前面
            insert(oldEndVNode.el, container, oldStartVNode.el)
            oldEndVNode = oldChildren[--oldEndIdx]
            newStartVNode = newChildren[++newStartIdx]
        } else {
            // 遍历旧的一组子节点，找到newStartVNode拥有相同key的元素
            const idxInOld = oldChildren.findIndex(node => node.key === newStartVNode.key)
            // idxInOld 大于 0，说明找到了可复用的节点，并且需要将对应的真实 DOM 移动到头部
            if (idxInOld > 0) {
                // idxInOld 对应旧子节点中需要移动的节点
                const vnodeToMove = oldChildren[idxInOld]
                // 将 vnodeToMove.el 移动到头部节点 oldStartVNode 前面
                insert(vnodeToMove.el, container, oldStartVNode.el)
                // idxInOld 处的节点对应的真实 DOM 已经处理过，这里设置为undefined
                oldChildren[idxInOld] = undefined
                // 更新新子节点头部节点的指针
                newStartVNode = newChildren[++newStartIdx]
            }
        }
    }
}
```

##### 非理想状况的处理方式

在进行双端比较中，可能会出现第一轮比较时，无法找到可以复用的节点。
![双端diff案例](https://peak-1316803036.cos.ap-beijing.myqcloud.com/d04.png)
在这种情况下，需要尝试非头部，尾部的节点能否复用。可以用新的一组子节点去旧的一组子节点去寻找。
![双端diff案例](https://peak-1316803036.cos.ap-beijing.myqcloud.com/d05.png)
这里拿新的一组子节点的头部节点p-2去旧的一组子节点中查找时，会在索引为1的位置找到可复用的节点。说明p-2旧子节点对应的真实 DOM 需要移动到旧子节点 p-1 所对应的真实 DOM 之前。
![双端diff案例](https://peak-1316803036.cos.ap-beijing.myqcloud.com/d06.png)
已经处理过的旧子节点后续不用继续比较，这里设置为undefined。然后开始进行双端比较。在这一轮的比较第四步，找到了可复用的节点。所以将真实 DOM 中的p-4移动到p-1的前面，并且更新对应指针。
![双端diff案例](https://peak-1316803036.cos.ap-beijing.myqcloud.com/d07.png)
在这一轮比较的第一步就找到了可复用的节点，不需要移动 DOM 节点，并更新指针。
![双端diff案例](https://peak-1316803036.cos.ap-beijing.myqcloud.com/d08.png)
在这一轮比较中发现旧子节点中头部节点为undefined。不用比较，直接跳过。
![双端diff案例](https://peak-1316803036.cos.ap-beijing.myqcloud.com/d09.png)
继续进行比较，发现第一轮比较就可以找到复用节点。不需要移动 DOM，更新指针。这时满足循环停止条件，双端比较结束。

思考下，以上内容转变为代码将如何编写？