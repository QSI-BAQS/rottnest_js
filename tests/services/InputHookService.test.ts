import { TestDocumentGenerator, ClassMethodExtractor }
  from '../TestTemplateGenerator.ts';
import { InputHookService } from '../../src/service/InputHookService.ts';


const InputHookTestConditions = () => {
  return { hookmap: new InputHookService() }
};



const {
  InputHookServiceRegisterHookTemplate,
  InputHookServiceRemoveHookTemplate,
} = TestDocumentGenerator
  .with(InputHookService)
  .conditions(InputHookTestConditions);


InputHookServiceRegisterHookTemplate
  .use()
  .description(`Going to register an event hook`)
  .toTest((state: any, input: any) => {
    const hookmap = state.hookmap;
    return hookmap.registerHook(input);
  })
  .skip()
  .withInputs()
    .addInput(["click", function(_e: any) { console.log("It clicked"); }])
    .addInput(["click", function(_e: any) { console.log("It clicked"); }])
  .how()
  .withExpecteds()
    .addExpected(false)
    .addExpected(false)
  .validate()
  .eval();


InputHookServiceRemoveHookTemplate
  .use()
  .description(`Going to register an event hook`)
  .toTest((state: any, input: any) => {
    const hookmap = state.hookmap;
    const hookname = input[0];
    hookmap.registerHook(input);
    return hookmap.removeHook(hookname);
  })
  .skip()
  .withInputs()
    .addInput(["click", function(_e: any) { console.log("It clicked"); }])
    .addInput(["click", function(_e: any) { console.log("It clicked"); }])
  .how()
  .withExpecteds()
    .addExpected(true)
    .addExpected(true)
  .validate()
  .eval();
