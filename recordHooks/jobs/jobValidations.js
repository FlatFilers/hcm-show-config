import { warnEffectiveDate } from './warnEffectiveDate';
import { formatRecordDates } from '../../common/dateFormatting';
import { defaultInactive } from './defaultInactive';

export function jobValidations(record) {
  defaultInactive(record);
  formatRecordDates(record, 'jobs-sheet');
  warnEffectiveDate(record);

  return record;
}
