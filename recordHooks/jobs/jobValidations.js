import { warnEffectiveDate } from './warnEffectiveDate';
import { dateFormatting } from '../../common/common';
import { defaultInactive } from './defaultInactive';
import { blueprintSheets } from '../../blueprint';

// Assuming the blueprint is imported as `blueprintSheets`
const targetSheet = blueprintSheets.find(
  (sheet) => sheet.slug === 'jobs-sheet'
); // replace with the desired sheet's slug
const dateFields = targetSheet.fields.filter((field) => field.type === 'date');

export function jobValidations(record) {
  defaultInactive(record);
  dateFormatting(record, dateFields);
  warnEffectiveDate(record);

  return record;
}
