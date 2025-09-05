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
import { useEffect, useRef, useState } from 'react';
/**
 * IconService to expose certain assets over
 * to the plugins themselves
 */
export class IconService {

  icons = {
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

  reactRefs = {
    useRef, useState, useEffect
  }

  static instance: IconService | null = null;

  static GetInstance() {
    if(this.instance === null) {
      this.instance = new IconService();
    }
    return this.instance;
  }

  getReactExports() {
    return this.reactRefs
  }

  /**
   * Simply is a storage service for ant-design icons
   */
  getIcons() {
    return this.icons;
  }
  
}
