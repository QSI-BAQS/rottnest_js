


/**
  * Generates a string for the css styling translate
  */
const MetaChartStyleTranslate = (x: number, y: number) => {
  return `translate(${[x, y].join(',')})`;
}


/**
  * Utility functions that allow operating 
  */
export const Style = {
  CSSTranslate: MetaChartStyleTranslate,
    
}
