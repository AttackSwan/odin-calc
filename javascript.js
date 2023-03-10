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

console.log("LastOp: " + lastOperator + " | CV: " + currentVal + " | LV: " + lastVal)

function input(button){
    let buttonType = button.target.className;
    let buttonText = button.target.innerText;
    
    if(buttonType === "numeric" && !waitForClear){
        currentVal +=buttonText;
        displayVal +=buttonText;
    }
   
    else if(buttonType === "operator" && !waitForClear){
        
        //Display: add operator to upper display
        if (lastType === "operator"){
            displayVal = displayVal.substring(0, displayVal.length-1);            
        }
        //Operate / Sub-total: (operator has previously been pressed)
        else if (lastOperator !== ""){
            lastVal = subTotal;
            subTotal = operate(lastOperator, lastVal, currentVal);
        }
        //No sub-total: First press of operator
        else {
            lastOperator = button.target.id;
            subTotal = displayVal;
        }
        //Shift currentVal to previous and update display
        lastVal = currentVal;
        displayVal += button.target.innerText;
        currentVal = "";
        lastOperator = button.target.id;
    }
    
    lastType = buttonType;
    updateDisplay();
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
function updateDisplay(){
    upperDisplay.textContent = displayVal;
    lowerDisplay.textContent = subTotal;
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