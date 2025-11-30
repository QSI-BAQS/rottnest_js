import style from '../../styles/LoadSelector.module.css'

export type ArchOption = {
  name: string
  event: () => void
}

export type LoadSelectorProps = {
  architectureOptions: Array<ArchOption>,
}

/**
 * Loads the selector form when an error occurs and the user needs to intervene
 */
export function LoadSelectorForm(props: LoadSelectorProps) {

  const selectorList = <LoadSelectorList {...props} />

  return (
  <div>
    <div>
      No architecture tag has been detected with this project.
      Can you please select what project you would like to load this with?
    </div>
    {selectorList}
  </div>)
}

/**
 * Generates the selector list
 */
export function LoadSelectorList(props: LoadSelectorProps) {

  const archRender = props.architectureOptions.map(e => {
    <button key={`archoption_${e.name}`}
      className={style.archOptionSelect}
      onClick={(_) => e.event()}>
      {e.name}
    </button>
  });

  return (
    <>
      {archRender}
    </>
  );
}
