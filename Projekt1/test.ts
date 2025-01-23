//  Imports
import * as readline from 'readline';
import * as assert from 'assert';

//  Global varibles
let math_expressions = "";
let nextToken = "";
//  Interfaces 
interface ASTNode {

    evaluate(): number;

}

interface NumberNode extends ASTNode {

    value: number;

}

interface BinaryOperationNode extends ASTNode {

    left: ASTNode;

    right: ASTNode;

    operator: "+" | "-" | "*" | "/";

}

interface NegateNode extends ASTNode {
    points_towards: ASTNode;
}

const rl = readline.createInterface({
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

function parseE(): ASTNode {
    let operation;
    let b;

    let a = parseT();

    while (true) {

        if (["+", "-"].includes(nextToken) && math_expressions.length > 0) {
            operation = nextToken;
            ScanToken();
            let b = parseT();
            a = CreateBinaryOperationNode(a, b, operation);
        }
        else return a;
    }
}

function parseT(): ASTNode {
    let operation;
    let b;

    let a = parseF();

    while (true) {
        if (["*", "/"].includes(nextToken) && math_expressions.length > 0) {
            operation = nextToken;
            ScanToken();
            let b = parseF();
            a = CreateBinaryOperationNode(a, b, operation);
        }
        else return a;
    }

}

function parseF(): ASTNode {

    if (!isNaN(Number(nextToken))) {
        let nr_node = CreateNumberNode((Number(nextToken)));
        ScanToken();
        return nr_node;
    }

    else if (nextToken == "(") {
        ScanToken();
        let a = parseE();
        //@ts-ignore
        if (nextToken == ")") { 
            ScanToken();
            return a;
        }
        else throw new Error("Incorrect syntax of expression.");
    }
    else if (nextToken == "-") {
        ScanToken();
        return CreateNegateNode(parseF());
    }
    else throw new Error("Incorrect syntax of expression.");
}



function CreateNumberNode(value: number): NumberNode {
    return {
        value,
        evaluate(): number {
            return this.value;
        }
    }
}

function CreateBinaryOperationNode(left: ASTNode, right: ASTNode, operator: "+" | "-" | "*" | "/"): BinaryOperationNode {
    return {
        left,
        right,
        operator,
        evaluate(): number {
            const operation = operatorHash[operator];
            return operation(left.evaluate(), right.evaluate());
        }
    }
}

function CreateNegateNode(points_towards: ASTNode): NegateNode {
    return {
        points_towards,
        evaluate(): number {
            return -points_towards.evaluate();
        }

    }
}

function add(a: number, b: number): number {
    return a + b;
}

function subtract(a: number, b: number): number {
    return a - b;
}

function multiply(a: number, b: number): number {
    return a * b;
}

function divide(a: number, b: number): number {
    if (b === 0) throw new Error("Cannot divide by zero.");
    return a / b;
}

// Operation Function lookup table
const operatorHash: { [key: string]: (a: number, b: number) => number } = {
    '+': add,
    '-': subtract,
    '*': multiply,
    '/': divide
};


//test function 
function testMathExpressionParser() {
    console.log("Starting tests for the AST-based Mathematical Expression Parser...");

    // Test cases
    const tests = [
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

    tests.forEach(({ input, expected }, index) => {
        math_expressions = input; // Set the global input string.
        ScanToken(); // Initialize token scanning.
        const tree = parseE(); // Parse the expression into an AST.
        const result = tree.evaluate(); // Evaluate the AST.

        try {
            assert.strictEqual(result, expected);
            console.log(`Test ${index + 1} passed: ${input} = ${expected}`);
        } catch (error) {
            console.error(`Test ${index + 1} failed: ${input} | Expected: ${expected}, Got: ${result}`);
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
