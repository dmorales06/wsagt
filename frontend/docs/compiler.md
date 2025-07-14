# TypeScript Compiler Documentation

## Overview

This project implements a custom compiler that performs lexical analysis, parsing, and code generation for a simple programming language. The compiler is built with TypeScript and includes features for detecting Node.js code patterns and handling binary operations.

## Architecture

The compiler is structured into several key components:

### 1. Lexical Analyzer (Lexer)

Located in `src/compiler/lexer.ts`, the lexer performs tokenization of the input source code.

#### Supported Token Types
- Keywords (`const`, `let`, `var`, `function`, etc.)
- Identifiers
- Numbers
- Strings
- Operators
- Punctuation
- Comments (single-line and multi-line)

#### Features
- Line and column tracking
- Error reporting with position information
- Comment handling
- String literal parsing with escape sequences

### 2. Parser

Located in `src/compiler/parser.ts`, the parser constructs an Abstract Syntax Tree (AST) from the token stream.

#### Supported Constructs
- Variable declarations
- Function declarations
- Object expressions
- Array expressions
- Binary expressions
- Member expressions
- Call expressions

#### AST Node Types
```typescript
type NodeType =
  | 'Program'
  | 'VariableDeclaration'
  | 'FunctionDeclaration'
  | 'ExpressionStatement'
  | 'CallExpression'
  | 'MemberExpression'
  | 'Identifier'
  | 'Literal'
```

### 3. Analyzer

Located in `src/compiler/analyzer.ts`, the analyzer performs static analysis of the AST.

#### Features
- Node.js API usage detection
- Function call analysis
- Variable declaration tracking
- Member expression analysis

### 4. Code Generator

Located in `src/compiler/codeGenerator.ts`, generates three-address code (3AC) from the AST.

#### Features
- Three-address code generation
- Temporary variable management
- Binary operation handling
- Assignment operation processing

## Usage Examples

### Basic Lexical Analysis

```typescript
const lexer = new Lexer(sourceCode);
let token = lexer.getNextToken();
while (token.type !== 'EOF') {
  console.log(token);
  token = lexer.getNextToken();
}
```

### Parsing Code

```typescript
const parser = new Parser(sourceCode);
const ast = parser.parse();
```

### Static Analysis

```typescript
const analyzer = new Analyzer();
const results = analyzer.analyze(ast);
```

## Error Handling

The compiler implements comprehensive error handling:

1. **Lexical Errors**
   - Invalid characters
   - Unterminated strings
   - Position information included

2. **Syntax Errors**
   - Unexpected tokens
   - Missing delimiters
   - Invalid expression structure

3. **Analysis Errors**
   - Type mismatches
   - Undefined references
   - Invalid operations

## Type Definitions

### Token Interface
```typescript
interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}
```

### AST Node Interface
```typescript
interface ASTNode {
  type: string;
  value?: string;
  line: number;
  column: number;
  // Additional properties based on node type
}
```

### Analysis Result Interface
```typescript
interface AnalysisResult {
  nodeType: string;
  description: string;
  line: number;
  column: number;
  code: string;
}
```

## Best Practices

1. **Error Recovery**
   - Implement error recovery mechanisms
   - Provide meaningful error messages
   - Include position information

2. **Performance**
   - Use efficient data structures
   - Implement lazy token generation
   - Optimize AST traversal

3. **Code Organization**
   - Separate concerns (lexing, parsing, analysis)
   - Use TypeScript interfaces
   - Maintain consistent error handling

## Future Enhancements

1. **Optimization Passes**
   - Common subexpression elimination
   - Constant folding
   - Dead code elimination

2. **Additional Features**
   - Source maps support
   - More sophisticated type checking
   - Code formatting capabilities

3. **Tooling Integration**
   - IDE integration
   - Debugging support
   - Documentation generation

## Contributing

When contributing to this project:

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure all tests pass
5. Submit detailed pull requests

## License

This project is licensed under the MIT License. See the LICENSE file for details.