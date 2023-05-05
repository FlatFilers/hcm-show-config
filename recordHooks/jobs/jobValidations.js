import { warnEffectiveDate } from './warnEffectiveDate';
import { dateFormatting } from './dateFormatting';
import { defaultInactive } from './defaultInactive';

export function jobValidations(record) {
  defaultInactive(record);
  dateFormatting(record);
  warnEffectiveDate(record);

  return record;
}
