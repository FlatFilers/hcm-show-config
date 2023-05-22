import { recordHook } from '@flatfile/plugin-record-hook';
import api from '@flatfile/api';
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor';
import { blueprintSheets } from './blueprint';
import { employeeValidations } from './recordHooks/employees/employeeValidations';
import { jobValidations } from './recordHooks/jobs/jobValidations';
import { pushToHcmShow } from './actions/pushToHCMShow';
import { dedupeEmployees } from './actions/dedupe';

// Define the main function that sets up the listener
export default function (listener) {
  // Log the event topic for all events
  listener.on('**', (event) => {
    console.log('> event.topic: ' + event.topic);
  });

  // Add an event listener for the 'job:created' event
  listener.on('job:created', async (event) => {
    // Check if the payload operation is 'configure'
    if (event.payload.operation === 'configure') {
      // Log the event object as a JSON string to the console
      //console.log(JSON.stringify(event));

      // Destructure the 'context' object from the event object to get the necessary IDs
      const { spaceId, environmentId, jobId } = event.context;

      // Log the environment ID to the console
      console.log('env: ' + environmentId);
      console.log('spaceId ' + spaceId);
      console.log('jobID: ' + jobId);

      // Create a new workbook using the Flatfile API
      const createWorkbook = await api.workbooks.create({
        spaceId: spaceId,
        environmentId: environmentId,
        labels: ['primary'],
        name: 'HCM Workbook',
        sheets: blueprintSheets,
        actions: [
          {
            operation: 'submitAction',
            slug: 'HCMWorkbookSubmitAction',
            mode: 'foreground',
            label: 'Submit',
            type: 'string',
            description: 'Submit Data to Webhook.site',
            primary: true,
          },
        ],
      });

      const workbookId = createWorkbook.data.id;
      // Log the result of the createWorkbook function to the console as a string
      console.log('Created Workbook with ID: ' + workbookId);

      // Add new listener on workbook created

      // Update Space to set primary workbook for data checklist functionality using the Flatfile API
      const updateSpace = await api.spaces.update(spaceId, {
        environmentId: environmentId,
        primaryWorkbookId: workbookId,
      });
      // Log the result of the updateSpace function to the console as a string
      console.log('Updated Space with ID: ' + updateSpace.data.id);

      // Update the job status to 'complete' using the Flatfile API
      const updateJob = await api.jobs.update(jobId, {
        status: 'complete',
      });

      // Log the result of the updateJob function to the console as a string
      console.log(
        'Updated Job With ID to Status Complete: ' + updateJob.data.id
      );
    }
  });

  // Attach a record hook to the 'employees-sheet' of the Flatfile importer
  listener.use(
    // When a record is processed, invoke the 'employeeValidations' function to validate the record
    recordHook('employees-sheet', (record) => {
      const results = employeeValidations(record);
      // Log the results of the validations to the console as a JSON string
      console.log('Employees Hooks: ' + JSON.stringify(results));
      // Return the record
      return record;
    })
  );

  // Attach a record hook to the 'jobs-sheet' of the Flatfile importer
  listener.use(
    // When a record is processed, invoke the 'jobValidations' function to check for any errors
    recordHook('jobs-sheet', (record) => {
      const results = jobValidations(record);
      // Log the results of the validations to the console as a JSON string
      console.log('Jobs Hooks: ' + JSON.stringify(results));
      // Return the record, potentially with additional errors added by the 'jobValidations' function
      return record;
    })
  );

  // Listen for the 'action:triggered' event
  listener.on('action:triggered', async (event) => {
    // Extract the name of the action from the event context
    const action = event.context.actionName;
    const { sheetId } = event.context;

    // If the action is 'employees-sheet:dedupeEmployees'
    if (action === 'employees-sheet:dedupeEmployees') {
      try {
        console.log('Sheet ID: ' + sheetId);

        // Call the 'get' method of api.records with the sheetId
        const response = await api.records.get(sheetId);

        // Check if the response is valid and contains records
        if (response?.data?.records) {
          // Get the records from the response data
          const records = response.data.records;

          // Call the dedupeEmployees function with the records
          const removeThese = dedupeEmployees(records);
          console.log('Records to Remove: ' + removeThese);

          // Check if there are any records to remove
          if (removeThese.length > 0) {
            // Delete the records identified for removal from the API
            await api.records.delete(sheetId, { ids: removeThese });
          } else {
            console.log('No records found for removal.');
          }
        } else {
          console.log('No records found in the response.');
        }

        // Log the action as a string to the console
        console.log('Listener: ' + JSON.stringify(action));
      } catch (error) {
        console.log('Error occurred:', error);
        // Handle the error or log it for debugging
      }
    }

    // If the action is 'HCMWorkbookSubmitAction'
    if (action.includes('HCMWorkbookSubmitAction')) {
      // Call the submit function with the event as an argument to push the data to HCM Show
      await pushToHcmShow(event);
      // Log the action as a string to the console
      console.log('Action: ' + JSON.stringify(action));
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
