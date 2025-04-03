// 计算器状态管理
let state = {
    currentInput: '0',    // 当前输入
    previousInput: '',    // 上一次输入
    operation: null,      // 当前运算符
    shouldResetScreen: false,  // 是否需要重置显示
    history: []          // 计算历史记录
};

// DOM 元素
const display = {
    current: document.querySelector('.current-input'),
    history: document.querySelector('.history')
};

// 初始化事件监听
document.addEventListener('DOMContentLoaded', () => {
    // 数字按键事件
    document.querySelectorAll('.number').forEach(button => {
        button.addEventListener('click', () => inputNumber(button.textContent));
    });

    // 运算符按键事件
    document.querySelectorAll('.operator').forEach(button => {
        button.addEventListener('click', () => handleOperator(button.dataset.action));
    });

    // 功能按键事件
    document.querySelectorAll('.function').forEach(button => {
        button.addEventListener('click', () => handleFunction(button.dataset.action));
    });

    // 科学计算按键事件
    document.querySelectorAll('.scientific').forEach(button => {
        button.addEventListener('click', () => handleScientific(button.dataset.action));
    });

    // 等于按键事件
    document.querySelector('.equals').addEventListener('click', calculate);
});

// 输入数字
function inputNumber(number) {
    if (state.shouldResetScreen) {
        state.currentInput = number;
        state.shouldResetScreen = false;
    } else {
        state.currentInput = state.currentInput === '0' ? number : state.currentInput + number;
    }
    updateDisplay();
}

// 处理运算符
function handleOperator(operator) {
    if (state.operation !== null) calculate();
    state.previousInput = state.currentInput;
    state.operation = operator;
    state.shouldResetScreen = true;
    updateHistory();
}

// 处理功能键
function handleFunction(action) {
    switch (action) {
        case 'clear':
            state.currentInput = '0';
            state.previousInput = '';
            state.operation = null;
            state.history = [];
            break;
        case 'backspace':
            state.currentInput = state.currentInput.slice(0, -1) || '0';
            break;
        case 'toggle-sign':
            state.currentInput = String(-parseFloat(state.currentInput));
            break;
        case 'decimal':
            if (!state.currentInput.includes('.')) {
                state.currentInput += '.';
            }
            break;
    }
    updateDisplay();
}

// 处理科学计算
function handleScientific(action) {
    const number = parseFloat(state.currentInput);
    switch (action) {
        case 'sin':
            state.currentInput = Math.sin(number * Math.PI / 180).toFixed(8);
            break;
        case 'cos':
            state.currentInput = Math.cos(number * Math.PI / 180).toFixed(8);
            break;
        case 'tan':
            state.currentInput = Math.tan(number * Math.PI / 180).toFixed(8);
            break;
        case 'log':
            state.currentInput = Math.log10(number).toFixed(8);
            break;
        case 'ln':
            state.currentInput = Math.log(number).toFixed(8);
            break;
        case 'power':
            state.previousInput = state.currentInput;
            state.operation = 'power';
            state.shouldResetScreen = true;
            break;
        case 'sqrt':
            state.currentInput = Math.sqrt(number).toFixed(8);
            break;
        case 'pi':
            state.currentInput = Math.PI.toFixed(8);
            break;
    }
    updateDisplay();
    updateHistory();
}

// 执行计算
function calculate() {
    let result;
    const prev = parseFloat(state.previousInput);
    const current = parseFloat(state.currentInput);

    switch (state.operation) {
        case 'add':
            result = prev + current;
            break;
        case 'subtract':
            result = prev - current;
            break;
        case 'multiply':
            result = prev * current;
            break;
        case 'divide':
            result = prev / current;
            break;
        case 'percent':
            result = prev * (current / 100);
            break;
        case 'power':
            result = Math.pow(prev, current);
            break;
        default:
            return;
    }

    // 更新计算历史
    const calculation = `${prev} ${getOperatorSymbol(state.operation)} ${current} = ${result}`;
    state.history.push(calculation);

    // 更新状态
    state.currentInput = String(result);
    state.operation = null;
    state.shouldResetScreen = true;

    updateDisplay();
    updateHistory();
}

// 获取运算符符号
function getOperatorSymbol(operator) {
    const symbols = {
        add: '+',
        subtract: '-',
        multiply: '×',
        divide: '÷',
        percent: '%',
        power: '^'
    };
    return symbols[operator] || operator;
}

// 更新显示
function updateDisplay() {
    display.current.textContent = state.currentInput;
}

// 更新历史记录
function updateHistory() {
    if (state.history.length > 0) {
        display.history.textContent = state.history[state.history.length - 1];
    } else {
        display.history.textContent = '';
    }
}