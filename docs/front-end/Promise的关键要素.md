Promise的关键要素

1.如何改变promise的状态？

- resolve
- reject
- 抛出异常



2.一个promise指定多个成功/失败回调函数，都会调用吗？

当promise改变为对应状态的时候都会进行调用



3.改变promise状态和指定回调函数谁先谁后？（指定回调：`.then`中的回调）

1）都有可能。正常情况下先指定回调再改变状态，但是也可以先改变状态

2）什么情况是先指定回调再改变状态？

​	1️⃣在执行器中直接使用resolve/reject

​	2️⃣比执行器中的异步代码更晚调用.then

3）什么时候才能得到数据？

​	1️⃣如果是先指定的回调，当状态发生改变时，回调函数就会调用，得到数据

​	2️⃣如果是先改变的状态，当指定回调的时候，回调函数就会调用得到数据。



4.promise.then()返回的新promise的结果状态由什么决定？

​	1️⃣**简单描述**：由.then()中的指定的回调函数的执行结果进行决定

​	2️⃣**详细描述：**

- 如果执行结果为抛出异常，新promise变为rejected，resason为抛出的异常
- 如果执行结果为非**promise**的**任意值**（true、1、’hello，world！‘），新promise变为resolved，value为返回的值
- 如果执行结果为一个新的promise，此promise的结果就是新promise的结果。



5.promise如何串联多个操作任务

​	1️⃣promise的then会返回一个新的promise(`console.log(p.then) // Promise`)，可以开成then的**链式调用**

​	2️⃣通过then的链式调用串联多个同步/异步任务



6.promise异常穿透

​	1️⃣当使用promise得then链式调用时，可以在调用链的最后定义指定失败的回调

​	2️⃣前面任何操作出了异常，那么传到最后的失败回调进行处理



7.如何中断promise链？

- 当使用promise得then链式调用时，在中间中断，不再调用后面的回调函数
- 办法：在回调函数中返回一个pending状态promise对象