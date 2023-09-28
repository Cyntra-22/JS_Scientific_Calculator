const resultElement = document.getElementById("result");
let userInput = "";
let display = "";
let memory = 0;

const operators = [
  "+",
  "-",
  "*",
  "/",
  "sin",
  "cos",
  "tan",
  "sqrt",
  "square",
  "mc",
  "m+",
  "m-",
  "mr",
  "!",
];

document.addEventListener("keypress", handleKeyPress);

function handleKeyPress(event) {
  const key = event.key;

  if (key === "Enter") {
    if (userInput === "") {
      displayResult(0);
    } else {
      display += evaluateInput(userInput);
      displayResult(display);
      userInput = "";
      display = "";
    }
  } else if (key === "<") {
    removeLastInput();
  } else if (key === "c" || key === "C") {
    clearCalculator();
  } else {
    appendToUserInput(key);
  }
}

function tokenizeExpression(expression) {
  const token =
    /(\d+\.\d+|\d+|[-+*/()^]|(sin|cos|tan|log|sqrt|square|!|mc|m\+|m-|mr))/g;
  const tokens = expression.match(token);
  const cleanedTokens = tokens.map((token) => token.trim());
  return cleanedTokens;
}

function getOperatorPrecedence(operator) {
  const precedence = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
    sin: 3,
    cos: 3,
    tan: 3,
    sqrt: 3,
    square: 3,
    mc: 4,
    "m+": 4,
    "m-": 4,
    mr: 4,
    "!": 5,
  };
  return precedence[operator] || 0;
}

function evaluateInput(expression) {
  let tokens = tokenizeExpression(expression);
  const postfixExpression = [];
  const operatorStack = [];

  for (let token of tokens) {
    if (operators.includes(token)) {
      while (
        operatorStack.length > 0 &&
        getOperatorPrecedence(operatorStack[operatorStack.length - 1]) >=
          getOperatorPrecedence(token)
      ) {
        postfixExpression.push(operatorStack.pop());
      }
      operatorStack.push(token);
    } else {
      postfixExpression.push(token);
    }
  }

  while (operatorStack.length > 0) {
    postfixExpression.push(operatorStack.pop());
  }

  return evaluateRPN(postfixExpression);
}

function evaluateRPN(rpnExpression) {
  const stack = [];

  for (let token of rpnExpression) {
    if (!isNaN(token)) {
      stack.push(parseFloat(token));
    } else if (operators.includes(token)) {
      const operand2 = stack.pop();
      const operand1 = stack.pop();

      switch (token) {
        case "+":
          stack.push(operand1 + operand2);
          break;
        case "-":
          stack.push(operand1 - operand2);
          break;
        case "*":
          stack.push(operand1 * operand2);
          break;
        case "/":
          if (operand2 === 0) {
            stack.push("Error");
          } else {
            stack.push(operand1 / operand2);
          }
          break;
        case "sin":
          stack.push(Math.sin(operand2));
          break;
        case "cos":
          stack.push(Math.cos(operand2));
          break;
        case "tan":
          stack.push(Math.tan(operand2));
          break;
        case "sqrt":
          stack.push(Math.sqrt(operand2));
          break;
        case "square":
          stack.push(operand2 * operand2);
          break;
        case "mc":
          memory = 0;
          stack.push(memory);
          break;
        case "m+":
          memory += stack.pop();
          stack.push(memory);
          break;
        case "m-":
          memory -= stack.pop();
          stack.push(memory);
          break;
        case "mr":
          stack.push(memory);
          break;
        case "!":
          let result = 1;
          for (let i = 2; i <= operand2; i++) {
            result *= i;
          }
          stack.push(result);
          break;
      }
    }
  }

  return stack[0];
}

function displayResult(value) {
  resultElement.innerHTML = value;
}

function appendToUserInput(key) {
  userInput += key;
  displayResult(userInput);
}

function removeLastInput() {
  userInput = userInput.slice(0, -1);
  displayResult(userInput);
}

function clearCalculator() {
  userInput = "";
  displayResult(0);
}

document.getElementById("myTable").onclick = function (event) {
  const targetId = event.target.id;

  if (targetId === "Enter") {
    display = evaluateInput(userInput);
    displayResult(display);
  } else if (targetId === "Backspace") {
    removeLastInput();
  } else if (targetId === "c") {
    clearCalculator();
  } else if (targetId === "π") {
    appendToUserInput(Math.PI);
  } else if (targetId === "mr") {
    displayResult(userInput);
  } else if (targetId === "m+") {
    appendToUserInput("+");
  } else if (targetId === "m-") {
    appendToUserInput("-");
  } else if (targetId === "mc") {
    clearCalculator();
  } else {
    appendToUserInput(targetId);
  }
};
