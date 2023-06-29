# Composition API

组合式 API 是 Vue 3 引入的一种新的 API 风格，旨在提供更灵活、可组合和可重用的组件逻辑编写方式。

## setup()

setup函数是一个新的选项，用于在组件内进行初始化和逻辑设置。
setup函数是一个普通的JavaScript函数，它接收两个参数：`props`和`context`。`props`是一个响应式的对象，用于接收组件外部传递的属性。`context`是一个包含了一些实用方法和属性的对象，用于在setup函数中访问组件的上下文。

```javascript
import { ref, onMounted } from 'vue';

export default {
  props: {
    name: {
      type: String,
      required: true
    }
  },
  setup(props, context) {
    const count = ref(0);

    // 访问props
    console.log(props.name); // 输出：Vue

    // 访问context中的属性和方法
    console.log(context.attrs); // 输出：{}
    console.log(context.emit); // 输出：函数

    // 访问attrs
    console.log(context.attrs.name); // 输出：undefined

    onMounted(() => {
      // 在组件挂载后执行的操作
      console.log('Component mounted');
    });

    // 触发自定义事件
    const handleClick = () => {
      context.emit('custom-event', 'Clicked');
    };

    return {
      count,
      handleClick
    };
  }
}
```

::: warning ⚠️ 注意
setup函数是在组件实例创建之前执行的，因此在setup函数内部无法访问`this`。如果需要访问组件实例，可以通过`context`参数中的`attrs`属性访问组件的属性，或者通过`context`参数中的`emit`方法触发自定义事件。
:::

## ref

在选项式 API 中，我们使用 data 选项来定义组件的响应式数据。而在组合式 API 中，我们使用 ref 或 reactive 函数来创建响应式数据。

```javascript
// Vue 2 选项式 API
export default {
  data() {
    return {
      message: 'Hello, Vue!'
    };
  }
};

// Vue 3 组合式 API
import { ref } from 'vue';

export default {
  setup() {
    const message = ref('Hello, Vue!');

    return {
      message
    };
  }
};
```

::: warning ⚠️ 注意
使用ref定义的响应式数据值的时候，要使用取其value值，例如 `message.value`
:::

## reactive

我们可以使用 reactive 函数来创建响应式对象

```javascript
import { reactive } from 'vue';

const app = {
  setup() {
    const data = reactive({
      message: 'Hello, Vue 3!',
      count: 0
    });

    return {
      data
    };
  }
};

createApp(app).mount('#app');
```

## computed
用于创建一个计算属性。可以使用 computed 来派生出其他响应式数据

```javascript
// vue2
export default {
  data() {
    return {
      firstName: 'John',
      lastName: 'Doe'
    };
  },
  computed: {
    fullName() {
      return this.firstName + ' ' + this.lastName;
    }
  }
}

// vue3
import { ref, computed } from 'vue';

export default {
  setup() {
    const firstName = ref('John');
    const lastName = ref('Doe');

    const fullName = computed(() => {
      return firstName.value + ' ' + lastName.value;
    });

    return {
      firstName,
      lastName,
      fullName
    };
  }
}
```

## watch

`watch`的用法和Vue 2中有一些差异，主要是在setup函数内部使用

```javascript
// vue2
export default {
  data() {
    return {
      message: 'Hello',
      count: 0
    };
  },
  watch: {
    message(newValue, oldValue) {
      console.log('message changed:', newValue, oldValue);
    },
    count(newValue, oldValue) {
      console.log('count changed:', newValue, oldValue);
    }
  }
}

// vue3
import { ref, watch } from 'vue';

export default {
  setup() {
    const message = ref('Hello');
    const count = ref(0);

    watch(message, (newValue, oldValue) => {
      console.log('message changed:', newValue, oldValue);
    });

    watch(count, (newValue, oldValue) => {
      console.log('count changed:', newValue, oldValue);
    });

    return {
      message,
      count
    };
  }
}
```

## toRef

toRef函数接收一个响应式对象和一个属性名称，并返回一个只读的响应式引用。这个引用与原始对象上的属性保持同步，如果引用的属性发生变化，那么响应式引用也会更新。

```javascript
import { reactive, toRef } from 'vue';

// 创建一个响应式对象
const user = reactive({
  name: 'John',
  age: 25
});

// 使用toRef创建属性的引用
const nameRef = toRef(user, 'name');

// 在函数中使用引用来访问属性值
function logUserName() {
  console.log(nameRef.value); // 使用引用访问属性值
}

// 修改属性的值
user.name = 'Jane';

logUserName(); // 输出: 'Jane'，正确地追踪变化
```

## toRefs

toRefs函数接收一个响应式对象，并将它的所有属性转换为响应式引用的对象。返回的对象是一个包含所有属性引用的普通JavaScript对象，每个属性引用都可以通过.value访问。这对于将整个对象的属性传递给其他组件或函数非常有用。

```javascript
import { reactive, toRefs } from 'vue';

// 创建一个响应式对象
const user = reactive({
  name: 'John',
  age: 25,
  location: 'New York'
});

// 使用toRefs创建所有属性的引用对象
const refs = toRefs(user);

// 在函数中使用引用对象的属性
function logUserDetails(userRefs) {
  console.log(`Name: ${userRefs.name.value}`);
  console.log(`Age: ${userRefs.age.value}`);
  console.log(`Location: ${userRefs.location.value}`);
}

logUserDetails(refs);
```

## provide 和 inject

provide 和 inject 允许祖先组件（提供者）向其所有后代组件（注入者）传递数据，而无需显式地通过 props 或事件进行传递

```javascript
<template>
  <div>
    <!-- 提供数据给后代组件 -->
    <provide :message="message">
      <ChildComponent />
    </provide>
  </div>
</template>

<script>
import { provide, ref } from 'vue';
import ChildComponent from './ChildComponent';

export default {
  components: {
    ChildComponent
  },
  setup() {
    const message = ref('Hello from provide!');

    provide('message', message); // 使用 provide 提供数据给后代组件

    return {
      message
    };
  }
}
</script>


<template>
  <div>
    <!-- 从提供者组件中注入数据 -->
    <p>{{ injectedMessage }}</p>
  </div>
</template>

<script>
import { inject } from 'vue';

export default {
  setup() {
    const injectedMessage = inject('message'); // 使用 inject 注入提供的数据

    return {
      injectedMessage
    };
  }
}
</script>
```

## watchEffect

`watchEffect` 是一个用于监听响应式数据变化的函数。与 Vue 2 中的 `watch` 函数相比，`watchEffect` 更加简洁，它不需要显式地指定要监听的数据，而是自动追踪函数中使用到的响应式数据，并在数据变化时触发相应的副作用函数。

```javascript
<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ double }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
import { watch, watchEffect, ref } from 'vue';

export default {
  setup() {
    const count = ref(0);
    const double = ref(0);

    // 使用 watchEffect 监听 count 的变化，计算 double 的值
    watchEffect(() => {
      double.value = count.value * 2;
    });

    // 使用 watch 监听 count 的变化，输出日志
    watch(
      () => count.value,
      (newValue, oldValue) => {
        console.log(`Count changed: ${oldValue} => ${newValue}`);
      }
    );

    const increment = () => {
      count.value++;
    };

    return {
      count,
      double,
      increment
    };
  }
};
</script>
```