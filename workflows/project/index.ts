import { recordHook } from '@flatfile/plugin-record-hook';
import api from '@flatfile/api';
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor';
import { employeeValidations } from '../../recordHooks/employees/employeeValidations';
import { jobValidations } from '../../recordHooks/jobs/jobValidations';
import { pushToHcmShow } from '../../actions/pushToHCMShow';
import { dedupeEmployees } from '../../actions/dedupe';
import { blueprintSheets } from '../../blueprints/hcmBlueprint';
import { validateReportingStructure } from '../../actions/validateReportingStructure';
import { FlatfileEvent } from '@flatfile/listener';

type Metadata = {
  userId: string;
};
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

      const space = await api.spaces.get(spaceId);

      console.log('Space: ' + JSON.stringify(space));

      const metadata = space.data.metadata as Metadata;

      const userId = metadata.userId;

      // Acknowledge the job with progress and info using api.jobs.ack
      const updateJob = await api.jobs.ack(jobId, {
        info: "Gettin started y'all",
        progress: 10,
      });

      console.log('Updated Job: ' + JSON.stringify(updateJob));

      // Log the environment ID, space ID, and job ID to the console
      console.log('env: ' + environmentId);
      console.log('spaceId: ' + spaceId);
      console.log('jobID: ' + jobId);

      try {
        // Create a new workbook
        const createWorkbook = await api.workbooks.create({
          spaceId: spaceId,
          environmentId: environmentId,
          labels: ['primary'],
          name: 'HCM Workbook',
          sheets: blueprintSheets as any,
          actions: [
            {
              operation: 'submitAction',
              mode: 'foreground',
              label: 'Submit',
              type: 'string',
              description: 'Submit Data to the HCM.show app',
              primary: true,
            },
          ],
        });

        const workbookId = createWorkbook.data?.id;
        if (workbookId) {
          console.log('Created Workbook with ID:' + workbookId);

          // Update the space to set the primary workbook and theme using api.spaces.update
          const updatedSpace = await api.spaces.update(spaceId, {
            environmentId: environmentId,
            primaryWorkbookId: workbookId,
            metadata: {
              userId,
              sidebarConfig: {
                showSidebar: false,
                // This property seems to break guest magic link functionality?
                // showGuestInvite: true,
              },
              theme: {
                root: {
                  primaryColor: '#3B2FC9',
                  dangerColor: '#F44336',
                  warningColor: '#FF9800',
                },
                sidebar: {
                  logo: `https://images.ctfassets.net/e8fqfbar73se/4c9ouGKgET1qfA4uxp4qLZ/e3f1a8b31be67a798c1e49880581fd3d/white-logo-w-padding.png`,
                  textColor: 'white',
                  titleColor: 'white',
                  focusBgColor: '#6673FF',
                  focusTextColor: 'white',
                  backgroundColor: '#3B2FC9',
                  footerTextColor: 'white',
                  textUltralightColor: 'red',
                },
                table: {
                  inputs: {
                    radio: {
                      color: 'rgb(8 117 225)',
                    },
                    checkbox: {
                      color: 'rgb(8 117 225)',
                    },
                  },
                  filters: {
                    color: 'gray',
                    active: {
                      backgroundColor: 'rgb(8 117 225)',
                    },
                    error: {
                      activeBackgroundColor: 'salmon',
                    },
                  },
                  column: {
                    header: {
                      fontSize: '12px',
                      backgroundColor: 'rgb(240 240 240)',
                      color: 'slategray',
                      dragHandle: {
                        idle: 'rgb(8 117 225)',
                        dragging: 'blue',
                      },
                    },
                  },
                  fontFamily: 'Arial',
                  indexColumn: {
                    backgroundColor: 'rgb(240 240 240)',
                    selected: {
                      color: 'rgb(240 240 240)',
                      backgroundColor: 'rgb(200 200 200)',
                    },
                  },
                  cell: {
                    selected: {
                      backgroundColor: 'rgb(235 245 255)',
                    },
                    active: {
                      borderColor: 'rgb(8 117 225)',
                      spinnerColor: 'gray',
                    },
                  },
                  boolean: {
                    toggleChecked: 'rgb(240 240 240)',
                  },
                  loading: {
                    color: 'rgb(240 240 240)',
                  },
                },
              },
            },
          });

          // Log the ID of the updated space to the console
          console.log('Updated Space with ID: ' + updatedSpace.data.id);
        } else {
          console.log('Unable to retrieve workbook ID from the response.');
        }
      } catch (error) {
        console.log('Error creating workbook or updating space:', error);
      }

      // Create a new document using the Flatfile API
      const createDoc = await api.documents.create(spaceId, {
        title: 'Welcome',
        body: `<div> 
        <h1 style="margin-bottom: 36px;">Welcome! We're excited to help you import your data to HCM Show.</h1>
        <h2 style="margin-top: 0px; margin-bottom: 12px;">Follow the steps below to get started:</h2>
        <h2 style="margin-bottom: 0px;">1. Upload your file</h2>
        <p style="margin-top: 0px; margin-bottom: 8px;">Click "Files" in the left-hand sidebar, and upload the sample data you want to import into Flatfile. You can do this by clicking "Add files" or dragging and dropping the file onto the page.</p>
        <h2 style="margin-bottom: 0px;">2. Import your Jobs Data</h2>
        <p style="margin-top: 0px; margin-bottom: 8px;">Click "Import" and select the Jobs data. Follow the mapping instructions in Flatfile to complete the import. Once the data has been mapped, it will be loaded into Flatfile's table UI, where validations and transformations have been applied.</p>
        <h2 style="margin-bottom: 0px;">3. Import your Employee Data</h2>
        <p style="margin-top: 0px; margin-bottom: 8px;">Click "Import" and select the Employee data. Follow the mapping instructions in Flatfile to complete the import. Once the data has been mapped, it will be loaded into Flatfile's table UI, where validations and transformations have been applied.</p>
        <h2 style="margin-bottom: 0px;">4. Validate and Transform Data</h2>
        <p style="margin-top: 0px; margin-bottom: 8px;">Ensure that the data is correctly formatted and transformed By Flatfile. You can easily address any issues and errors within Flatfile's user interface.</p>
        <h2 style="margin-bottom: 0px;">5. Load Data into HCM.Show</h2>
        <p style="margin-top: 0px; margin-bottom: 12px;">Once the data has been validated and transformed, use the custom action on each sheet to load the data into HCM.Show application.</p>
        <h2 style="margin-bottom: 0px;">6. Return to HCM.Show</h2>
        <p style="margin-top: 0px; margin-bottom: 36px;">Once you have loaded the data from Flatfile to HCM Show, return to HCM.Show and navigate to the Data Templates section within the application to view the Jobs and Employees data that you have just loaded.</p>
        <h3 style="margin-top: 0px; margin-bottom: 12px;">Remember, if you need any assistance, you can always refer back to this page by clicking "Welcome" in the left-hand sidebar!</h3>
      </div>`,
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

  // Listen for the 'dedupe employees' action
  listener.filter({ job: "sheet:dedupeEmployees" }, (configure) => {
    configure.on("job:ready", async ({ context: { jobId, sheetId } }:FlatfileEvent ) => {

      console.log(JSON.stringify(sheetId,null,2))
      try {
        await api.jobs.ack(jobId, {
          info: "Checking for duplicates.",
          progress: 10,
        });

        // run the dedupe employees function
        let count = 0
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
            count = removeThese.length

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
          console.log('Listener: ' + JSON.stringify(configure?.operation));
        } catch (error) {
          console.log('Error occurred:', error);
          // Handle the error or log it for debugging
        }

        await api.jobs.complete(jobId, {
          info: `${count} employees deduplicated.`,
        });
      } catch (error) {
        console.error("Error:", error.stack);
  
        await api.jobs.fail(jobId, {
          info: "Unable to deduplicate employees.",
        });
      }
    });
  });

  // Listen for the 'validate reporting structure' action
  listener.filter({ job: "sheet:validateReportingStructure" }, (configure) => {
    configure.on("job:ready", async ({ context: { jobId, sheetId } }:FlatfileEvent ) => {
      try {
        await api.jobs.ack(jobId, {
          info: "Validating reporting structure.",
          progress: 10,
        });

        // run the validate reporting structure function
        let count = 0
        try {
          console.log('Sheet ID: ' + sheetId);
  
          // Call the 'get' method of api.records with the sheetId
          const response = await api.records.get(sheetId);
  
          // Check if the response is valid and contains records
          if (response?.data?.records) {
            // Get the records from the response data
            const records = response.data.records;
  
            // Call the validateReportingStructure function with the records
            const reportingErrors = validateReportingStructure(records);
  
            // Log the reporting errors to the console
            //console.log('Reporting Errors:' + JSON.stringify(reportingErrors));
            
            count = reportingErrors.length
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
  
          // Log the action as a string to the console
          //console.log('Listener: ' + JSON.stringify(action));
        } catch (error) {
          console.log('Error occurred:' + error);
          // Handle the error or log it for debugging
        }

        await api.jobs.complete(jobId, {
          info: `${count} records found and flagged.`,
        });
      } catch (error) {
        console.error("Error:", error.stack);
  
        await api.jobs.fail(jobId, {
          info: "Unable to validate reporting structure.",
        });
      }
    });
  });
  
  // Listen for the 'submit' action
  listener.filter({ job: "workbook:submitAction" }, (configure) => {
    configure.on("job:ready", async (event: FlatfileEvent) => {
      const { jobId, spaceId } = event.context
      try {
        await api.jobs.ack(jobId, {
          info: "Sending data to HCM.show.",
          progress: 10,
        });
        
        try {
          // Call the submit function with the event as an argument to push the data to HCM Show
          await pushToHcmShow(event);
          // Log the action as a string to the console
          console.log('Action: ' + JSON.stringify(event?.payload?.operation));
        } catch (error) {
          // Handle the error gracefully, log an error message, and potentially take appropriate action
          console.log('Error occurred during HCM workbook submission:', error);
          // Perform error handling, such as displaying an error message to the user or triggering a fallback behavior
        }
  
        await api.jobs.complete(jobId, {
          info: "Data synced to the HCM.show app.",
        });
      } catch (error) {
        console.error("Error:", error.stack);
  
        await api.jobs.fail(jobId, {
          info: "The submit job did not run correctly.",
        });
      }
    });
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
