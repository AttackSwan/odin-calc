let displayVal      = "";
let currentVal      = "";
let lastVal         = 0;
let subTotal        = 0;
let lastOperator    = "";
let lastType        = "";
let waitForClear    = false;
const operators     = "+-X÷";

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

// console.log("LastOp: " + lastOperator + " | CV: " + currentVal + " | LV: " + lastVal + " | subTotal: " + subTotal)

function decimal(){
    if (!currentVal.includes(".")){
        append(".");
    }
}

function append(input){
    currentVal += input;
    displayVal += input;
    updateDisplay("upper", displayVal);
}

function input(button){
    let buttonType = button.target.className;
    let buttonText = button.target.innerText;
    
    if(buttonType === "numeric" && !waitForClear){
        append(buttonText);
        updateDisplay("upper", displayVal);
    }
    else if(buttonType === "operator"){
        calculate(button);
    }
    console.log("current: " + currentVal + " | last: " + lastVal + " | Last op: " + lastOperator + " | subTotal: " + subTotal);           
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
            displayVal += button.target.innerText;
            lastVal = subTotal = operate(lastOperator, lastVal, currentVal);
            updateDisplay("upper", displayVal);
            updateDisplay("lower", subTotal);
        }
        currentVal = "";
        lastOperator = button.target.id;
}

function operate(operation, a, b){
    a = parseInt(a);
    b = parseInt(b);
    let output = "ERROR";
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
        if( b===0 ) {output = a;}
        else {output = a % b;}
    }
    else {  
        displayVal = "";
        subTotal = "Math Error";
        console.log("Error! Op: " + operation);
    }
    return output;
}

function equals(){
    //If something has been entered and it isn't an operator
    if(currentVal && lastType !== "operator" && lastOperator !== "") 
    {  
        console.log("Equals 1");
        subTotal = operate(lastOperator, lastVal, currentVal);
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