import { FlatfileRecord } from '@flatfile/hooks';
import { blueprintSheets } from '../blueprints/hcmBlueprint';
import { isNotNil } from '../common/helpers';

// Function to validate number fields in a record
function validateNumberFields(record, sheetSlug) {
  // Find the sheet object with the given slug in the blueprint sheets
  const sheet = blueprintSheets.find((sheet) => sheet.slug === sheetSlug);

  // Filter the fields of type 'number' and get their keys
  const numberFields = sheet.fields
    .filter((field) => field.type === 'number')
    .map((field) => field.key);

  // Iterate over each number field
  numberFields.forEach((numberField) => {
    // Get the value of the number field from the record
    const value = record.get(numberField);

    // Check if the value is not null, undefined, or NaN
    if (isNotNil(value) && (typeof value !== 'number' || isNaN(value))) {
      // If the value is not a number or NaN, add an error to the record
      record.addError(numberField, 'This field must be a number');
    }
  });
}

// Export the validateNumberFields function for use in other modules
export { validateNumberFields };
