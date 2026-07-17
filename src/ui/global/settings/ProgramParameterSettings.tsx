import React, { ChangeEvent, MouseEvent } from "react"
import { Services } from "../../../service/Services";
import { MessageType } from "../../../net/Protocol";
import { PluginPackage } from "./GeneralSettings";
import { ProgramParameterDiffResult, ProgramPluginContext, ProgramPluginService } from "../../../service/ProgramPluginService";
import style from '../../styles/PluginSettingsForm.module.css';
import paramStyle from '../../styles/ProgramParameterSettings.module.css';


/**
 * Displays and allows the data to be edited
 */
export type NumericParameterData = {
  name: string
  kind: string
  value: number
  isFloat: boolean
  updateFn: (n: number) => void;
  hasChanged: boolean
}

/**
 * Class component for a parameter container
 * will need to expand for string and others
 */
export class NumericParameterContainer
  extends React.Component<NumericParameterData, {}> {


  render() {
    const isFloat = this.props.isFloat;
    const name = this.props.name;
    const kind = this.props.kind;
    const value = this.props.value;
    const updateFn = this.props.updateFn;
    const convertFn = isFloat ? Number.parseFloat : Number.parseInt;
    const hasChanged = this.props.hasChanged;
    
    const inputUpdateFn = (e: ChangeEvent<HTMLInputElement>) => {
      let newValue: string | number = e.target.value;
      if(e.target.value.length > 0) {
        newValue = convertFn(newValue);
        if(Number.isNaN(newValue)) {
          newValue = '';
        }
      }
      updateFn(newValue as number);
    }

    return (
      <div key={`param_${name}`} className={paramStyle.numericContainer}
          style={{backgroundColor: hasChanged ? '#ff000066' : '#00000000',
            borderRadius: '5px'}}>
        <label htmlFor={name}>{`${name} - ${kind}`}</label>
        <input onChange={inputUpdateFn} name={name} type="text" value={value}></input>
      </div>
    )
    
  }
}


/**
 * Services and params are passed, params are the parameters for
 * the container, services are focused on updating
 */
export type ProgramParameterData = {
  services: Services,
  parameterKeys: Array<string>,
  closeFn: (data:PluginPackage) => void
}

/**
 * ProgramParameterState, holds a map
 */
export type ProgramParameterState = {
  context: ProgramPluginContext;
}

/**
 * Program parameterisation container
 * Will break it down into what parameters it can set
 */
export class ProgramParametersContainer
  extends React.Component<ProgramParameterData, ProgramParameterState> {

  programService: ProgramPluginService = ProgramPluginService.GetPluginService();
  state: ProgramParameterState = {
    context: this.generateParametersMap()
  };

  /**
    * Updates the state given the change of state
    */
  updateState() {
    const nstate = {...this.state};
    this.setState(nstate);
  }

  /**
    * Generates a parameters map
    * key as first element,
    * key, kind, value and extra as second 
    */
  generateParametersMap() {
    return this.programService
      .getContext()
      .clone()
  }

  /**
    * Closes the program parameter window
    */
  closeWindow() {
    const closeFn = this.props.closeFn;
    closeFn({} as any)
  }

  /**
    * General render method for the parameter settings
    */
  render() {

    const self = this;
    const services = this.props.services;
    const programService = services.getProgramPluginService();
    const programContext = programService.getContext();
    const currentContext = this.state.context;
    const parameterKeys = this.props.parameterKeys;

    const validateChanges = (): ProgramParameterDiffResult => {
      if(currentContext !== null) {
        return programContext.diff(currentContext);
      } else {
        return programContext.diff(ProgramPluginContext.empty());
      }
    };

    const { deviates, deviations } = validateChanges();
    const renderedContainers = parameterKeys
      .map((key: string) => {
        const params = programContext.getParameters()[key];
        const paramName = key;
        const paramType = params[0];
        const paramValue = params[1];

        const updateFn = (n: number) => {
          programContext.setParameterValue(paramName, n);
          currentContext.replaceContext(programContext);
          const nstate = {...self.state};
          self.setState(nstate);
        }
          
        return <NumericParameterContainer
          key={`numparam_${paramName}`} name={paramName} kind={paramType}
          hasChanged={deviations.has(paramName)!}
          value={paramValue}
          isFloat={paramType === 'float'}
          updateFn={updateFn}
          />
      });


    const argsUpdate = (_: MouseEvent<HTMLButtonElement>) => {
      const currentContext = this.state.context;
      
      const notifyserv = services.getNotifyService();
      const payload = currentContext.parametersToPayload()

      services.getNetworkService()
        .getNetworkService().sendObject(
          MessageType.Executable.SetConfig,
          {
            "executable_config" : payload
          });

      programContext.replaceContext(currentContext);
      notifyserv.makeMessageWithId('param-set-notify',
        "Program Parameters",
        "Program parameters have been set");
      this.closeWindow();
    }

    return (
      <>
      <div className={paramStyle.paramContainer}>
        {renderedContainers}
        {
          deviates ? <div style={
          {
            textAlign: "center",
            color: '#ff0000ff',
            paddingTop: '0.5em'
          }
        }>Changes are not saved</div> : <></>}
      </div>
      <div style={{display: 'flex'}}>
      <button className={style.pluginApply}
        onClick={argsUpdate}>Save</button>
      <div className={style.pluginSep}></div>
      </div>
      </>
    );
  }
}
