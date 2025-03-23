# 2 - Rendering Mechanism

渲染机制

vnode的好处：

- 组件渲染逻辑与真实的 DOM 节点解耦
- 复用框架更直接（比如可以自定义渲染方案）
- 在生成渲染函数前去构建出想要的 DOM 结构（比 template 更灵活地去构造一些特殊的结构）



Vue 2渲染函数

```
render(h){
  return h('div',{
    attrs:{
  		id:'foo'
  	},
 	 	on:{
  		onclick:this.onClick
  	} 
 },'hello')
}
```



渲染函数，Vue 3 的改进：

```js
import { h } from 'vue' // 从全局引入 h 函数，而不再作为 render 函数的第一个参数

function render() {
  return h('div', { // 扁平化的对象结构
    id: 'foo',
    onClick: this.onClick // on 开头的会绑定一个 listener
  }, 'hello')
}
```