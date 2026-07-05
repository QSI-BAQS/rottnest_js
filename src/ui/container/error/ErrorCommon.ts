import { CSSProperties } from "react"


/**
  * ErrorMessage
  * Literals that can be inputted
  * for warnings or other things.
  */
export const ErrorMessage = {
  BodyTemplate: {
    message: "Either a message from the backend or an event did not trigger correctly.",
  },
  Dump: {
    Header: "JSON Dump:"
  },
  Button: {
    message: "Ok",
  },
  NoError: {
    message: "No error set but attempt to render was made",
  }
}


/**
  * Just the CSS style for the
  * the error that is displayed when it is emitted from
  * from the frontend
  */
export const ErrorStyle: CSSProperties = {
  position: "absolute"
}
