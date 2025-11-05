
import { SuiteTemplateState, TestDocument } from './TestDocument.ts';

// Goal: Trawl through the class given and generate document templates
// from them.
export type TestFunctionData<S=any> = {
  fnName: string
  fn: Function
}

export type TestClassData<S=any> = {
  methods: Array<TestFunctionData>
  stateFn: () => S
}

export interface TestTypeClass {
  name: string
  prototype: any
}

export type TemplateMap<S=any, I=any, O=any> = {
  [key: string | symbol ]: SuiteTemplateState<S, I, O>
}

export class TestDocumentGenerator {


  static with<S>(type: TestTypeClass) {

    return {
      conditions: function(stateFn: () => S) {
        return TestDocumentGenerator.withClassAndState(type, stateFn);
      }
    }
  }

  static withClassAndState<S>(type: TestTypeClass, stateFn: () => S) {

    const documents: TemplateMap<S, any, any> = {};
    const className = type.name;
    const classData = ClassMethodExtractor.extract(type);
    classData.stateFn = stateFn;

    for(const fns of classData.methods) {
      const capitalisedFn =
      `${fns.fnName[0].toLocaleUpperCase()}${fns.fnName.substring(1)}`;
      const templateName = `${className}${capitalisedFn}Template`;
      const doc = TestDocument.template(
        `${className} - ${fns.fnName}`,
        stateFn);
      documents[templateName] = doc;
    }

    //Should expand out to objects
    return documents;
  }


  /**
   * Extracts name and other information for
   * generating a test document
   */
  static withFunction(fn: Function) {
    const fnName = fn.name;
    
    return {
      fnName,
      fn
    }
    
  }  
}



export class ClassMethodExtractor {
  static extract(type: TestTypeClass) {
    const fnData: Array<TestFunctionData> = [];
    const listOfNames: Array<string> =
      Object.getOwnPropertyNames(type.prototype);
    for(const fnName of listOfNames) {

      const fn = type.prototype[fnName];
      const fnDetails = TestDocumentGenerator.withFunction(fn);
      fnData.push(fnDetails);
    }

    return {
      methods: fnData,
      stateFn: () => ({} as any)
    }
  }
} 
