"use strict";

$("#myform").validate({});

function calculate() {
    if ($("#myform").valid()) {
        const operand1 = document.getElementById("Operand1").value;
        const operand2 = document.getElementById("Operand2").value;

        const operand1fp = parseFloat(operand1);
        const operand2fp = parseFloat(operand2);

        let operator = "";

        if (document.getElementById("addition").checked) {
            operator = "plus";
        } else if (document.getElementById("subtraction").checked) {
            operator = "minus";
        } else if (document.getElementById("multiplication").checked) {
            operator = "multiply";
        } else if (document.getElementById("division").checked) {
            operator = "divided";
        }

        let result;

        if (operator === "plus") {
            result = operand1fp + operand2fp;
        } else if (operator === "minus") {
            result = operand1fp - operand2fp;
        } else if (operator === "multiply") {
            result = operand1fp * operand2fp;
        } else if (operator === "divided") {
            result = operand1fp / operand2fp;
        }

        document.getElementById("Result").textContent = String(result);
    }
}

function clearform() {
    document.getElementById("Operand1").value = "";
    document.getElementById("Operand2").value = "";
    document.getElementById("Operand1Error").textContent = "";
    document.getElementById("Operand2Error").textContent = "";
    document.getElementById("OperatorError").textContent = "";

    document.getElementById("addition").checked = false;
    document.getElementById("subtraction").checked = false;
    document.getElementById("multiplication").checked = false;
    document.getElementById("division").checked = false;

    document.getElementById("Result").textContent = "";
}
