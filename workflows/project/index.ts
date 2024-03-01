import { recordHook } from '@flatfile/plugin-record-hook';
import api from '@flatfile/api';
import { xlsxExtractorPlugin } from '@flatfile/plugin-xlsx-extractor';
import { employeeValidations } from '../../recordHooks/employees/employeeValidations';
import { jobValidations } from '../../recordHooks/jobs/jobValidations';
import { dedupeEmployees } from '../../actions/dedupe';
import { blueprint } from '../../blueprints/jobsBlueprint';
import { validateReportingStructure } from '../../actions/validateReportingStructure';
import { FlatfileEvent } from '@flatfile/listener';
import { RecordHook } from '@flatfile/plugin-record-hook';
import { HcmShowApiService } from '../../common/hcm-show-api-service';
import { JSONExtractor } from '@flatfile/plugin-json-extractor';
import { XMLExtractor } from '@flatfile/plugin-xml-extractor';
import { ZipExtractor } from '@flatfile/plugin-zip-extractor';
import { DelimiterExtractor } from '@flatfile/plugin-delimiter-extractor';
import { theme } from './theme';
import { document } from './document';
import { FlatfileApiService } from '../../common/flatfile-api-service';

/**
 * View the application code for HCM.show for this workflow here:
 * https://github.com/FlatFilers/HCMShow/blob/main/pages/project-onboarding.tsx
 */

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

      console.log('env: ' + environmentId);
      console.log('spaceId: ' + spaceId);
      console.log('jobID: ' + jobId);

      // Setup the space
      await FlatfileApiService.setupSpace({
        name: 'HCM Workbook',
        spaceId,
        environmentId,
        blueprint,
        document,
        theme,
      });

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

  listener.on('commit:created', async (event) => {
    try {
      console.log('commit:created event triggered'); // Log when the event is triggered

      // Retrieve the sheetId from the event context
      const sheetId = event.context.sheetId;
      console.log(`Retrieved sheetId from event: ${sheetId}`); // Log the retrieved sheetId

      // Fetch the sheet from the API
      const sheet = await api.sheets.get(sheetId);

      // Only log that the sheet was fetched successfully
      if (!sheet) {
        console.log(`Failed to fetch sheet with id: ${sheetId}`);
        return;
      }
      console.log(`Sheet with id: ${sheetId} fetched successfully.`);

      // Verify that the sheetSlug matches 'employees-sheet'
      if (sheet.data.config?.slug === 'employees-sheet') {
        console.log("Confirmed: sheetSlug matches 'employees-sheet'.");

        // Call the API endpoint at HcmShow to get a list of employees
        const employees = await HcmShowApiService.fetchEmployees(event);

        console.log('Finished calling API endpoint. Processing response...');

        if (!employees) {
          console.log('Failed to fetch employees data from the API');
          return;
        }

        // If the list of employees is empty. If so, skip the RecordHook call
        if (employees.length === 0) {
          console.log(
            'List of employees from API is empty. Skipping RecordHook.'
          );
          return;
        }

        console.log(`Successfully fetched ${employees.length} employees.`);

        // Call the RecordHook function with event and a handler
        await RecordHook(event, async (record, event) => {
          console.log('Inside RecordHook'); // Log inside the handler function

          try {
            // Pass the fetched employees to the employeeValidations function along with the record
            await employeeValidations(record, employees);
          } catch (error) {
            // Handle errors that might occur within employeeValidations
            console.error('Error in employeeValidations:', error);
          }

          return record;
        });

        console.log('Finished calling RecordHook');
      } else {
        console.log(
          "Failed: sheetSlug does not match 'employees-sheet'. Aborting RecordHook call..."
        );
      }
    } catch (error) {
      console.error('Error in commit:created event handler:', error);
    }
  });

  // Attach a record hook to the 'jobs-sheet' of the Flatfile importer
  listener.use(
    recordHook('jobs-sheet', (record) => {
      // When a record is processed, invoke the 'jobValidations' function to check for any errors
      const results = jobValidations(record);

      console.log('Jobs Hooks: ' + JSON.stringify(results));

      // Return the record, potentially with additional errors added by the 'jobValidations' function
      return record;
    })
  );

  // Listen for the 'dedupe employees' action
  listener.filter({ job: 'sheet:dedupeEmployees' }, (configure) => {
    configure.on(
      'job:ready',
      async ({ context: { jobId, sheetId } }: FlatfileEvent) => {
        console.log(JSON.stringify(sheetId, null, 2));
        try {
          await api.jobs.ack(jobId, {
            info: 'Checking for duplicates.',
            progress: 10,
          });

          let count = 0;
          try {
            console.log('Sheet ID: ' + sheetId);

            // Call the 'get' method of api.records with the sheetId
            const response = await api.records.get(sheetId);

            // Check if the response is valid and contains records
            if (response?.data?.records) {
              const records = response.data.records;

              // Call the dedupeEmployees function with the records
              const removeThese = dedupeEmployees(records);
              console.log('Records to Remove: ' + removeThese);
              count = removeThese.length;

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

            console.log('Listener: ' + JSON.stringify(configure?.operation));
          } catch (error) {
            console.log('Error occurred:', error);
          }

          await api.jobs.complete(jobId, {
            info: `${count} employees deduplicated.`,
          });
        } catch (error) {
          console.error('Error:', error.stack);

          await api.jobs.fail(jobId, {
            info: 'Unable to deduplicate employees.',
          });
        }
      }
    );
  });

  // Listen for the 'validate reporting structure' action
  listener.filter({ job: 'sheet:validateReportingStructure' }, (configure) => {
    configure.on(
      'job:ready',
      async ({ context: { jobId, sheetId } }: FlatfileEvent) => {
        try {
          await api.jobs.ack(jobId, {
            info: 'Validating reporting structure.',
            progress: 10,
          });

          let count = 0;
          try {
            console.log('Sheet ID: ' + sheetId);

            // Call the 'get' method of api.records with the sheetId
            const response = await api.records.get(sheetId);

            // Check if the response is valid and contains records
            if (response?.data?.records) {
              const records = response.data.records;

              // Call the validateReportingStructure function with the records
              const reportingErrors = validateReportingStructure(records);
              count = reportingErrors.length;

              // Update the records if there are any reporting errors
              if (reportingErrors.length > 0) {
                await api.records.update(sheetId, reportingErrors);
                console.log('Records updated successfully.');
                // For example, you can send them as a notification or store them in a database
              } else {
                console.log('No records found for updating.');
              }
            } else {
              console.log('No records found in the response.');
            }
          } catch (error) {
            console.log('Error occurred:' + error);
          }

          await api.jobs.complete(jobId, {
            info: `${count} records found and flagged.`,
          });
        } catch (error) {
          console.error('Error:', error.stack);

          await api.jobs.fail(jobId, {
            info: 'Unable to validate reporting structure.',
          });
        }
      }
    );
  });

  // Seed the workbook with data
  listener.on('workbook:created', async (event) => {
    if (!event.context || !event.context.workbookId) {
      console.error('Event context or workbookId missing');
      return;
    }

    const workbookId = event.context.workbookId;
    let workbook;
    try {
      workbook = await api.workbooks.get(workbookId);
    } catch (error) {
      console.error('Error getting workbook:', error.message);
      return;
    }

    const workbookName =
      workbook.data && workbook.data.name ? workbook.data.name : '';

    if (workbookName.includes('HCM Workbook')) {
      const sheets =
        workbook.data && workbook.data.sheets ? workbook.data.sheets : [];

      // Departments
      const departmentsSheet = sheets.find((s) =>
        s.config.slug.includes('departments')
      );

      console.log('Fetching departments from HCM.show...');

      // Fetch departments from HCM.show API
      const departments = await HcmShowApiService.fetchDepartments(event);

      if (departmentsSheet && Array.isArray(departments)) {
        const departmentId = departmentsSheet.id;
        const mappedDepartments = departments.map(
          ({ departmentCode, departmentName }) => ({
            departmentCode: { value: departmentCode },
            departmentName: { value: departmentName },
          })
        );

        try {
          const insertDepartments = await api.records.insert(
            departmentId,
            mappedDepartments
          );
        } catch (error) {
          console.error('Error inserting departments:', error.message);
        }
      }
    }
  });

  // Listen for the 'submit' action
  listener.filter({ job: 'workbook:submitAction' }, (configure) => {
    configure.on('job:ready', async (event: FlatfileEvent) => {
      const { jobId, spaceId } = event.context;
      try {
        await api.jobs.ack(jobId, {
          info: 'Sending data to HCM.show.',
          progress: 10,
        });

        try {
          // Call the submit function with the event as an argument to push the data to HCM Show
          await HcmShowApiService.syncSpace(event);

          console.log('Action: ' + JSON.stringify(event?.payload?.operation));
        } catch (error) {
          console.log(
            'Error occurred during HCM workbook submission: ' + error
          );
        }

        await api.jobs.complete(jobId, {
          info: 'Data synced to the HCM.show app.',
        });
      } catch (error) {
        console.error('Error: ' + error.stack);

        await api.jobs.fail(jobId, {
          info: 'The submit job did not run correctly.',
        });
      }
    });
  });

  // Add the XLSX extractor plugin to the listener
  // This allows the listener to parse XLSX files
  try {
    listener.use(xlsxExtractorPlugin({ rawNumbers: true }));
  } catch (error) {
    console.error('Failed to parse XLSX files:', error);
  }

  // Add the JSON extractor to the listener
  // This allows the listener to parse JSON files
  try {
    listener.use(JSONExtractor());
  } catch (error) {
    console.error('Failed to parse JSON files:', error);
  }

  // Add the XML extractor to the listener
  // This allows the listener to parse XML files
  try {
    listener.use(XMLExtractor());
  } catch (error) {
    console.error('Failed to parse XML files:', error);
  }

  // Add the Zip extractor to the listener
  // This allows the listener to extract files from ZIP archives
  try {
    listener.use(ZipExtractor());
  } catch (error) {
    console.error('Failed to extract files from ZIP:', error);
  }

  // Add the delimiter extractor plugin to the listener
  // This allows the listener to parse pipe-delimited TXT files
  try {
    listener.use(DelimiterExtractor('.txt', { delimiter: '|' }));
  } catch (error) {
    console.error('Failed to parse pipe-delimited TXT files:', error);
  }
}
