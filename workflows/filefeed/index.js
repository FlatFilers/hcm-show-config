import { recordHook } from '@flatfile/plugin-record-hook';
import api from '@flatfile/api';
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor';
import { pushToHcmShow } from '../../actions/pushToHCMShow';
import { blueprintSheets } from '../../blueprints/benefitsBlueprint';
import { benefitValidations } from '../../recordHooks/benefits/benefitElectionsValidations';

// Define the main function that sets up the listener
export default function (listener) {
  // Log the event topic for all events
  listener.on('**', (event) => {
    console.log('> event.topic: ' + event.topic);
  });

  // Add an event listener for the 'job:created' event
  listener.filter({ job: 'space:configure' }, (configure) => {
    console.log('on space:configure', configure);

    // Add an event listener for the 'job:created' event with a filter on 'space:configure'
    configure.on('job:ready', async (event) => {
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
        name: 'Benefits Workbook',
        sheets: blueprintSheets,
        actions: [
          {
            operation: 'submitAction',
            slug: 'BenefitsWorkbookSubmitAction',
            mode: 'foreground',
            label: 'Submit',
            type: 'string',
            description: 'Submit Data to HCM Show',
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
    });
  });

  // Attach a record hook to the 'benefit-elections-sheet' of the Flatfile importer
  listener.use(
    // When a record is processed, invoke the 'jobValidations' function to check for any errors
    recordHook('benefit-elections-sheet', (record) => {
      const results = benefitValidations(record);
      // Log the results of the validations to the console as a JSON string
      console.log('Benefits Hooks: ' + JSON.stringify(results));
      // Return the record, potentially with additional errors added by the 'benefitValidations' function
      return record;
    })
  );

  // Listen for the 'action:triggered' event
  listener.on('action:triggered', async (event) => {
    // Extract the name of the action from the event context
    const action = event.context.actionName;
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
