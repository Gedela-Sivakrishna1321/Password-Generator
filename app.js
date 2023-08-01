const inputSlider = document.querySelector(".slider");
const lengthDisplay = document.querySelector("#displayPassLength");

const passwordDisplay = document.querySelector(".displayPassword");
const copyBtn = document.querySelector("#copyBtn");
const copyMsg = document.querySelector(".copy-msg");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#number");
const symbolsCheck = document.querySelector("#symbol");
const indicator = document.querySelector("#passwordStrength");
const generateBtn = document.querySelector(".generate-button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "~!@#$%^&*()[]{}/?><+_-=";

// Default Values
let password = "";
let passwordLength = 10;
let checkCount = 0;
setIndicator("#ccc");
handleSlider();

// Sets the length of the password
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundColor = ((passwordLength - min)*100/(max - min)) + "% 100%"
}

// Password strength Indicator
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// Generate Random Integer
function getRndInteger(min,max) {
   return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateUpperCase() {
    return  String.fromCharCode(getRndInteger(65,91));
}

function generateLowerCase() {
    return  String.fromCharCode(getRndInteger(97,123));
}

function generateSymbol() {
    const ranNum = getRndInteger(0,symbols.length);
    return symbols.charAt(ranNum);
}

function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Finding Random index j
        const j = Math.floor(Math.random() * (i + 1));
        // Swap the i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
} 

// Function to calculate strength of password
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8) {
        setIndicator("#0f0");
    } else if ((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength >=6 ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

// Function to copy the password to clipboard
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    } catch (e) {
        copyMsg.innerText = "failed";
    }
    // Adding "active" class to make CopyMsg visible... 
    copyMsg.classList.add("active");

    setTimeout(() => {
        // Removing "active" class from copyMsg object
        copyMsg.classList.remove("active");
    },2000);
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked) 
            checkCount++;
    });

    // Special Case
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
})

// Setting EventListener on Slider
inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value;
    handleSlider();
})

// EventListener on CopyBtn
copyBtn.addEventListener('click',() => {
    if(passwordDisplay.value)
        copyContent();
})

// EventListener on Generate Password Btn
generateBtn.addEventListener('click',() => {
    console.log("Just entered to generate btn ");
    // If none of the checkbox is selected
    if(checkCount <= 0)  {
        console.log("Inside checkCout == 0 condition");
        return;
    }
        console.log("After checkcount condition");

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // Let's Generate the password..
    console.log("Starting the Journey..");
    password = "";

    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase)
    
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber)

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol)

    // Adding compulsory characters
    for(let i=0;i<funcArr.length;i++) {
        password += funcArr[i]();
    }
    console.log("compulsory addition done..");

    // Adding Remaining characters
    for(let i=0;i<passwordLength-funcArr.length;i++) {
        let randIdx = getRndInteger(0,funcArr.length);
        password += funcArr[randIdx]();
    }
    console.log("remaining addition done..");

    // Shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("shuffling done..");
    // Display the password
    passwordDisplay.value = password;
    console.log(" UI addition done..");
    // Change the strength
    calcStrength();
    
});