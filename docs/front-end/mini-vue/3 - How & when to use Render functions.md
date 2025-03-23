# 3 - How & when to use Render functions

## render中指令的实现

v-if --> `if` / `?:`

v-for --> `list.map(() => {return h(...)})`



### render实现的本质

就是说 render 函数里是纯粹的 javascript 语句。



### 什么时候去使用render

如果你觉得使用 template 无法满足你想要表达的逻辑，使用 javascript 能够更好地组织你要写的代码的时候，你可以尝试使用 render 函数。

也就是说，日常开发，你可以用 template，因为他更简单直观，并且 Vue 在编译的时候做了很好地优化，如果你在开发一些底层组件，逻辑比较复杂的时候，就可以使用 render。

以下是一个使用 render 函数的例子，使用 render 函数，给 Stack 组件的所有子元素都包裹在一个 div 中，可以看到使用 render 函数去实现是比较简单的方法，相较于 template。

```html
<script src="https://unpkg.com/vue"></script>
<style>
  .mt-4 {
    margin: 10px;
  }
</style>

<div id="app"></div>

<script>
  const { h, createApp } = Vue

  // 定义 Stack 组件
  const Stack = {
    props: ['size'], // 视频中尤大貌似没有指明 props
    render() {
      // 获取默认插槽
      const slot = this.$slots.default ? this.$slots.default() : []

      // 将插槽中的所有内容套上 div，并且读取 props 上的 size 属性，
      // 并构成类名
      return h(
        'div',
        { class: 'stack' },
        slot.map((child) => {
          return h('div', { class: `mt-${this.$props.size}` }, [child])
        }),
      )
    },
  }

  // App 组件
  const App = {
    template: `
            <Stack size="4">
            <div>hello</div>
            <Stack size="4">
                <div>hello</div>
                <div>hello</div>
            </Stack>
            </Stack>
        `,
    components: {
      Stack,
    },
  }

  // 创建 vue 实例并挂载到 DOM 上
  createApp(App).mount('#app')
</script>
```