How to Run

Ensure Node.js is installed.

Save the code to a .ts file (e.g., math_parser.ts).

Compile the TypeScript file to JavaScript using tsc:

-tsc astCalculator.ts

Run the compiled JavaScript file using Node.js:

-node astCalculator.js

Example of a math expresion
-3*(2-1)*(6+2)


Parsing Functions

parseE(): Parses expressions with addition and subtraction.

parseT(): Parses terms with multiplication and division.

parseF(): Parses factors, including numbers, parentheses, and unary negation.