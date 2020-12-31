const CalculatorButton = {
  props: {
    text: {
      type: String,
      required: true,
    },
    cssClass: {
      type: String,
    },
  },
  template: `
    <button
      class="py-4 w-full flex items-center justify-center border rounded-full text-lg hover:border-purple-600 focus:outline-none focus:ring"
      :class="cssClass"
      @click="handleClick">{{text}}</button>
  `,
  setup(props, context) {
    const handleClick = () => {
      context.emit('on-click', props.text);
    };

    return {
      handleClick,
    };
  },
};
const App = {
  components: {
    CalculatorButton,
  },
  template: `
    <div class="h-screen w-full bg-gray-100 flex items-center justify-center">
      <div class="w-96 bg-white shadow p-6 rounded-md">
        <div class="px-4 py-4 h-16 text-2xl rounded-md bg-gray-100 mb-5 flex items-center justify-end">
          {{currentValue}}
        </div>
        <div class="grid grid-cols-4 gap-2" >
          <CalculatorButton text="1" @on-click="handleClick" />
          <CalculatorButton text="2" @on-click="handleClick" />
          <CalculatorButton text="3" @on-click="handleClick" />
          <CalculatorButton text="+" @on-click="handleClick" :cssClass="currentOperationClasses('+')" />
          <CalculatorButton text="4" @on-click="handleClick" />
          <CalculatorButton text="5" @on-click="handleClick" />
          <CalculatorButton text="6" @on-click="handleClick" />
          <CalculatorButton text="-" @on-click="handleClick" :cssClass="currentOperationClasses('-')" />
          <CalculatorButton text="7" @on-click="handleClick" />
          <CalculatorButton text="8" @on-click="handleClick" />
          <CalculatorButton text="9" @on-click="handleClick" />
          <CalculatorButton text="*" @on-click="handleClick" :cssClass="currentOperationClasses('*')" />
          <CalculatorButton text="c" @on-click="handleClick" cssClass="bg-gradient-to-r from-blue-600 to-purple-600 text-white" />
          <CalculatorButton text="0" @on-click="handleClick" />
          <CalculatorButton text="=" @on-click="handleClick" />
          <CalculatorButton text="/" @on-click="handleClick" :cssClass="currentOperationClasses('/')" />
        </div>
      </div>
    </div>
  `,
  setup() {
    const operations = ['+', '-', '*', '/'];
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    const currentValue = Vue.ref('');
    const prevValue = Vue.ref('');
    const currentOperation = Vue.ref('');
    const currentOperationClasses = (operation) => {
      return currentOperation.value === operation
        ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white'
        : '';
    };

    const handleWindowKeyDown = (e) => {
      handleClick(e.key);
    };

    const handleClick = (value) => {
      if (value === '=' || value === 'Enter') {
        calculate();
      } else if (value === 'c') {
        clear();
      } else if (operations.includes(value)) {
        applyOperation(value);
      } else if (numbers.includes(value)) {
        appendNumber(value);
      }
    };

    const clear = () => (currentValue.value = '');

    const applyOperation = (operation) => {
      calculate();
      currentOperation.value = operation;
      prevValue.value = currentValue.value;
      currentValue.value = '';
    };

    const appendNumber = (value) =>
      (currentValue.value = currentValue.value + value);

    const calculate = () => {
      if (prevValue.value !== '' && currentValue.value !== '') {
        var result = '';

        if (currentOperation.value === '+') {
          result = parseFloat(prevValue.value) + parseFloat(currentValue.value);
        } else if (currentOperation.value === '-') {
          result = parseFloat(prevValue.value) - parseFloat(currentValue.value);
        } else if (currentOperation.value === '*') {
          result = parseFloat(prevValue.value) * parseFloat(currentValue.value);
        } else if (currentOperation.value === '/') {
          result = parseFloat(prevValue.value) / parseFloat(currentValue.value);
        }

        currentValue.value = result;
        prevValue.value = '';
        currentOperation.value = '';
      }
    };

    Vue.onMounted(() => {
      window.addEventListener('keydown', handleWindowKeyDown);
    });

    Vue.onUnmounted(() => {
      window.removeEventListener('keydown', handleWindowKeyDown);
    });

    return {
      currentValue,
      currentOperation,
      currentOperationClasses,
      handleClick,
    };
  },
};

Vue.createApp(App).mount('#app');
