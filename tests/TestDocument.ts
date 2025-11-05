import { expect, test, assert } from 'vitest';

// Generation function, how it is evaluated and the operation signature

export type InputGeneratorFn<I> = (index: number, ) => I;

export type OutputEvaluation<S, I, O> = (state: S, input: I, output: O) => void;

export type GenOutputEvaluation<S, I> = (state: S, input: I) => void;

export type TestOperation<S, I, O> = (state: S, input: I) => O; 

// 1. Description

export type SuiteBuilderDocumentationState<S, I, O> = {
  description: (desc: string) => SuiteBuilderTestOperation<S, I, O>
  document: TestDocument<S, I, O>
}

export type SuiteBuilderTestOperation<S, I, O> = {
  toTest: (operation: TestOperation<S, I, O>) => SuiteBuilderConditionState<S, I, O>,
  noop: () => SuiteBuilderConditionState<S, I, O>
  derive: () => SuiteBuilderConditionState<S, I, O>
  testing: (name: string) => SuiteBuilderConditionState<S, I, O>
  document: TestDocument<S, I, O>
}

// 2. Test Environment

export type SuiteBuilderConditionState<S, I, O> = {
  withState: (state: S) => SuiteBuilderInitialDecision<S, I, O>
  skip: () => SuiteBuilderInitialDecision<S, I, O>
  document: TestDocument<S, I, O>
}

// 3. Decision if Inputs or Generated

export type SuiteBuilderInitialDecision<S, I, O> = {
  withInputs: () => SuiteBuilderInputState<S, I, O>
  withGenerated: () => SuiteBuilderGenInputState<S, I, O>
  document: TestDocument<S, I, O>
}

// 4. Input states

export type SuiteBuilderInputState<S, I, O> = {
  single: (element: I) => SuiteBuilderEvaluationDecision<S, I, O>
  addInput: (element: I) => SuiteBuilderInputState<S, I, O>
  appendInputs: (all: Array<I>) => SuiteBuilderInputState<S, I, O>
  how: () => SuiteBuilderEvaluationDecision<S, I, O>
  document: TestDocument<S, I, O>
}

export type SuiteBuilderGenInputState<S, I, O> = {
  inputGenerator: (count: number, generator: InputGeneratorFn<I>)
    => SuiteBuilderGenInputState<S, I, O>
  how: () => SuiteBuilderEvaluationDecision<S, I, O>
  document: TestDocument<S, I, O>
}

// 5. Decision on output evaluation

export type SuiteBuilderEvaluationDecision<S, I, O> = {
  withExpecteds: () => SuiteBuilderOutputState<S, I, O>
  withEvaluator: () => SuiteBuilderEvaluator<S, I, O>
  document: TestDocument<S, I, O>
}

// 6. Output states

export type SuiteBuilderOutputState<S, I, O> = {
  addExpected: (element: O) => SuiteBuilderOutputState<S, I, O>
  appendExpecteds: (all: Array<O>) => SuiteBuilderOutputState<S, I, O>
  validate: () => SuiteBuilderFinalise<S, I, O>
  document: TestDocument<S, I, O>
}

export type SuiteBuilderEvaluator<S, I, O> = {
  evaluator: (evaluation: GenOutputEvaluation<S, I>) => SuiteBuilderEvaluator<S, I, O>
  validate: () => SuiteBuilderFinalise<S, I, O>
  document: TestDocument<S, I, O>
}

// 7. Evaluates the tests

export type SuiteBuilderFinalise<S, I, O> = {
  todo: (msg: string) => SuiteBuilderFinalise<S, I, O>;
  skip: () => SuiteBuilderFinalise<S, I, O>;
  eval: () => TestDocument<S, I, O>;
  document: TestDocument<S, I, O>
}


// Generating Functions

// Documentation 1.
function GenerateTestDocumentDescription<S, I, O>(
  document: TestDocument<S, I, O>): SuiteBuilderDocumentationState<S, I, O> {
  return {
    description: function(desc: string) {
      document.description = desc;
      return GenerateTestOperationState<S, I, O>(document);
    },
    document
  }
}

