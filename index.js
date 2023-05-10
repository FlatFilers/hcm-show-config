import { recordHook } from '@flatfile/plugin-record-hook';
import { FlatfileClient } from '@flatfile/api';
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor';
import { blueprintSheets } from './blueprint';
import { employeeValidations } from './recordHooks/employees/employeeValidations';
import { jobValidations } from './recordHooks/jobs/jobValidations';
import { RetriggerValidations } from './actions/retriggerValidations';
import { pushToHcmShow } from './actions/pushToHCMShow';

// Set the Flatfile API key as an environment variable
process.env.FLATFILE_API_KEY = 'sk_UrerfpfQAhDHaH1qBwj6ah42MrZCcx8l';

// Define the main function that sets up the listener
export default function (listener) {
  // Create a new instance of the FlatfileClient
  const api = new FlatfileClient();

  // Log the event topic for all events
  listener.on('**', (event) => {
    console.log('> event.topic: ' + event.topic);
  });

  // Add an event listener for the 'job:created' event with a payload filter for 'operation: configure'
  listener.on(
    'job:created',
    { payload: { operation: 'configure' } },
    async (event) => {
      // Log the event object as a string to the console
      console.log(JSON.stringify(event));

      // Destructure the 'context' object from the event object to get the necessary IDs
      const { spaceId, environmentId, jobId, sheetId } = event.context;

      // Log the environment ID to the console
      console.log('env: ' + environmentId);

      // Create a new workbook using the Flatfile API
      const createWorkbook = await api.workbooks.create({
        spaceId: spaceId,
        environmentId: environmentId,
        name: 'HCM Workbook',
        sheets: blueprintSheets,
      });

      // Log the result of the createWorkbook function to the console as a string
      console.log('Created Workbook' + JSON.stringify(createWorkbook));

      // Update the job status to 'complete' using the Flatfile API
      const updateJob = await api.jobs.update(jobId, {
        status: 'complete',
      });

      // Log the result of the updateJob function to the console as a string
      console.log('Updated Job' + JSON.stringify(updateJob));
    }
  );

  // Attach a record hook to the `employees-sheet` sheet
  listener.use(
    recordHook('employees-sheet', (record) => {
      // Invoke `employeeValidations` function to validate the record
      const results = employeeValidations(record);
      // Log the results to the console
      console.log(JSON.stringify(results));
      // Return the record
      return record;
    })
  );

  // This code adds a record hook to the 'jobs-sheet' of the Flatfile importer
  listener.use(
    // When a record is processed, it is passed to the jobValidations function to check for any errors
    recordHook('jobs-sheet', (record) => {
      const results = jobValidations(record);
      // The results of the validations are logged to the console as a JSON string
      console.log(JSON.stringify(results));
      // The record is then returned, potentially with additional errors added by the jobValidations function
      return record;
    })
  );

  // Listen for the 'action:triggered' event
  listener.on('action:triggered', async (event) => {
    // Extract the name of the action from the event context
    const action = event.context.actionName;

    // If the action is 'employees-sheet:RetriggerValidations'
    if (action === 'employees-sheet:RetriggerValidations') {
      // Call the RetriggerValidations function with the event as an argument
      await RetriggerValidations(event);
      // Log the action as a string to the console
      console.log(JSON.stringify(action));
    }

    // If the action is 'employees-sheet:pushToHcmShow'
    if (action === 'employees-sheet:pushToHcmShow') {
      // Call the pushToHcmShow function with the event as an argument
      await pushToHcmShow(event);
      // Log the action as a string to the console
      console.log(JSON.stringify(action));
    }
  });

  // Listen for the 'file:created' event
  listener.on('file:created', async (event) => {
    // Extract the raw data from the created Excel file and return it
    return new ExcelExtractor(event, {
      rawNumbers: true,
    }).runExtraction();
  });
}
