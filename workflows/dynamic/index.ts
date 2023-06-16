import { recordHook } from '@flatfile/plugin-record-hook';
import api from '@flatfile/api';
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor';
import { pushToHcmShow } from '../../actions/pushToHCMShow';
import { blueprintSheets } from '../../blueprints/benefitsBlueprint';
import { benefitElectionsValidations } from '../../recordHooks/benefits/benefitElectionsValidations';

type Metadata = {
  userId: string;
};

// Define the main function that sets up the listener
export default function (listener) {
  // Log the event topic for all events
  listener.on('**', (event) => {
    console.log('> event.topic: ' + event.topic);
  });

  // Add an event listener for the 'job:created' event
  listener.filter({ job: 'space:configure' }, (configure) => {
    configure.on('job:ready', async (event) => {
      console.log('Reached the job:ready event callback');

      // Destructure the 'context' object from the event object to get the necessary IDs
      const { spaceId, environmentId, jobId } = event.context;

      const space = await api.spaces.get(spaceId);

      console.log('Space: ' + JSON.stringify(space));

      const metadata = space.data.metadata as Metadata;

      const userId = metadata.userId;

      const updateJob1 = await api.jobs.ack(jobId, {
        info: 'Creating Space',
        progress: 10,
      });

      console.log('Updated Job: ' + JSON.stringify(updateJob1));

      // Log the environment ID to the console
      console.log('env: ' + environmentId);
      console.log('spaceId ' + spaceId);
      console.log('jobID: ' + jobId);

      try {
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
        if (workbookId) {
          console.log('Created Workbook with ID: ' + workbookId);

          // Update Space to set primary workbook for data checklist functionality using the Flatfile API
          const updateSpace = await api.spaces.update(spaceId, {
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
                  primaryColor: '#D64B32',
                  dangerColor: 'salmon',
                  warningColor: 'gold',
                },
                sidebar: {
                  logo: `https://images.ctfassets.net/e8fqfbar73se/4c9ouGKgET1qfA4uxp4qLZ/e3f1a8b31be67a798c1e49880581fd3d/white-logo-w-padding.png`,
                  textColor: 'white',
                  titleColor: 'white',
                  focusBgColor: '#E28170',
                  focusTextColor: 'white',
                  backgroundColor: '#D64B32',
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
          // Log the result of the updateSpace function to the console as a string
          console.log('Updated Space with ID: ' + updateSpace.data.id);
        } else {
          console.log('Unable to retrieve workbook ID from the response.');
        }
      } catch (error) {
        console.log('Error creating workbook or updating space:', error);
      }

      const createDoc = await api.documents.create(spaceId, {
        title: 'Welcome',
        body: `<div> 
        <h1 style="margin-bottom: 36px;">Welcome! We're excited to help you import your data to HCM Show.</h1>
        <h2 style="margin-top: 0px; margin-bottom: 12px;">Follow the steps below to get started:</h2>
        <h2 style="margin-bottom: 0px;">1. Upload your file</h2>
        <p style="margin-top: 0px; margin-bottom: 8px;">Click "Files" in the left-hand sidebar, and upload the sample data you want to import into Flatfile. You can do this by clicking "Add files" or dragging and dropping the file onto the page.</p>
        <h2 style="margin-bottom: 0px;">2. Import the Benefit Elections Data</h2>
        <p style="margin-top: 0px; margin-bottom: 8px;">Click "Import" and select the benefit elections data. Follow the mapping instructions in Flatfile to complete the import. Once the data has been mapped, it will be loaded into Flatfile's table UI, where validations and transformations have been applied.</p>
        <h2 style="margin-bottom: 0px;">3. Validate and Transform Data</h2>
        <p style="margin-top: 0px; margin-bottom: 8px;">Make sure to verify that your data is correctly formatted and transformed by Flatfile. Flatfile will handle formatting dates, rounding amounts, and validating the existence of employees and benefit plans for you! If there are any issues or errors, you can easily address them within Flatfile's user interface.</p>
        <h2 style="margin-bottom: 0px;">4. Load Data into HCM.Show</h2>
        <p style="margin-top: 0px; margin-bottom: 12px;">Once the data has been validated and transformed, use the “Push records to HCM.show” button to load data into the HCM.Show application.</p>
        <h2 style="margin-bottom: 0px;">5. Return to HCM.Show</h2>
        <p style="margin-top: 0px; margin-bottom: 36px;">Once you have loaded the data from Flatfile to HCM Show, return to HCM.Show and navigate to the Data Templates section within the application to view the benefit elections data that you have just loaded.</p>
        <h3 style="margin-top: 0px; margin-bottom: 12px;">Remember, if you need any assistance, you can always refer back to this page by clicking "Welcome" in the left-hand sidebar!</h3>
      </div>`,
      });

      console.log('Created Document: ' + createDoc);

      // Update the job status to 'complete' using the Flatfile API
      const updateJob = await api.jobs.update(jobId, {
        status: 'complete',
      });

      // Log the result of the updateJob function to the console as a string
      console.log(
        'Updated Job With ID to Status Complete: ' + updateJob.data.id
      );
    });

    // Handle the 'job:failed' event
    configure.on('job:failed', async (event) => {
      console.log('Job Failed: ' + JSON.stringify(event));
    });
  });

  // Attach a record hook to the 'benefit-elections-sheet' of the Flatfile importer
  listener.use(
    // When a record is processed, invoke the 'jobValidations' function to check for any errors
    recordHook('benefit-elections-sheet', (record) => {
      const results = benefitElectionsValidations(record);
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

  // Listen for the 'file:created' event
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
