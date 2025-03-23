# 1. Intro

## 什么是DOM节点？

由HTML文档更新到浏览器组成网页的元素称为DOM节点，我们可以使用js来检索并操作此DOM节点。

- 检索

```js
let item = document.getElementsByTagName("h1")[0];
```

- 操作

```js
item.textContent = "New Heading"; // 修改此DOM的显示文本信息
```



在一个网页中，它可能会有数以千计的DOM节点组成的DOM树。我们可能同时需要各种**更新**数个DOM节点的操作，所以Vue帮我们简化了这一流程。

![image-20250323202541466](https://peak-1316803036.cos.ap-beijing.myqcloud.com/image-20250323202541466.png)

但是进行检索和修改数千个DOM节点的操作会**非常的慢**，所以Vue对于这种情况的处理方式就是**`虚拟DOM`**。



## 什么是虚拟DOM

虚拟DOM是表示DOM的一种方式，它使用JavaScript中对象的表示方式。 

例如：

![image-20250323202931349](https://peak-1316803036.cos.ap-beijing.myqcloud.com/image-20250323202931349.png)

Vue会把`虚拟DOM`挂载到真实DOM上，并检测其中依赖的响应式对象，当其发生变化的时候对DOM进行局部更新，而不是重构整个网页。

### 虚拟DOM是怎么产生的

HTML的节点由Vue根据模版`template`创建一个渲染`render`函数，返回一个虚拟DOM节点。

![image-20250323203501157](https://peak-1316803036.cos.ap-beijing.myqcloud.com/image-20250323203501157.png)

### 真实DOM是怎么进行更新的

当组件发生更改的时候，render函数会重新运行并生成一个新的虚拟DOM，新的虚拟DOM节点会与旧的DOM节点方式会交与Vue进行**比对**处理，以最高效的方式更新到真实的DOM节点中。 

![image-20250323205214401](https://peak-1316803036.cos.ap-beijing.myqcloud.com/image-20250323205214401.png)

### 真实DOM和虚拟DOM的关系

**已经建成的建筑**和**规划建筑建设的蓝图**

当蓝图中有属性发生更改，如房屋中家具的摆放位置发生改变，我们可以有两种方案进行更新建筑。

- 重建大楼。
- 比对新旧蓝图寻找需要更新的位置，进行局部更新。

这就是虚拟DOM的工作原理



## Vue中核心的三大模块

- **响应式模块**：将数据做响应式处理；
- **编译器模块**：将template编译成render function；
- **渲染模块**：
  - **render phase**：render function 返回虚拟DOM
  - **mount phase**：虚拟DOM调用浏览器的DOMAPI挂载到网页上
  - **patch phase**：比较新旧的虚拟DOM，将有变化的反应到网页上

![image-20250323210023172](https://peak-1316803036.cos.ap-beijing.myqcloud.com/image-20250323210023172.png)

### 响应式模块

响应式模块允许我们创建JS对象，并且可以观察其变化。当使用这些对象的代码运行时，它们会被跟踪。所以当响应式对象发生变化时，监听函数就可以在之后进行执行。



### 编译器模块

编译器模块获取HTML模版，并将它们编译成渲染函数（render）。



### 渲染模块 

渲染模块代表了浏览器渲染组件的三个阶段

- 渲染阶段

渲染函数根据模版返回虚拟DOM

- 挂载阶段

通过调用浏览器的DOMAPI来创建网页

- 补丁阶段

新旧虚拟DOM通过比较，只更新网页发生变化的部分。

![image-20250323210750467](https://peak-1316803036.cos.ap-beijing.myqcloud.com/image-20250323210750467.png)



## Vue的工作流

- 将 template 编译成 render function；
- render function 会生成虚拟 DOM，也就是 vNode；
- vNode 经过 Vue 的处理就可以生成真实的 DOM；
- 当数据变化，就生成新的 vNode，与旧的 vNode 进行对比（patch 阶段），将有变化的地方反应到真的的 DOM 上。