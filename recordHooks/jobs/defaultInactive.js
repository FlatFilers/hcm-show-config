import { FlatfileRecord } from '@flatfile/hooks';
import { isNil } from '../../common/helpers';

export const defaultInactive = (record) => {
  let inactive = record.get('inactive');
  if (isNil(inactive)) {
    record.set('inactive', false);
    record.addInfo(
      'inactive',
      'Inactive was not provided. Field has been set to false.'
    );
  }
};
