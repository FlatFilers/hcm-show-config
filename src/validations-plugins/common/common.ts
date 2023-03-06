import * as FF from '@flatfile/configure';
import { FlatfileRecord } from '@flatfile/hooks';

/** Checks if value is falsey - returns boolean*/
const isNil = (val: any) => val === null || val === undefined || val === '';

/** Checks if value is truthy - returns boolean*/
const isNotNil = (val: any) => !isNil(val);

/** Validates Field Hook that validates a field matches a given regex value.  */
const validateRegex = (value: string, regex: RegExp, errorMessage: string) => {
  if (!regex.test(value)) {
    return [new FF.Message(errorMessage, 'error', 'validate')];
  }
};

const vlookup = (
  record: FlatfileRecord,
  referenceField: string,
  lookupField: string,
  targetField: string
) => {
  const links = record.getLinks(referenceField);
  const lookupValue = links?.[0]?.[lookupField];
  if (!!lookupValue) {
    record.set(targetField, lookupValue);
    record.addInfo(
      targetField,
      `${targetField} set based on ${referenceField}.`
    );
  }
};

//Export Values
export { validateRegex, vlookup };