function GenerateTestOperationState<S, I, O>(document: TestDocument<S, I, O>)
  : SuiteBuilderTestOperation<S, I, O> {
      return {
        toTest: (operation: TestOperation<S, I, O>) => {
          document.testOperation = operation;
          return GenerateConditionState<S, I, O>(document);
        },
        derive: () => {
          const name = document.name.replace(" - ", "_");
          console.log(name);
          document.testOperation = new Function(
            `return function ${name}(_s, _i) {
              return {};
            }`
          )() as any;
          return GenerateConditionState<S, I, O>(document);
        },
        testing: (name: string) => {
          document.testOperation = new Function(
            `return function ${name}(_s, _i) {
              return {};
            }`
          )() as any;
          return GenerateConditionState<S, I, O>(document);
        },
        noop: () => {
          
          document.testOperation = new Function(
            `return function noop(_s, _i) {
              return {};
            }`
          )() as any;
          return GenerateConditionState<S, I, O>(document);
        },
        document
      }
  } 


// 2.
function GenerateConditionState<S, I, O>(document: TestDocument<S, I, O>): SuiteBuilderConditionState<S, I, O> {
  return {
    withState: function(state: S) {
      document.state = state;
      return GenerateBuilderInitialDecision<S, I, O>(document)
    },
    skip: function() {
      return GenerateBuilderInitialDecision<S, I, O>(document)
    },
    document
  }
}

// 3. Input add or input generation segment

function GenerateBuilderInitialDecision<S, I, O>(document: TestDocument<S, I, O>):
  SuiteBuilderInitialDecision<S, I, O> {

  return {
    
    withInputs: () => WithInputsFunctionBase(document),
    withGenerated: () => WithGeneratedFunctionBase(document),
    document
  }    
}

function WithGeneratedFunctionBase<S, I, O>(document: TestDocument<S, I, O>)
  :SuiteBuilderGenInputState<S, I, O> {

  return {
    inputGenerator: (count, genfn) => {
      for(let i = 0; i < count; i++) {
        document.inputElements.push(genfn(count));
      }
      return WithGeneratedFunctionBase<S, I, O>(document);        
    },
    how: () => ToEvaluationDecision<S, I, O>(document),
    document
  }
}

function WithInputsFunctionBase<S, I, O>(document: TestDocument<S, I, O>)
  :SuiteBuilderInputState<S, I, O>  {
  
  return {
    single: (input: I) => {
      
      document.inputElements.push(input);
      return ToEvaluationDecision(document);
    },
    addInput: (input: I) => {
      document.inputElements.push(input);
      return WithInputsFunctionBase<S, I, O>(document)
    },
    appendInputs: (all: Array<I>) => {
      for(const e of all) { document.inputElements.push(e) }
      return WithInputsFunctionBase<S, I, O>(document);
    },
    how: () => ToEvaluationDecision<S, I, O>(document),
    document
  }
}


function ToEvaluationDecision<S, I, O>(document: TestDocument<S, I, O>) {
  return MakeEvaluatorDecision(document)
}

// 4. Eval decision

function MakeEvaluatorDecision<S, I, O>(document: TestDocument<S, I, O>) {

  return {
    withExpecteds: () => {
      return WithOutputFunctionBase(document);
    },
    withEvaluator: () => {
      return WithOutputGeneratorBase(document);
    },
    document
  }

}

//5. Expecteds or Evaluator only

function WithOutputFunctionBase<S, I, O>(document: TestDocument<S, I, O>)
  :SuiteBuilderOutputState<S, I, O>  {
  
  return {
    addExpected: (output) => {
      document.outputElements.push(output);
      return WithOutputFunctionBase<S, I, O>(document)
    },
    appendExpecteds: (all: Array<O>) => {
      for(const e of all) { document.outputElements.push(e) }
      return WithOutputFunctionBase<S, I, O>(document);
    },
    validate: () => {
      if(document.inputElements.length !== document.outputElements.length) {
        throw new Error("|Input| != |Expected|, are not the same")
      }
      const testFn = document.testOperation;
      document.evaluationFn = (state, input, output) => {
        expect(testFn(state, input)).toEqual(output);
      };
      return FinaliseAndValidate(document);
    },
    document
  }
}

