//  Imports
import * as readline from 'readline';

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

//  Main Program

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
