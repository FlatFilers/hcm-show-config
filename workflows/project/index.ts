import { recordHook } from '@flatfile/plugin-record-hook';
import api from '@flatfile/api';
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor';
import { employeeValidations } from '../../recordHooks/employees/employeeValidations';
import { jobValidations } from '../../recordHooks/jobs/jobValidations';
import { pushToHcmShow } from '../../actions/pushToHCMShow';
import { dedupeEmployees } from '../../actions/dedupe';
import { blueprintSheets } from '../../blueprints/hcmBlueprint';
import { SheetConfig } from '@flatfile/api/api';

// Define the main function that sets up the listener
export default function (listener) {
  // Log the event topic for all events
  listener.on('**', (event) => {
    console.log('> event.topic: ' + event.topic);
  });

  // Add an event listener for the 'job:created' event with a filter on 'space:configure'
  listener.filter({ job: 'space:configure' }, (configure) => {
    configure.on('job:ready', async (event) => {
      console.log('Reached the job:ready event callback');

      // Destructure the 'context' object from the event object to get the necessary IDs
      const { spaceId, environmentId, jobId } = event.context;

      // Acknowledge the job with progress and info using api.jobs.ack
      const updateJob = await api.jobs.ack(jobId, {
        info: "Gettin started y'all",
        progress: 10,
      });

      console.log('Updated Job: ' + JSON.stringify(updateJob));

      // Log the environment ID, space ID, and job ID to the console
      console.log('Outside try block: ');
      console.log('env: ' + environmentId);
      console.log('spaceId: ' + spaceId);
      console.log('jobID: ' + jobId);

      try {
        console.log('Inside try block: ');
        console.log('environmentId:' + environmentId);
        console.log('spaceId:' + spaceId);
        console.log('jobId:' + jobId);

        const createWorkbook = await api.workbooks.create({
          spaceId: spaceId,
          environmentId: environmentId,
          labels: ['primary'],
          name: 'HCM Workbook',
          sheets: blueprintSheets as any,
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

        const workbookId = createWorkbook.data?.id;
        if (workbookId) {
          console.log('Created Workbook with ID:' + workbookId);
        } else {
          console.log('Unable to retrieve workbook ID from the response.');
        }
        // Update the space to set the primary workbook using api.spaces.update
        const updateSpace = await api.spaces.update(spaceId, {
          environmentId: environmentId,
          primaryWorkbookId: workbookId,
        });
        // Log the ID of the updated space to the console
        console.log('Updated Space with ID: ' + updateSpace.data.id);
      } catch (error) {
        console.log('Error creating workbook:' + JSON.stringify(error));
      }

      // Create a new document using the Flatfile API
      const createDoc = await api.documents.create(spaceId, {
        title: 'Getting Started',
        body:
          '# Welcome\n' +
          '### Say hello to your first customer Space in the new Flatfile!\n' +
          "Let's begin by first getting acquainted with what you're seeing in your Space initially.\n" +
          '---\n' +
          '![Flatfile Logo](https://example.com/flatfile-logo.png)\n' +
          'Format: ![Alt Text](url)\n',
      });

      console.log('Created Document: ' + createDoc);

      // Mark the job as complete using api.jobs.complete
      const updateJob3 = await api.jobs.complete(jobId, {
        info: 'This job is now donezo.',
      });

      console.log('Updated Job' + JSON.stringify(updateJob3));
    });

    // Handle the 'job:failed' event
    configure.on('job:failed', async (event) => {
      console.log('Job Failed: ' + JSON.stringify(event));
    });
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
      try {
        // Call the submit function with the event as an argument to push the data to HCM Show
        await pushToHcmShow(event);
        // Log the action as a string to the console
        console.log('Action: ' + JSON.stringify(action));
      } catch (error) {
        // Handle the error gracefully, log an error message, and potentially take appropriate action
        console.log('Error occurred during HCM workbook submission:', error);
        // Perform error handling, such as displaying an error message to the user or triggering a fallback behavior
      }
    }
  });

  listener.on('file:created', async (event) => {
    try {
      // Create an instance of ExcelExtractor to extract data from the created Excel file
      const excelExtractor = new ExcelExtractor(event, {
        rawNumbers: true,
      });

      // Run the extraction process and retrieve the extracted data
      const extractedData = await excelExtractor.runExtraction();

      // Log a success message indicating that the file extraction was successful
      console.log('File extraction successful');

      // Return the extracted data
      return extractedData;
    } catch (error) {
      // Log an error message if an error occurs during the file extraction process
      console.log('Error occurred during file extraction:', error);

      // Handle the error or provide fallback behavior
      return null; // Return null or an appropriate fallback value
    }
  });
}
