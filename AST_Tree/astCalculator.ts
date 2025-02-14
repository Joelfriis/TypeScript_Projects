//imports
import * as readline from 'readline';

//  Interfaces 
interface ASTNode {

    evaluate(): number;

}   
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

class NumberNode implements ASTNode {

    value: number;

    constructor(value: number) {
        this.value = value;
    }

    evaluate(): number {
        return this.value;
    }

}

//  Classes
class BinaryOperationNode implements ASTNode {

    left: ASTNode | null;

    right: ASTNode | null;

    operator: "+" | "-" | "*" | "/" | null;

    constructor(left: ASTNode, right: ASTNode, operator: "+" | "-" | "*" | "/") {
        this.left = left;
        this.right = right;
        this.operator = operator;
    }

    evaluate(): number {

        if( this.operator != null  && this.left != null, && this.right != null) {
            const operation = operatorHash[this.operator]!;
            return operation(this.left.evaluate()!, this.right.evaluate()!);
        }
        else throw new Error(`Operator ${this.operator} is not supported.`);

    }
}

//  Functions
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
rl.question('Enter mathematical expressions: ', (math_expressions: string) => {
    let test = "";
    for( const char of math_expressions ) {
        if( !isNaN(Number(char)) ) {
            test = test + char;
        }
        else {
            

        }
    }

    rl.close();
})
