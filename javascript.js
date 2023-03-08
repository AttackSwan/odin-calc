let displayVal      = "";
let lastVal         = "0";
let currentVal      = "";
let subTotal        = 0;
let lastOperator    = "";

createListeners();

function createListeners(){
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button) =>  {
        button.addEventListener('click', (e) => {
            input(e);
        }); 
    });
}

function input(button){
    let buttonType = button.target.className;
    let buttonText = button.target.innerText;
    
    if(buttonType === "numeric"){
        currentVal +=buttonText;
        displayVal +=buttonText;
    }
   
    else if(buttonType === "operator"){
        
        if (lastOperator !== ""){
            lastVal = subTotal;
            subTotal = operate(lastOperator, lastVal, currentVal);
            displayVal = subTotal;
        }
        
        else if(lastOperator===""){
            lastOperator = button.target.id;
            subTotal = displayVal;
        }

        lastVal = currentVal;
        displayVal += button.target.innerText;
        currentVal = "";
        lastOperator = button.target.id;
    }
    // else if (buttonType === 'clear'){
    //     displayValue = "";
    // }
    // else if (buttonType === "delete"){
    //     displayVal = displayVal.substring(0, displayVal.length -1);
    // }
    console.log("current val: " + currentVal + " | last val: " + lastVal + " | sub-total: " + subTotal);
    updateDisplay();
}

function updateDisplay(){
    const upperDisplay = document.getElementById("upperTXT");
    const lowerDisplay = document.getElementById("lowerTXT");
    upperDisplay.textContent = displayVal;
    lowerDisplay.textContent = subTotal;
}

function operate(operation, a, b){
    if (operation === "btnADD"){
        output = add(a, b);
    }
    else if(operation === "btnMIN"){
        output = a - b;
    }
    else if(operation === "btnMULT"){
        output = a * b;
    }
    else if(operation === "btnDIV"){
        output = "divide";
    }
    else {
        console.log("Error! Op: " + operation);
    }
    return output;
}

function add(a, b){
    return parseInt(a) + parseInt(b);
}
function subtract(a, b){
    return a - b;
}
function multiply(a, b){
    return a * b;
}
// function divide(a, b){
//     return a * b;
// }
