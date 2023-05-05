const FF = require('@flatfile/configure');
const { FlatfileRecord } = require('@flatfile/hooks');

/** Checks if value is falsey - returns boolean*/
const isNil = (val) => val === null || val === undefined || val === '';

/** Checks if value is truthy - returns boolean*/
const isNotNil = (val) => !isNil(val);

/** Validates Field Hook that validates a field matches a given regex value.  */
const validateRegex = (value, regex, errorMessage) => {
  if (!regex.test(value)) {
    return [new FF.Message(errorMessage, 'error', 'validate')];
  }
};

const vlookup = (record, referenceField, lookupField, targetField) => {
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
module.exports = { validateRegex, vlookup };
