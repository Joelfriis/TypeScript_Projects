"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//  Imports
var readline = require("readline");
var assert = require("assert");
//  Global varibles
var math_expressions = "";
var nextToken = "";
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
//  Functions
function ScanToken() {
    nextToken = "";
    if (["+", "-", "*", "/", "(", ")"].includes(math_expressions[0]) && math_expressions.length > 0) {
        nextToken = math_expressions[0];
        math_expressions = math_expressions.slice(1);
    }
    else {
        while (!["+", "-", "*", "/", "(", ")"].includes(math_expressions[0]) && math_expressions.length > 0) {
            nextToken += math_expressions[0];
            math_expressions = math_expressions.slice(1);
        }
    }
}
function parseE() {
    var operation;
    var b;
    var a = parseT();
    while (true) {
        if (["+", "-"].includes(nextToken) && math_expressions.length > 0) {
            operation = nextToken;
            ScanToken();
            var b_1 = parseT();
            a = CreateBinaryOperationNode(a, b_1, operation);
        }
        else
            return a;
    }
}
function parseT() {
    var operation;
    var b;
    var a = parseF();
    while (true) {
        if (["*", "/"].includes(nextToken) && math_expressions.length > 0) {
            operation = nextToken;
            ScanToken();
            var b_2 = parseF();
            a = CreateBinaryOperationNode(a, b_2, operation);
        }
        else
            return a;
    }
}
function parseF() {
    if (!isNaN(Number(nextToken))) {
        var nr_node = CreateNumberNode((Number(nextToken)));
        ScanToken();
        return nr_node;
    }
    else if (nextToken == "(") {
        ScanToken();
        var a = parseE();
        //@ts-ignore
        if (nextToken == ")") {
            ScanToken();
            return a;
        }
        else
            throw new Error("Incorrect syntax of expression.");
    }
    else if (nextToken == "-") {
        ScanToken();
        return CreateNegateNode(parseF());
    }
    else
        throw new Error("Incorrect syntax of expression.");
}
function CreateNumberNode(value) {
    return {
        value: value,
        evaluate: function () {
            return this.value;
        }
    };
}
function CreateBinaryOperationNode(left, right, operator) {
    return {
        left: left,
        right: right,
        operator: operator,
        evaluate: function () {
            var operation = operatorHash[operator];
            return operation(left.evaluate(), right.evaluate());
        }
    };
}
function CreateNegateNode(points_towards) {
    return {
        points_towards: points_towards,
        evaluate: function () {
            return -points_towards.evaluate();
        }
    };
}
function add(a, b) {
    return a + b;
}
function subtract(a, b) {
    return a - b;
}
function multiply(a, b) {
    return a * b;
}
function divide(a, b) {
    if (b === 0)
        throw new Error("Cannot divide by zero.");
    return a / b;
}
// Operation Function lookup table
var operatorHash = {
    '+': add,
    '-': subtract,
    '*': multiply,
    '/': divide
};
//test function 
function testMathExpressionParser() {
    console.log("Starting tests for the AST-based Mathematical Expression Parser...");
    // Test cases
    var tests = [
        {
            input: "3+5",
            expected: 8
        },
        {
            input: "10 -2*3",
            expected: 4
        },
        {
            input: "(1+2)*4",
            expected: 12
        },
        {
            input: "-5+3",
            expected: -2
        },
        {
            input: "3+5*(2-8)",
            expected: -27
        },
        {
            input: "10/2",
            expected: 5
        },
        {
            input: "10/(2+3)",
            expected: 2
        },
        {
            input: "-3*-2",
            expected: 6
        },
        {
            input: "3+(2*(1+3))",
            expected: 11
        },
    ];
    tests.forEach(function (_a, index) {
        var input = _a.input, expected = _a.expected;
        math_expressions = input; // Set the global input string.
        ScanToken(); // Initialize token scanning.
        var tree = parseE(); // Parse the expression into an AST.
        var result = tree.evaluate(); // Evaluate the AST.
        try {
            assert.strictEqual(result, expected);
            console.log("Test ".concat(index + 1, " passed: ").concat(input, " = ").concat(expected));
        }
        catch (error) {
            console.error("Test ".concat(index + 1, " failed: ").concat(input, " | Expected: ").concat(expected, ", Got: ").concat(result));
        }
    });
    console.log("All tests completed.");
}
//  Main Program
/*
rl.question('Enter mathematical expressions: ', (input: string) => {
    console.log(input);
    math_expressions = input;
    ScanToken();
    const tree = parseE();
    if (tree == null) throw new Error("Incorrect syntax of expression.");
    const value = tree.evaluate();
    console.log(value);
    rl.close();
})
*/
testMathExpressionParser();
