/**
 * Error state, will outline the current error
 * that has occurred, typically sent by the backend
 * websocket process
 */
export class ErrorState {

  error: string = '';
  errorSet: boolean = false;
  

  /**
   * Clears the current error, typically
   * when the user closes the error
   */
  clearError(): void {
    this.errorSet = false;
  }

  /**
   * Sets the error message from the backend
   */
  setError(msg: string): void {
    this.error = msg;
    this.errorSet = true;
  }

  /**
   * Has an error set
   */
  hasError(): boolean {
    return this.errorSet;
  }

  /**
   * Gets the error msg or returns null
   * if error is not set or has been cleared
   */
  getError(): string | null {
    if(this.errorSet) {
      return this.error;
    } else {
      return null;
    }
  }

  /**
   * Gets the error state as a tuple
   */
  getErrorState(): [boolean, string] {
    return [this.errorSet, this.error]
  }
  
}
