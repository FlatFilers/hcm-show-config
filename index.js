import { recordHook } from '@flatfile/plugin-record-hook';
import { FlatfileClient } from '@flatfile/api';
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor';
import { blueprintSheets } from './blueprint';
import { employeeValidations } from './recordHooks/employees/employeeValidations';
import { jobValidations } from './recordHooks/jobs/jobValidations';

process.env.FLATFILE_API_KEY = 'sk_UrerfpfQAhDHaH1qBwj6ah42MrZCcx8l';

export default function (listener) {
  const flatfile = new FlatfileClient();

  //Logs all events

  listener.on('**', (event) => {
    console.log('> event.topic: ' + event.topic);
  });

  //Space Created Event - Need to create a workbook for the space!! (WIP - DXP)

  listener.on('space:created', async (event) => {
    // this creates the Space with the blank workbook but it doesn't appear in the UI
    const workbook = await flatfile.workbooks.create({
      name: 'HCM Workbook',
      spaceId: event.context.spaceId,
      environmentId: event.context.environmentId,
      sheets: blueprintSheets,
    });
    console.log(`-> My event: ' + ${JSON.stringify(workbook)}`);
  });

  //Job Created Event

  listener.on('job:created', async (event) => {
    const { jobId } = event.context;
    console.log(jobId);
  });

  //Job Updated Events

  listener.on('job:updated', async (event) => {
    const { jobId } = event.context;
    console.log(jobId);
  });

  listener.use(
    recordHook('employees-sheet', (record) => {
      const results = employeeValidations(record);
      console.log(JSON.stringify(results));
      return record;
    })
  );

  listener.use(
    recordHook('jobs-sheet', (record) => {
      const results = jobValidations(record);
      console.log(JSON.stringify(results));
      return record;
    })
  );

  // Run actions
  listener.on('action:triggered', async (event) => {
    const action = event.context.actionName;
    const sheet = event.context.sheetSlug;

    // run actions on employees sheet

    if (sheet === 'employees-sheet') {
      // Run RetriggerValidations action

      if (action === 'employees-sheet:RetriggerValidations') {
        await RetriggerValidations(event);
        console.log(JSON.stringify(action));
      }
    }

    // Run pushToHcmShow action
    if (action === 'employees-sheet:pushToHcmShow') {
      await pushToHcmShow(event);
      console.log(JSON.stringify(action));
    }
  });

  // Excel Extraction
  listener.on('file:created', async (event) => {
    return new ExcelExtractor(event, {
      rawNumbers: true,
    }).runExtraction();
  });
}
