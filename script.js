const display = document.querySelector('#display');
const keys = document.querySelector('#keys');
let expression = '';

function updateDisplay() {
  display.value = expression || '0';
}

function inputValue(value) {
  if ('+-*/'.includes(value)) {
    if (!expression && value !== '-') return;
    if (/[+*/-]$/.test(expression)) expression = expression.slice(0, -1);
    expression += value;
  } else if (value === '.') {
    const currentNumber = expression.split(/[+*/-]/).pop();
    if (currentNumber.includes('.')) return;
    expression += currentNumber ? '.' : '0.';
  } else {
    expression += value;
  }
  updateDisplay();
}

function calculate() {
  if (!expression || /[+*/.-]$/.test(expression)) return;
  // Aceita somente números, operadores e pontos decimais.
  if (!/^[0-9+*/.\-]+$/.test(expression)) return;
  try {
    const result = Function('"use strict"; return (' + expression + ')')();
    expression = Number.isFinite(result) ? String(Number(result.toPrecision(12))) : '';
    display.value = Number.isFinite(result) ? expression : 'Erro: divisão por zero';
  } catch {
    display.value = 'Expressão inválida';
    expression = '';
  }
}

function handleAction(action) {
  if (action === 'clear') { expression = ''; updateDisplay(); }
  if (action === 'backspace') { expression = expression.slice(0, -1); updateDisplay(); }
  if (action === 'equals') calculate();
}

keys.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.action) handleAction(button.dataset.action);
  else inputValue(button.dataset.value);
});
