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
import { useEffect, useRef, useState, useMemo,
  useCallback, useContext, useId, useTransition,
  ComponentType
} from 'react';
import { ArchWorkspaceZone } from '../ui/workspace/WorkspaceZone';
import { RunChartContainer } from '../ui/runchart/RunChart';
import { RunChartAuxColumn, RunChartNodeColumn } from '../ui/runchart/RunChartColumn';
import { ReactComponentExports } from 'rottnest-plugin/schema/ServicesHolder';
import { MessageType } from '../net/Protocol';
import { CallGraphSpace } from '../ui/callgraph/CallGraphSpace';
import { CGGraphColumn, CGNodeColumn } from '../ui/callgraph/CallGraphColumn';

const AWZ = ArchWorkspaceZone as any;

export type RenderableExport = ComponentType;


export type IconComponentExports = {
  [key: string]: RenderableExport
}

/**
 * IconService to expose certain assets over
 * to the plugins themselves
 */
export class ComponentService {

  icons: IconComponentExports = {
    CloseOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
  	RollbackOutlined,
  	ArrowUpOutlined,
  	ArrowDownOutlined,
  	ArrowLeftOutlined,
  	ArrowRightOutlined,
  	CloseSquareFilled,
  	CloseSquareOutlined, 
  	SelectOutlined
  }

  reactRefs: ReactComponentExports = {
    useRef, useState, useEffect, useMemo, useCallback,
    useId, useContext, useTransition,
    ArchWorkspaceZone: AWZ,
    RunChartContainer: RunChartContainer,
    CallGraphSpace: CallGraphSpace,
    CGGraphColumn: CGGraphColumn,
    CGNodeColumn: CGNodeColumn,
    RunChartNodeColumn: RunChartNodeColumn,
    RunChartAuxColumn: RunChartAuxColumn
  }

  static instance: ComponentService | null = null;
  static GetInstance() {
    if(this.instance === null) {
      this.instance = new ComponentService();
    }
    return this.instance;
  }

  /**
   * Returns the react components
   */
  getReactExports(): ReactComponentExports {
    return this.reactRefs
  }

  /**
   * Simply is a storage service for ant-design icons
   */
  getIcons() {
    return this.icons;
  }

  /**
   * MessageTypes type that is exported
   */
  getMessageTypes() {
    return MessageType;
  }


  /**
    * Swaps the icon that has been loaded with
    * another - This allows for a plugin oriented UI
    */
  exchangeIcon(key: string, component: RenderableExport) {
    const oldComponent = this.icons[key];
    this.icons[key] = component;
    return oldComponent;
  }

  /**
    * Allows for the exchange of the components
    * based on the symbol that they hold
    */
  exchangeComponent(key: string, component: RenderableExport) {
    const oldComponent = this.reactRefs[key];
    this.reactRefs[key] = component;
    return oldComponent;
  }

}
