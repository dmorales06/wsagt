import { Lexer } from './lexer';
import { ASTNode, Token } from './types';

export class Parser {
  private lexer: Lexer;
  private currentToken: Token;

  constructor(input: string) {
    this.lexer = new Lexer(input);
    this.currentToken = this.lexer.getNextToken();
  }

  private eat(tokenType: Token['type']): void {
    if (this.currentToken.type === tokenType) {
      this.currentToken = this.lexer.getNextToken();
    } else {
      throw new Error(`Expected ${tokenType}, got ${this.currentToken.type} at line ${this.currentToken.line}, column ${this.currentToken.column}`);
    }
  }

  private parseIdentifier(): ASTNode {
    const token = this.currentToken;
    this.eat('IDENTIFIER');
    return {
      type: 'Identifier',
      value: token.value,
      line: token.line,
      column: token.column
    };
  }

  private parseLiteral(): ASTNode {
    const token = this.currentToken;
    if (token.type === 'STRING' || token.type === 'NUMBER') {
      this.eat(token.type);
      return {
        type: 'Literal',
        value: token.value,
        line: token.line,
        column: token.column
      };
    }
    throw new Error(`Expected literal, got ${token.type} at line ${token.line}, column ${token.column}`);
  }

  private parseCallExpression(callee: ASTNode): ASTNode {
    this.eat('PARENTHESIS'); // (
    const args: ASTNode[] = [];
    
    if (this.currentToken.value !== ')') {
      args.push(this.parseExpression());
      while (this.currentToken.type === 'COMMA') {
        this.eat('COMMA');
        args.push(this.parseExpression());
      }
    }
    
    this.eat('PARENTHESIS'); // )

    return {
      type: 'CallExpression',
      callee,
      arguments: args,
      line: callee.line,
      column: callee.column
    };
  }

  private parseMemberExpression(object: ASTNode): ASTNode {
    this.eat('DOT');
    const property = this.parseIdentifier();
    
    return {
      type: 'MemberExpression',
      object,
      property,
      line: object.line,
      column: object.column
    };
  }

  private parsePrimary(): ASTNode {
    const token = this.currentToken;

    switch (token.type) {
      case 'IDENTIFIER':
        return this.parseIdentifier();
      case 'STRING':
      case 'NUMBER':
        return this.parseLiteral();
      case 'BRACE': // {
        return this.parseObjectExpression();
      case 'BRACKET': // [
        return this.parseArrayExpression();
      default:
        throw new Error(`Unexpected token ${token.type} at line ${token.line}, column ${token.column}`);
    }
  }

  private parseObjectExpression(): ASTNode {
    const startToken = this.currentToken;
    this.eat('BRACE'); // {
    const properties: ASTNode[] = [];

    while (this.currentToken.type !== 'BRACE' || this.currentToken.value !== '}') {
      const key = this.parsePrimary();
      this.eat('OPERATOR'); // :
      const value = this.parseExpression();

      properties.push({
        type: 'Property',
        key,
        value,
        line: key.line,
        column: key.column
      });

      if (this.currentToken.type === 'COMMA') {
        this.eat('COMMA');
      }
    }

    this.eat('BRACE'); // }

    return {
      type: 'ObjectExpression',
      properties,
      line: startToken.line,
      column: startToken.column
    };
  }

  private parseArrayExpression(): ASTNode {
    const startToken = this.currentToken;
    this.eat('BRACKET'); // [
    const elements: ASTNode[] = [];

    while (this.currentToken.type !== 'BRACKET' || this.currentToken.value !== ']') {
      elements.push(this.parseExpression());
      if (this.currentToken.type === 'COMMA') {
        this.eat('COMMA');
      }
    }

    this.eat('BRACKET'); // ]

    return {
      type: 'ArrayExpression',
      elements,
      line: startToken.line,
      column: startToken.column
    };
  }

  private parseExpression(): ASTNode {
    let left = this.parsePrimary();

    while (true) {
      if (this.currentToken.type === 'DOT') {
        left = this.parseMemberExpression(left);
      } else if (this.currentToken.type === 'PARENTHESIS' && this.currentToken.value === '(') {
        left = this.parseCallExpression(left);
      } else {
        break;
      }
    }

    if (this.currentToken.type === 'OPERATOR') {
      const operator = this.currentToken.value;
      const line = this.currentToken.line;
      const column = this.currentToken.column;
      this.eat('OPERATOR');
      const right = this.parseExpression();

      return {
        type: 'BinaryExpression',
        operator,
        left,
        right,
        line,
        column
      };
    }

    return left;
  }

  private parseVariableDeclaration(): ASTNode {
    const token = this.currentToken;
    const kind = token.value as 'const' | 'let' | 'var';
    this.eat('KEYWORD');

    const name = this.parseIdentifier();
    this.eat('OPERATOR'); // =
    const init = this.parseExpression();

    return {
      type: 'VariableDeclaration',
      kind,
      name,
      value: init,
      line: token.line,
      column: token.column
    };
  }

  private parseFunctionDeclaration(): ASTNode {
    const token = this.currentToken;
    this.eat('KEYWORD'); // function
    const name = this.parseIdentifier();
    
    this.eat('PARENTHESIS'); // (
    const params: ASTNode[] = [];
    
    if (this.currentToken.value !== ')') {
      params.push(this.parseIdentifier());
      while (this.currentToken.type === 'COMMA') {
        this.eat('COMMA');
        params.push(this.parseIdentifier());
      }
    }
    
    this.eat('PARENTHESIS'); // )
    
    this.eat('BRACE'); // {
    const body: ASTNode[] = [];
    
    while (this.currentToken.value !== '}') {
      body.push(this.parseStatement());
    }
    
    this.eat('BRACE'); // }

    return {
      type: 'FunctionDeclaration',
      name,
      params,
      body,
      line: token.line,
      column: token.column
    };
  }

  private parseStatement(): ASTNode {
    if (this.currentToken.type === 'KEYWORD') {
      switch (this.currentToken.value) {
        case 'const':
        case 'let':
        case 'var':
          return this.parseVariableDeclaration();
        case 'function':
          return this.parseFunctionDeclaration();
        case 'return':
          const token = this.currentToken;
          this.eat('KEYWORD');
          const expression = this.parseExpression();
          return {
            type: 'ReturnStatement',
            value: expression,
            line: token.line,
            column: token.column
          };
      }
    }

    const expression = this.parseExpression();
    return {
      type: 'ExpressionStatement',
      value: expression,
      line: expression.line,
      column: expression.column
    };
  }

  parse(): ASTNode {
    const statements: ASTNode[] = [];
    
    while (this.currentToken.type !== 'EOF') {
      statements.push(this.parseStatement());
      if (this.currentToken.type === 'SEMICOLON') {
        this.eat('SEMICOLON');
      }
    }

    return {
      type: 'Program',
      body: statements,
      line: 1,
      column: 1
    };
  }
}