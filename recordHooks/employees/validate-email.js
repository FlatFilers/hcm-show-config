// Import FlatfileRecord and EmailValidator libraries
import { FlatfileRecord } from '@flatfile/hooks';
import EmailValidator from 'email-validator';

// Define a function that validates the email address field of a Flatfile record
const validateEmail = (record) => {
  // Get the value of the email address field from the record
  const emailAddress = record.get('emailAddress');

  // Use the EmailValidator library to check if the email address is valid
  // EmailValidator checks if the email address is in a valid format by validating the syntax and the domain name of the email
  const isValid = EmailValidator.validate(emailAddress);

  // If the email address is not valid, add an error message to the record
  if (!isValid) {
    record.addError(
      'emailAddress',
      "Email addresses must be in the format of 'xxx@yy.com'. Valid examples: john.doe@aol.com, jane@aol.com."
    );
  }
};

// Export the validateEmail function so it can be used by other parts of the application
export default validateEmail;
