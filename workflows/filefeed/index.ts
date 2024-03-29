import { recordHook } from '@flatfile/plugin-record-hook';
import api from '@flatfile/api';
import { xlsxExtractorPlugin } from '@flatfile/plugin-xlsx-extractor';
import { blueprint } from '../../blueprints/benefitsBlueprint';
import { benefitElectionsValidations } from '../../recordHooks/benefits/benefitElectionsValidations';
import { PipelineJobConfig } from '@flatfile/api/api';
import { FlatfileEvent } from '@flatfile/listener';
import { automap } from '@flatfile/plugin-automap';
import { HcmShowApiService } from '../../common/hcm-show-api-service';
import { dedupePlugin } from '@flatfile/plugin-dedupe';
import { JSONExtractor } from '@flatfile/plugin-json-extractor';
import { XMLExtractor } from '@flatfile/plugin-xml-extractor';
import { ZipExtractor } from '@flatfile/plugin-zip-extractor';
import { DelimiterExtractor } from '@flatfile/plugin-delimiter-extractor';
import { theme } from './theme';
import { document } from './document';
import { FlatfileApiService } from '../../common/flatfile-api-service';

/**
 * View the application code for HCM.show for this workflow here:
 * https://github.com/FlatFilers/HCMShow/blob/main/pages/file-feed.tsx
 */

// Define the main function that sets up the listener
export default function (listener) {
  // Log the event topic for all events
  listener.on('**', async (event) => {
    console.log('> event.topic: ' + event.topic);
    console.log('> event.topic: ' + JSON.stringify(event));

    // Send certain events to HCM.show for syncing
    if (
      event.topic.includes('records:') ||
      (event.topic === 'job:completed' && event?.payload?.status === 'complete')
    ) {
      HcmShowApiService.syncFilefeed(event);
    }
  });

  // Add an event listener for the 'job:created' event
  listener.filter({ job: 'space:configure' }, (configure) => {
    configure.on('job:ready', async (event) => {
      console.log('Reached the job:ready event callback');

      // Destructure the 'context' object from the event object to get the necessary IDs
      const { spaceId, environmentId, jobId } = event.context;

      const updateJob1 = await api.jobs.ack(jobId, {
        info: 'Creating Space',
        progress: 10,
      });

      console.log('Updated Job: ' + JSON.stringify(updateJob1));

      console.log('env: ' + environmentId);
      console.log('spaceId ' + spaceId);
      console.log('jobID: ' + jobId);

      // Setup the space
      await FlatfileApiService.setupSpace({
        name: 'Benefits Workbook',
        spaceId,
        environmentId,
        blueprint,
        document,
        theme,
      });

      // Update the job status to 'complete' using the Flatfile API
      const updateJob = await api.jobs.update(jobId, {
        status: 'complete',
      });

      console.log(
        'Updated Job With ID to Status Complete: ' + updateJob.data.id
      );
    });

    // Handle the 'job:failed' event
    configure.on('job:failed', async (event) => {
      console.log('Job Failed: ' + JSON.stringify(event));
    });
  });

  listener.use(
    automap({
      accuracy: 'confident',
      matchFilename: /^benefits.*$/i,
      defaultTargetSheet: 'Benefit Elections',
    })
  );

  // Attach a record hook to the 'benefit-elections-sheet' of the Flatfile importer
  listener.use(
    recordHook('benefit-elections-sheet', (record) => {
      // When a record is processed, invoke the 'benefitElectionsValidations' function to check for any errors
      const results = benefitElectionsValidations(record);

      console.log('Benefits Hooks: ' + JSON.stringify(results));

      // Return the record, potentially with additional errors added by the 'benefitValidations' function
      return record;
    })
  );

  listener.on('job:completed', { job: 'workbook:map' }, async (event) => {
    // Get key identifiers, including destination sheet Id
    const { jobId, spaceId, environmentId, workbookId } = event.context;

    const job = await api.jobs.get(jobId);
    const config = job.data.config as PipelineJobConfig;

    const destinationSheetId = config?.destinationSheetId;

    // Get the valid records from the sheet
    const importedData = await api.records.get(destinationSheetId, {
      filter: 'valid',
    });

    // Sync the space in HCM.show
    console.log('Syncing spacde in HCM.show');

    const result = await HcmShowApiService.syncSpace(event);

    console.log('Result:', result);

    const successfullySyncedFlatfileRecordIds = (
      result as { successfullySyncedFlatfileRecordIds: string[] }
    ).successfullySyncedFlatfileRecordIds;

    console.log(
      successfullySyncedFlatfileRecordIds.length +
        ' successfully synced records from HCM.show. '
    );

    // Delete the valid records from the sheet
    const recordIds = importedData.data.records.map((r) => r.id);
    console.log(
      'Deleting ' +
        successfullySyncedFlatfileRecordIds.length +
        ' valid records.'
    );

    // Split the recordIds array into chunks of 100
    const chunk = 100;
    for (let i = 0; i < recordIds.length; i += chunk) {
      const batch = recordIds
        .slice(i, i + chunk)
        // Delete the records that were successfully synced
        .filter((id) => successfullySyncedFlatfileRecordIds.includes(id));

      // Delete the batch
      await api.records.delete(destinationSheetId, {
        ids: batch,
      });

      console.log(`Deleted batch from index ${i} to ${i + chunk}`);
    }

    console.log('Done');
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

        let result;
        try {
          // Call the submit function with the event as an argument to push the data to HCM Show
          result = await HcmShowApiService.syncSpace(event);

          console.log('Action: ' + JSON.stringify(event?.payload?.operation));
        } catch (error) {
          console.log('Error occurred during HCM workbook submission:', error);
        }

        if (result.success) {
          await api.jobs.complete(jobId, {
            info: 'Data synced to the HCM.show app.',
          });
        }
      } catch (error) {
        console.error('Error:', error.stack);

        await api.jobs.fail(jobId, {
          info: 'The submit job did not run correctly.',
        });
      }
    });
  });

  listener.use(
    dedupePlugin('dedupe-benefit-elections', {
      on: 'employeeId',
      keep: 'last',
    })
  );
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
