import { test, expect, expectTypeOf } from 'vitest';
import { TestDocument } from '../TestDocument';
import { LayoutRecencyService }
  from '../../src/service/LayoutRecencyService';;


const TestDocumentPrefix = "LayoutRecencyServiceTest"

TestDocument.begin(`${TestDocumentPrefix} - Construction`)
  .description("Get Instance - Ensures that it matches")
  .derive()
  .withState(
    (() => {
      const component = LayoutRecencyService.GetInstance();
      component.drain();
      return { component };
    })()
  )
  .withInputs()
    .single("<none>")
  .withEvaluator()
    .evaluator((state, _input) => {
      const component = state.component;
      expect(component).toBeDefined();
    })
  .validate()
  .eval();


TestDocument.begin(`${TestDocumentPrefix} - Construction`)
  .description("")
  .derive()
  .withState(
    (() => {
      const recency = LayoutRecencyService.GetInstance();
      recency.drain();
      return { recency };
    })()
  )
  .withInputs()
    .single("<none>")
  .withEvaluator()
    .evaluator((state, _input) => {
      const recency = state.recency;
      expect(recency.getRecents()).toEqual({});
      expect(recency.getNames()).toEqual({});
    })
  .validate()
  .eval();


TestDocument.begin(`${TestDocumentPrefix} - Construction`)
  .description("")
  .derive()
  .withState(
    (() => {
      const recency = LayoutRecencyService.GetInstance();
      recency.drain();
      return { recency };
    })()
  )
  .withInputs()
    .single("<none>")
  .withEvaluator()
    .evaluator((state, _input) => {
      const recency = state.recency;
      const expectedEntry = {
        name: 'layout1',
        data: { datacube: 'this is a cube' },
        key: `${LayoutRecencyService.PrefixKey}${0}`
      };

      const entry = LayoutRecencyService.ConstructEntry(
          'layout1',
        { datacube: 'this is a cube' }
      );

      recency.pushRecent(entry);

      expect(recency.getRecents()).toEqual({
        [expectedEntry.key]: expectedEntry
      });
      
      expect(recency.getNames()).toEqual({
        [expectedEntry.name]: expectedEntry.key
      });
    })
  .validate()
  .eval();
