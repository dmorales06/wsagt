import { ASTNode, ThreeAddressCode } from './types';

export class CodeGenerator {
  private tempCounter: number = 1;
  private code: ThreeAddressCode[] = [];

  private getTemp(): string {
    return `t${this.tempCounter++}`;
  }

  generate(node: ASTNode): string {
    if (node.type === 'BinaryLiteral') {
      const temp = this.getTemp();
      this.code.push({
        result: temp,
        op1: node.value + 'B'
      });
      return temp;
    }

    if (node.type === 'Identifier') {
      return node.value!;
    }

    if (node.type === 'BinaryOp') {
      const left = this.generate(node.left!);
      const right = this.generate(node.right!);
      const temp = this.getTemp();
      this.code.push({
        result: temp,
        op1: left,
        op2: right,
        operator: node.operator
      });
      return temp;
    }

    if (node.type === 'Assignment') {
      const right = this.generate(node.right!);
      const temp = (node.left as ASTNode).value!;
      this.code.push({
        result: temp,
        op1: right
      });
      return temp;
    }

    throw new Error(`Unknown node type: ${node.type}`);
  }

  getCode(): ThreeAddressCode[] {
    return this.code;
  }
}