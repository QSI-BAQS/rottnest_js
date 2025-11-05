import { TestDocumentGenerator, ClassMethodExtractor } from '../TestTemplateGenerator.ts';
import { NoServices, Services } from '../../src/service/Services.ts';
import { expect, vi } from 'vitest';
import enjson from '../../src/assets/help/en_help.json';



global.fetch = vi.fn(() => {
  return Promise.resolve(new Response(JSON.stringify(enjson)));
});

const TestConditionsForServices = () => {
  return {
    services: new NoServices()
  }
};

const ClassMethods = ClassMethodExtractor.extract(Services);

const {
  ServicesGetServicesTemplate,
} = TestDocumentGenerator
  .with(Services)
  .conditions(TestConditionsForServices)
ServicesGetServicesTemplate
  .use()
  .description(`
      Tests getting the services object
    `)
  .derive()
  .skip()
  .withInputs()
    .single("<none>")
  .withEvaluator()
    .evaluator((s: any, i) => {
      const services = s.services;
      expect(services.getServices()).toBeDefined();
    })
  .validate()
  .eval();



/*
  Services Test, extracting all objects
  Extracting all the methods and checking that it can be
  retrieved and retrieved
*/
const methodNames = ClassMethods.methods.map((e) => e.fnName)
methodNames.shift();

ServicesGetServicesTemplate
  .use()
  .description(`
      Tests that it can retrieve all the services
    `)
  .testing("check")
  .skip()
  .withInputs()
    .appendInputs(methodNames)
  .how()
  .withEvaluator()
    .evaluator((s: any, input: any) => {
      const fnName = input;
      const services = s.services;
      expect(services[fnName]()).toBeDefined();
    })
  .validate()
  .eval();

