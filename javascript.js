let displayVal      = "";
let currentVal      = "";
let lastVal         = 0;
let subTotal        = 0;
let lastOperator    = "";
let lastType        = "";
let waitForClear    = false;
const operators     = "+-X÷";
const decimalPlaces = 3;

const clearButton   = document.getElementById("btnAC");
const deleteButton  = document.getElementById("btnC");
const decimalButton = document.getElementById("decimal");
const equalsButton  = document.getElementById("btnEQL");
const upperDisplay = document.getElementById("upperTXT");
const lowerDisplay = document.getElementById("lowerTXT");

clearButton.onclick     = () => clear();
deleteButton.onclick    = () => deleteNum();
decimalButton.onclick   = () => decimal();
equalsButton.onclick    = () => equals();

createListeners();   //for numeric and operator buttons

function input(button){
    let buttonType = button.target.className;
    let buttonText = button.target.innerText;

    if(buttonType === "numeric" && !waitForClear){
        append(buttonText);
    }
    else if(buttonType === "operator"){
        calculate(button);
    }
    lastType = buttonType;
}

function calculate(button){
        //If starting with an operator
        if(!lastType){
            lastVal = 0;
            displayVal = 0 + button.target.innerText;
            updateDisplay("upper", displayVal);
        }
        //If starting with numeric
        //First usage of operator
        else if (!lastOperator) {
            console.log("If 1");
            displayVal += button.target.innerText;
            updateDisplay("upper", displayVal);
            lastType = "operator";
            lastVal = currentVal;
        }
        //Prevent operators stacking up in upper display
        else if (lastType === "operator" && !waitForClear){
            console.log("Else if 2");
            displayVal = displayVal.substring(0, displayVal.length-1) + button.target.innerText;
            updateDisplay("upper", displayVal);
        }
            //Operate on previous pair of inputs
        else if (lastOperator !== "" && !waitForClear){
            console.log("Else if 3");
            console.log("Last op: " + lastOperator + " | last val: " + lastVal + " | currentVal: " + currentVal);
            displayVal += button.target.innerText;
            lastVal = subTotal = parseOutput(operate(lastOperator, lastVal, currentVal));
            updateDisplay("upper", displayVal);
            updateDisplay("lower", parseOutput(subTotal));  //Don't round subTotal to avoid rounding errors
        }
        currentVal = "";
        lastOperator = button.target.id;
}

function operate(operation, a, b){
    a = parseFloat(a);
    b = parseFloat(b);
    let output = "";
    if (operation === "btnADD"){
        output = a + b;
    }
    else if(operation === "btnMIN"){
        output = a - b;
    }
    else if(operation === "btnMULT"){
        output = a * b;
    }
    else if(operation === "btnDIV"){
        if(b !== 0) {output = a / b;}
        else {
            divZero(); 
            output = "Infinity";
        }
    }
    else if(operation === "modulus"){
        b === 0 ? output = a : output = a % b;
    }
    else {  
        displayVal = "";
        subTotal = "Math Error";
        console.log("Error! Op: " + operation);
    }
    return output;
}

function parseOutput(value){
    if (typeof(value) === "number"){
        value = value.toFixed(decimalPlaces);
    }
    if (value % 1 === 0){
        value = Math.round(value);
    }
    return value;
}

function decimal(){
    if (!currentVal.includes(".")){
        append(".");
    }
}

function append(input){
    let stringLength = currentVal.length;
    currentVal += input;
    
    if (stringLength >= 12){
        let shortDisplay = displayVal.at(0) + "." + displayVal.substring(1,1) + "10e" + (stringLength - 1);
        updateDisplay("upper", shortDisplay);
    }
    else {
        displayVal += input;
        updateDisplay("upper", displayVal);
    }
}

function equals(){
    //If something has been entered and it isn't an operator
    if(currentVal && lastType !== "operator" && lastOperator !== "") 
    {  
        subTotal = parseOutput(operate(lastOperator, lastVal, currentVal));
        console.log(subTotal);
        updateDisplay("lower", subTotal);
        updateDisplay("upper", "");
        waitForClear = true;
    }
    //If running equals without any operators
    else if (lastOperator === "" && currentVal){
        updateDisplay("upper", "ಠ_ಠ");
        updateDisplay("lower", currentVal);
        waitForClear = true;
    }
}

function clear(mode){
    //Clear all
    if (!mode){
        subTotal = lastVal = 0;
        waitForClear = false;
        updateDisplay("lower", 0);
        updateDisplay("upper", "");
    }
    //Update upper display
    else if(mode==="upper"){
        waitForClear = true;
    }
    displayVal = currentVal = lastOperator = lastType = "";
}

function deleteNum(){
    //Check if delete character is an operator
    const isOperator = operators.includes(displayVal.at(-1));

    if(!waitForClear && !isOperator && displayVal){
        displayVal = displayVal.substring(0, displayVal.length -1);
        currentVal = currentVal.substring(0, currentVal.length -1);
        updateDisplay("upper", displayVal);
    }
    else if(!displayVal){
        currentVal = 0;
    }
    //prevent returning NaN from operate()
    if (currentVal === ""){
        append(0); 
        currentVal = 0;
    }
}

function updateDisplay(display, value){
    if(display === "lower"){
        lowerDisplay.textContent = value;
    }
    else if (display === "upper"){
        upperDisplay.textContent = value;
    }
}

function divZero(){
    displayVal = "Div 0!";
    waitForClear = true;
}

function createListeners(){
    const buttons = document.querySelectorAll('.numeric, .operator');
    buttons.forEach((button) =>  {
        button.addEventListener('click', (e) => {
            input(e);
        }); 
    });
}
//Add glow to clear button when equals or div0