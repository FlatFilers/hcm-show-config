import * as FF from '@flatfile/configure'

/** Validates Field Hook that validates a field matches a given regex value.  */
const validateRegex = (value: string, regex: RegExp, errorMessage: string) => {
  if (!regex.test(value)) {
    return [new FF.Message(errorMessage, 'error', 'validate')]
  }
}

//Export Values
export { validateRegex }
