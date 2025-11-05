import {
	CloseOutlined,
	EyeOutlined,
	EyeInvisibleOutlined,
	RollbackOutlined,
	CloseSquareFilled,
	CloseSquareOutlined, 
	SelectOutlined,
	ArrowLeftOutlined,
	ArrowUpOutlined,
	ArrowDownOutlined,
	ArrowRightOutlined
} from '@ant-design/icons'
import { expect } from 'vitest';
import { TestDocument } from '../TestDocument';
import { ComponentService } from '../../src/service/ComponentService';

/**
 * Checks to see if the component service can get the singleton
 * instance
 */
TestDocument.begin("ComponentService")
  .description("Get Instance - Ensures that it matches")
  .derive()
  .withState(
    (() => {
      return { component: ComponentService.GetInstance() };
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


/**
 * Sets up testing with the componet and checks to see if we can get the data
 * expect
 */
TestDocument.begin("ComponentService")
  .description("Get Instance - Ensures that it matches")
  .derive()
  .withState(
    (() => {
      return { component: ComponentService.GetInstance() };
    })()
  )
  .withInputs()
    .appendInputs([
      [CloseOutlined, "CloseOutlined"],
      [EyeOutlined, "EyeOutlined"],
      [EyeInvisibleOutlined, "EyeInvisibleOutlined"],
    	[RollbackOutlined, "RollbackOutlined"],
    	[ArrowUpOutlined, "ArrowUpOutlined"],
    	[ArrowDownOutlined, "ArrowDownOutlined"],
    	[ArrowLeftOutlined, "ArrowLeftOutlined"],
    	[ArrowRightOutlined, "ArrowRightOutlined"],
    	[CloseSquareFilled, "CloseSquareFilled"],
    	[CloseSquareOutlined, "CloseSquareOutlined"], 
    	[SelectOutlined, "SelectOutlined"]
    ])
  .how()
  .withEvaluator()
    .evaluator((state, input) => {
      const [obj, key] = input;
      const component = state.component;
      const ob = component;
      expect(component.getIcons()[key]).toEqual(obj);
    })
  .validate()
  .eval()
  
