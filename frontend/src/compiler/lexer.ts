import { Token, TokenType } from './types';

export class Lexer {
  private input: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;
  private currentChar: string | null;

  private keywords = new Set([
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
    'class', 'new', 'this', 'import', 'export', 'default', 'from', 'require'
  ]);

  constructor(input: string) {
    this.input = input;
    this.currentChar = this.input.length > 0 ? this.input[0] : null;
  }

  private advance(): void {
    if (this.currentChar === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    this.position++;
    this.currentChar = this.position < this.input.length ? this.input[this.position] : null;
  }

  private peek(): string | null {
    const peekPos = this.position + 1;
    return peekPos < this.input.length ? this.input[peekPos] : null;
  }

  private skipWhitespace(): void {
    while (this.currentChar && /\s/.test(this.currentChar)) {
      this.advance();
    }
  }

  private readIdentifier(): Token {
    let result = '';
    const startLine = this.line;
    const startColumn = this.column;

    if (this.currentChar && /[0-9]/.test(this.currentChar)) {
      throw new Error(`Invalid identifier: Cannot start with number at line ${this.line}, column ${this.column}`);
    }

    while (this.currentChar && /[a-zA-Z_$][a-zA-Z0-9_$]*/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }

    const type = this.keywords.has(result) ? 'KEYWORD' : 'IDENTIFIER';
    return { type, value: result, line: startLine, column: startColumn };
  }

  private readString(): Token {
    const quote = this.currentChar;
    const startLine = this.line;
    const startColumn = this.column;
    let result = '';
    this.advance(); // Skip opening quote

    while (this.currentChar && this.currentChar !== quote) {
      if (this.currentChar === '\\' && this.peek() === quote) {
        this.advance();
      }
      if (this.currentChar === '\n') {
        throw new Error(`Unterminated string literal at line ${startLine}, column ${startColumn}`);
      }
      result += this.currentChar;
      this.advance();
    }

    if (!this.currentChar) {
      throw new Error(`Unterminated string literal at line ${startLine}, column ${startColumn}`);
    }

    this.advance(); // Skip closing quote
    return { type: 'STRING', value: result, line: startLine, column: startColumn };
  }

  private readNumber(): Token {
    let result = '';
    const startLine = this.line;
    const startColumn = this.column;
    let decimalPoints = 0;

    while (this.currentChar && /[0-9.]/.test(this.currentChar)) {
      if (this.currentChar === '.') {
        decimalPoints++;
        if (decimalPoints > 1) {
          throw new Error(`Invalid number format: multiple decimal points at line ${this.line}, column ${this.column}`);
        }
      }
      result += this.currentChar;
      this.advance();
    }

    return { type: 'NUMBER', value: result, line: startLine, column: startColumn };
  }

  getNextToken(): Token {
    while (this.currentChar !== null) {
      if (/\s/.test(this.currentChar)) {
        this.skipWhitespace();
        continue;
      }

      // Handle single-line comments
      if (this.currentChar === '/' && this.peek() === '/') {
        while (this.currentChar && this.currentChar !== '\n') {
          this.advance();
        }
        continue;
      }

      // Handle multi-line comments
      if (this.currentChar === '/' && this.peek() === '*') {
        const startLine = this.line;
        const startColumn = this.column;
        this.advance(); // Skip /
        this.advance(); // Skip *
        
        let foundEnd = false;
        while (this.currentChar) {
          if (this.currentChar === '*' && this.peek() === '/') {
            this.advance(); // Skip *
            this.advance(); // Skip /
            foundEnd = true;
            break;
          }
          this.advance();
        }

        if (!foundEnd) {
          throw new Error(`Unterminated multi-line comment starting at line ${startLine}, column ${startColumn}`);
        }
        continue;
      }

      if (/[a-zA-Z_$]/.test(this.currentChar)) {
        return this.readIdentifier();
      }

      if (/[0-9]/.test(this.currentChar)) {
        return this.readNumber();
      }

      if (this.currentChar === '"' || this.currentChar === "'") {
        return this.readString();
      }

      if (this.currentChar === '=' && this.peek() === '>') {
        const token = { type: 'OPERATOR' as TokenType, value: '=>', line: this.line, column: this.column };
        this.advance();
        this.advance();
        return token;
      }

      if ('=+-*/%&|^!<>'.includes(this.currentChar)) {
        const startLine = this.line;
        const startColumn = this.column;
        let value = this.currentChar;
        this.advance();

        if (this.currentChar === '=' || (value === '=' && this.currentChar === '>')) {
          value += this.currentChar;
          this.advance();
        }

        return { type: 'OPERATOR', value, line: startLine, column: startColumn };
      }

      if (this.currentChar === '.') {
        const token = { type: 'DOT' as TokenType, value: '.', line: this.line, column: this.column };
        this.advance();
        return token;
      }

      if (this.currentChar === '(' || this.currentChar === ')') {
        const token = { type: 'PARENTHESIS' as TokenType, value: this.currentChar, line: this.line, column: this.column };
        this.advance();
        return token;
      }

      if (this.currentChar === '{' || this.currentChar === '}') {
        const token = { type: 'BRACE' as TokenType, value: this.currentChar, line: this.line, column: this.column };
        this.advance();
        return token;
      }

      if (this.currentChar === '[' || this.currentChar === ']') {
        const token = { type: 'BRACKET' as TokenType, value: this.currentChar, line: this.line, column: this.column };
        this.advance();
        return token;
      }

      if (this.currentChar === ',') {
        const token = { type: 'COMMA' as TokenType, value: ',', line: this.line, column: this.column };
        this.advance();
        return token;
      }

      if (this.currentChar === ';') {
        const token = { type: 'SEMICOLON' as TokenType, value: ';', line: this.line, column: this.column };
        this.advance();
        return token;
      }

      throw new Error(`Invalid character '${this.currentChar}' at line ${this.line}, column ${this.column}`);
    }

    return { type: 'EOF', value: '', line: this.line, column: this.column };
  }
}