function WithOutputGeneratorBase<S, I, O>(document: TestDocument<S, I, O>)
  :SuiteBuilderEvaluator<S, I, O>  {

  return {
    evaluator: (evaluation) => {
      document.genEvaluationFn = evaluation;
      return WithOutputGeneratorBase<S, I, O>(document);
    },
    validate: () => {
      document.isEvalFnOnly = true;
      return FinaliseAndValidate(document);
    },
    document
  }

}

// 6. Finalise

function FinaliseAndValidate<S, I, O>(document: TestDocument<S, I, O>):
  SuiteBuilderFinalise<S, I, O> {

  return {
    todo: (msg: string) => {
      document.isTodo = true;
      document.isTodoMsg = msg;
      return FinaliseAndValidate<S, I, O>(document);
    },
    skip: () => {
      document.isSkipped = true;
      return FinaliseAndValidate<S, I, O>(document);
    },
    eval: () => {
      // Generate the test cases for this set

      const name = document.name;
      const fnName = document.testOperation.name.length ?
        document.testOperation.name : '<anon>';
      const inputs = document.inputElements;
      const expecteds = document.outputElements;
      const state = document.state;

      const evalFn = document.evaluationFn;
      const genEvalFn = document.genEvaluationFn;
      const evalOnly = document.isEvalFnOnly;
      const testFn = document.testOperation;
      const isTodo = document.isTodo;
      const isTodoMsg = document.isTodoMsg;
      const isSkipped = document.isSkipped;

      for(let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        let inputStr = JSON.stringify(input);
        if(inputStr.length > 8) {
          inputStr = inputStr.substring(0, 6) + '..';
        }
        
        let expectedStr = '';
        if(evalOnly) {
          let testNameFmt = `${name} - ${fnName}(${inputStr}) #${i+1}`
          
          test(testNameFmt, async function({skip, annotate}) {
            if(isTodo) { await annotate(isTodoMsg) }
            if(isSkipped) { skip() }
            testFn(state, input);
            genEvalFn(state, input);
          })
        } else {
          let expected = expecteds[i];
          expectedStr = JSON.stringify(expected);

          if(expectedStr.length > 8) {
            expectedStr = expectedStr.substring(0, 6) +'..';
          }
          let testNameFmt = `${name} - ${fnName}(${inputStr}) = ${expectedStr} #${i+1}`
        
          test(testNameFmt, async function({ skip, annotate }) {
            if(isTodo) { await annotate(isTodoMsg) }
            if(isSkipped) { skip() }
            evalFn(state, input, expected);
          })
        }
        
        
        
      }
      
      return document;
    },
    document
  }
}


// Test Document

export type SuiteTemplateState<S, I, O> = {
  use: () => SuiteBuilderDocumentationState<S, I, O>
}

export class TestDocument<S=any, I=any, O=any> {

  name: string = '';
  description: string = '';
  state: S | any = {};
  inputElements: Array<I> = [];
  outputElements: Array<O> = [];

  isTodo: boolean = false;
  isTodoMsg: string = '';
  hasEvalFn: boolean = false;
  isEvalFnOnly: boolean = false;
  isSkipped: boolean = false;

  testOperation: TestOperation<S, I, O> = (_s: S, _i: I) => {
    throw new Error("Test operation has not been set");
  }

  evaluationFn: OutputEvaluation<S, I, O> = (_s: S, _i: I, _o: O) => {
    throw new Error("Evaluation function has not been set")
  };

  genEvaluationFn: GenOutputEvaluation<S, I> = (_s: S, _i: I) => {
    throw new Error("Evaluation function has not been set")
  };
  
  
  static begin<S=any, I=any, O=any>(name: string):
    SuiteBuilderDocumentationState<S, I, O> {
    const builder = new TestDocument<S, I, O>();
    builder.name = name;
    return GenerateTestDocumentDescription(builder);
  }

  static template<S=any, I=any, O=any>(
    name: string,
    state: () => S): {
      use: () => SuiteBuilderDocumentationState<S, I, O>
    } {
      
    
    return { use: () => {
      const nbuilder = new TestDocument();
      nbuilder.name = name;      
      nbuilder.state = state();
      
      return GenerateTestDocumentDescription(nbuilder);
    }}
  }

  cloneWithChangeSet() {
    
  }
}
