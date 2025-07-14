import { ASTNode, AnalysisResult } from './types';

export class Analyzer {
  private results: AnalysisResult[] = [];

  private analyzeNode(node: ASTNode): void {
    switch (node.type) {
      case 'Program':
        this.analyzeProgram(node);
        break;
      case 'VariableDeclaration':
        this.analyzeVariableDeclaration(node);
        break;
      case 'FunctionDeclaration':
        this.analyzeFunctionDeclaration(node);
        break;
      case 'CallExpression':
        this.analyzeCallExpression(node);
        break;
      case 'MemberExpression':
        this.analyzeMemberExpression(node);
        break;
    }
  }

  private analyzeProgram(node: ASTNode): void {
    const body = node.body as ASTNode[];
    for (const statement of body) {
      this.analyzeNode(statement);
    }
  }

  private analyzeVariableDeclaration(node: ASTNode): void {
    this.results.push({
      nodeType: 'Variable Declaration',
      description: `${node.kind} ${(node.name as ASTNode).value}`,
      line: node.line,
      column: node.column,
      code: `${node.kind} ${(node.name as ASTNode).value}`
    });
  }

  private analyzeFunctionDeclaration(node: ASTNode): void {
    this.results.push({
      nodeType: 'Function Declaration',
      description: `function ${(node.name as ASTNode).value}(${node.params?.map(p => p.value).join(', ')})`,
      line: node.line,
      column: node.column,
      code: `function ${(node.name as ASTNode).value}`
    });

    const body = node.body as ASTNode[];
    for (const statement of body) {
      this.analyzeNode(statement);
    }
  }

  private analyzeCallExpression(node: ASTNode): void {
    let calleeName = '';
    if (node.callee?.type === 'Identifier') {
      calleeName = node.callee.value!;
    } else if (node.callee?.type === 'MemberExpression') {
      const obj = (node.callee.object as ASTNode).value;
      const prop = (node.callee.property as ASTNode).value;
      calleeName = `${obj}.${prop}`;
    }

    this.results.push({
      nodeType: 'Function Call',
      description: `Call to ${calleeName}()`,
      line: node.line,
      column: node.column,
      code: calleeName
    });
  }

  private analyzeMemberExpression(node: ASTNode): void {
    const obj = (node.object as ASTNode).value;
    const prop = (node.property as ASTNode).value;

    if (obj === 'process' || obj === 'require' || obj === 'module' || obj === 'global') {
      this.results.push({
        nodeType: 'Node.js API Usage',
        description: `Using Node.js ${obj}.${prop}`,
        line: node.line,
        column: node.column,
        code: `${obj}.${prop}`
      });
    }
  }

  analyze(ast: ASTNode): AnalysisResult[] {
    this.results = [];
    this.analyzeNode(ast);
    return this.results;
  }
}