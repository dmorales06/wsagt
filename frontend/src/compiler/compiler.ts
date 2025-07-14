import { Parser } from './parser';
import { Analyzer } from './analyzer';
import { AnalysisResult } from './types';

export class Compiler {
  compile(input: string): AnalysisResult[] {
    const parser = new Parser(input);
    const ast = parser.parse();
    const analyzer = new Analyzer();
    return analyzer.analyze(ast);
  }
}