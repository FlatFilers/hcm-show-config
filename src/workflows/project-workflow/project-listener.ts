import { RecordHook } from '@flatfile/configure';
import { Client, FlatfileVirtualMachine } from '@flatfile/listener';
import { blueprintRaw as blueprint } from '../project-workflow/hcmBlueprint';
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor';
import employeeValidations from './employeeValidations';
import { RetriggerValidations } from './actions/retriggerValidations';
import { pushToHcmShow } from './actions/pushToHcmShow';

const demo = Client.create((client) => {
  client.on('client:init', async (event) => {
    // creates a shell spaceConfig - this will change to 'namespace'
    const spaceConfig = await client.api.addSpaceConfig({
      spacePatternConfig: blueprint,
    });
  });

  // run data hooks on employees sheet
  // need job hooks to be added

  client.on('records:*', async (event) => {
    const sheet = event.context.sheetSlug;
    if (sheet === 'employees-sheet') {
      RecordHook(event, (record) => {
        const results = employeeValidations(record as any);
        console.log(JSON.stringify(results));
        return record;
      });
    }
  });

  // Run actions
  client.on('action:triggered', async (event) => {
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

  // workflow assumes file is loaded via API: POST v1/files
  client.on('upload:*', async (event) => {
    return new ExcelExtractor(event as any, {
      rawNumbers: true,
    }).runExtraction();
  });
});

const FlatfileVM = new FlatfileVirtualMachine();
demo.mount(FlatfileVM);
export default demo;
