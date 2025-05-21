# 4 - Compiler & Renderer API

使用 Vue 3 Template Explorer 就可以看到 Vue 3 把模板编译成了什么样的渲染函数。

一些特性（性能优化，在编译成 render function 时给 compiler 足够的提示，告诉 compiler ，什么需要处理，什么不需要处理）（这也是为什么写 template 比直接写 render 更高效的原因）：

- 标记静态节点（对象只会在初始化的时候创建一次、diff时直接不比较）
- 标记出会动态变化的属性（只检查动态变化的属性，跳过静态的属性）
- 缓存 event （这样 v-on 就不会被标记为动态变化的属性；如果在子组件上写 v-on 事件，在 patch 阶段并不会刷新整个子组件，而 Vue 2 是会的）
- 引入 block 的概念（需要动态更新的节点会被添加到 block 上，无论这个节点有多深；v-if 会开启一个新的 block，这个 block 又被其父 block 跟踪；总的来说就是在 diff 的时候不需要在去深度遍历判断，而是从 block 记录的动态节点数组上，去遍历会变化的 vNode）
- 动态节点的标记有不同的类型（更方便的 diff）

所以，从一个更高的角度来看 Vue 就是想实现：

```html
<div id="app"></div>

<script>
  function h(tag, props, children) {}

  function mount(vnode, container) {}

  const vdom = h('div', { class: 'red' }, [h('span', null, ['hello'])])

  mount(vdom, document.getElementById('app'))
</script>
```

即：h 生成 vdom，将 vdom 挂载到真实 dom 上



render和vdom的关系

```js
 			// render函数生成vdom
      function render() {
        return h("div", [h("div", [h("span", "hello world!")])]);
      }

      // vdom的JSON格式
      const vdom = {
        tag: "div",
        children: [
          {
            tag: "div",
            children: [
              {
                tag: "span",
                children: "hello world!",
              },
            ],
          },
        ],
      };
```

