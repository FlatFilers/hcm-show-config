import { Blueprint } from '@flatfile/api';
import { RecordHook } from '@flatfile/configure';
import {
  Client,
  FlatfileVirtualMachine,
  FlatfileEvent,
} from '@flatfile/listener';
import { blueprintRaw as blueprint } from '../../blueprints/benefitsBlueprint';
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor';
import recordHooks from './recordHooks';

const demo = Client.create((client) => {
  client.on('client:init', async (event) => {
    // creates a shell spaceConfig - this will change to 'namespace'
    const spaceConfig = await client.api.addSpaceConfig({
      spacePatternConfig: blueprint,
    });
  });

  // workflow assumes file is loaded via API: POST v1/files
  client.on('upload:*', async (event) => {
    return new ExcelExtractor(event as any, {
      rawNumbers: true,
    }).runExtraction();
  });

  client.on('records:*', async (event) => {
    const sheet = event.context.sheetSlug;
    if (sheet === 'benefit-elections-sheet') {
      RecordHook(event, (record) => {
        const results = recordHooks(record as any);
        return record;
      });
    }
  });
});

const FlatfileVM = new FlatfileVirtualMachine();
demo.mount(FlatfileVM);
export default demo;
