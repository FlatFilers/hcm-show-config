import { recordHook } from '@flatfile/plugin-record-hook';
import { FlatfileClient } from '@flatfile/api';
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor';
import { blueprintSheets } from './blueprint';

process.env.FLATFILE_API_KEY = 'sk_UrerfpfQAhDHaH1qBwj6ah42MrZCcx8l';

export default function (listener) {
  const flatfile = new FlatfileClient();

  //Logs all events

  listener.on('**', (event) => {
    console.log('> event.topic: ' + event.topic);
  });

  //Space Created Event

  listener.on('space:created', async (event) => {
    // this creates the Space with the blank workbook but it doesn't appear in the UI
    const workbook = await flatfile.workbooks.create({
      name: 'Benefits',
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

  // Record Hooks

  listener.use(
    recordHook('employees-sheet', (record) => {
      // if employeeId contains any non-numbers
      // then.. set benefitCoverageType to Retirement_Savings_Coverage_Type_Swedish
      record.compute('employeeId', () => 'Colin', 'Computed value');

      // if benefitPlan is not null
      // then.. set benefitCoverageType to Additional_Benefits_Coverage_Type_Fringe_Benefits
      record.computeIfPresent(
        'employeeId',
        () => 'Colin',
        'Computed if present value'
      );

      // if coverageStartDate is after today
      // then.. set coverageStartDate to invalid
      record.validate('employeeId', () => false, 'Validated value');

      return record;
    })
  );

  // listener.use(
  //   recordHook('employees-sheet', (FlatfileRecord) => {
  //     const results = employeeValidations(record);
  //     console.log(JSON.stringify(results));
  //     return FlatfileRecord;
  //   })
  // );

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
