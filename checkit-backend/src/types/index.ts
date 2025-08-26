
// Test Suite
export interface TestSuiteType {
  title: string;
  filename: string;
  type?: string
  description?: string;
  testCases: TestCasesType[];
}
export interface TestCasesType {
  input: string[];
  output: string[];
  description?: string;
  helper?: string;
  reject?: Boolean
}