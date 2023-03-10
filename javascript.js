let displayVal      = "";
let currentVal      = "";
let lastVal         = 0;
let subTotal        = 0;
let lastOperator    = "";
let lastType        = "";   //?
let waitForClear    = false;

const clearButton   = document.getElementById("btnAC");
const deleteButton  = document.getElementById("btnC");
const decimalButton = document.getElementById("decimal");
const equalsButton  = document.getElementById("btnEQL");
const upperDisplay = document.getElementById("upperTXT");
const lowerDisplay = document.getElementById("lowerTXT");

clearButton.onclick     = () => clear();
deleteButton.onclick    = () => deleteNum();
decimalButton  .onclick = () => decimalButton();
equalsButton.onclick    = () => equals();

createListeners();   //for numeric and operator buttons

// console.log("LastOp: " + lastOperator + " | CV: " + currentVal + " | LV: " + lastVal + " | subTotal: " + subTotal)

function input(button){
    let buttonType = button.target.className;
    let buttonText = button.target.innerText;
    
    if(buttonType === "numeric" && !waitForClear){
        currentVal +=buttonText;
        displayVal +=buttonText;
        updateDisplay("upper", displayVal);
    }
    else if(buttonType === "operator"){
        calculate(button);
    }
    console.log("current: " + currentVal + " | last: " + lastVal + " | Last op: " + lastOperator + " | subTotal: " + subTotal);           
    lastType = buttonType;
}

function calculate(button){
        //Starting with an operator
        if(!lastType){
            lastVal = 0;
            displayVal = 0 + button.target.innerText;
            updateDisplay("upper", displayVal);
        }
        //Start with numeric
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

function equals(){
    if(currentVal){  //Only run if something has been entered
    subTotal = operate(lastOperator, lastVal, currentVal);
    if (displayVal !== "Div 0!") { clear("upper"); }
    updateDisplay();
    }
}


function clear(mode){
    //Clear all
    if (!mode){
        subTotal = lastVal = 0;
        waitForClear = false;
    }
    //Runs on equal button click
    else if(mode==="upper"){
        waitForClear = true;
    }
    displayVal = currentVal = lastOperator = lastType = "";
    updateDisplay();
}
function deleteNum(){
        upperDisplay = upperDisplay.substring(0, upperDisplay.length -1);
}
function updateDisplay(display, value){
    if(display === "lower"){
        lowerDisplay.textContent = value;
    }
    else if (display === "upper"){
        upperDisplay.textContent = value;
    }
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
        console.log(a + " " + b);
        if(b !== 0)      {output = a / b;}
        else if(b === 0) {
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