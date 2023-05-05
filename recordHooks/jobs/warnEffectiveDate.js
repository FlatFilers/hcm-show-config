import { FlatfileRecord } from '@flatfile/hooks';

export const warnEffectiveDate = (record) => {
  const effectiveDate = record.get('effectiveDate');
  if (effectiveDate === null || effectiveDate === undefined) {
    record.addWarning(
      'effectiveDate',
      `Effective Date is blank and will default to today's date in HCM.`
    );
  }
};
