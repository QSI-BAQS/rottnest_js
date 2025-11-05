
import { ProgramPluginService } from '../../src/service/ProgramPluginService';
import { TestDocument } from '../TestDocument';
import { expect } from 'vitest';
import { RefreshService, NetworkService } from '../mocks/ServicesMock';

/**
 * Templates the starting component of the test document
 */
const ProgramPluginServiceDocument = TestDocument.template("ProgramPluginService", () => {
    const prg = new ProgramPluginService(
      new RefreshService() as any,
      new NetworkService() as any);

    prg.stored = {
      programs: [{
        name: "Magic Program 1",
        params: []
      }],
      config: { contents: '[]' }
    };
    return { prgservice: prg };
  });



ProgramPluginServiceDocument
  .use()
  .description("Testing setting of an executable")
  .toTest(function setCurrentExecutable(state, input) {
    const prgservice = state.prgservice;
    prgservice.setCurrentExecutable(input);
  })
  .skip()
  .withInputs()
    .addInput("Magic Program 1")
  .how()
  .withEvaluator()
    .evaluator((state, input) => {
      const prgservice = state.prgservice;
      expect(prgservice.current).toEqual({
          name: "Magic Program 1",
          params: []
        })
    })
  .validate()
  .eval();

ProgramPluginServiceDocument
  .use()
  .description("Get parameters - exists")
  .toTest(function getParameters(state, input) {
    const prgservice = state.prgservice;
    prgservice.setCurrentExecutable(input);

  })
  .skip()
  .withInputs()
    .addInput("Magic Program 1")
  .how()
  .withEvaluator()
    .evaluator((state, input) => {
      const prgservice = state.prgservice;
      expect(prgservice.getParameters(input)).toEqual([])
    })
  .validate()
  .eval();

ProgramPluginServiceDocument
  .use()
  .description("Get parameters - null")
  .testing('getParameters')
  .skip()
  .withInputs()
    .addInput("Magic Program Nothing")
    .addInput(null)
  .how()
  .withEvaluator()
    .evaluator((state, input) => {
      const prgservice = state.prgservice;
      expect(prgservice.getParameters(input)).toEqual(null)
    })
  .validate()
  .eval();

  
ProgramPluginServiceDocument
  .use()
  .description("Get parameters - null")
  .testing('getParameters')
  .skip()
  .withInputs()
    .addInput("Magic Program Nothing")
    .addInput(null)
  .how()
  .withEvaluator()
    .evaluator((state, input) => {
      const prgservice = state.prgservice;
      expect(prgservice.getParameters(input)).toEqual(null)
    })
  .validate()
  .eval();

  
ProgramPluginServiceDocument
  .use()
  .description(`
    Get Program Config, makes sure it gets the default config
  `)
  .testing("getProgramConfig")
  .skip()
  .withInputs()
    .single("<none>")
  .withEvaluator()
    .evaluator((state, input) => {
      const prgservice = state.prgservice;
      expect(prgservice.getProgramConfig()).toEqual('[]')
    })
  .validate()
  .eval();

  
ProgramPluginServiceDocument
  .use()
  .description(`
    Get Program List
  `)
  .testing("getProgramList")
  .skip()
  .withInputs()
    .single("<none>")
  .withEvaluator()
    .evaluator((state, input) => {
      const prgservice = state.prgservice;
      expect(prgservice.getProgramConfig()).toEqual('[]')
    })
  .validate()
  .todo(`Currently not ready`)
  .eval();

  
ProgramPluginServiceDocument
  .use()
  .description(`
    Get Program List
  `)
  .testing("getCurrentExe")
  .skip()
  .withInputs()
    .single("<none>")
  .withEvaluator()
    .evaluator((state, input) => {
      const prgservice = state.prgservice;
      expect(prgservice.getProgramConfig()).toEqual('[]')
    })
  .validate()
  .todo(`Currently not ready`)
  .skip()
  .eval();
