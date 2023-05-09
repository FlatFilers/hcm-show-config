import { FlatfileRecord } from '@flatfile/hooks'; // Import FlatfileRecord from the '@flatfile/hooks' library
import { isNil } from '../../common/helpers'; // Import isNil function from a custom helper library

export const defaultInactive = (record) => {
  // Define the defaultInactive function and its input parameter
  let inactive = record.get('inactive'); // Get the value of the 'inactive' field from the record

  if (isNil(inactive)) {
    // Check if the 'inactive' field is null or undefined
    record.set('inactive', false); // Set the value of the 'inactive' field to false
    record.addInfo(
      // Add an informational message to the record
      'inactive',
      'Inactive was not provided. Field has been set to false.'
    );
  }
};
