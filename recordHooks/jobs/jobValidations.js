import { defaultInactiveAndWarnEffectiveDate } from './defaultInactiveAndWarnEffectiveDate';
import { formatRecordDates } from '../../common/dateFormatting';

export function jobValidations(record) {
  defaultInactiveAndWarnEffectiveDate(record);
  formatRecordDates(record, 'jobs-sheet');
  return record;
}
