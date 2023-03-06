import { Workbook, SpaceConfig } from '@flatfile/configure';
import { EventTopic } from '@flatfile/api';
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor';

import Jobs from '../../data-templates/hcm-templates/jobs';
import Employees from '../../data-templates/hcm-templates/employees';
import https from 'https';

//Workbook  - Update to reference your Workbook with Sheet(s)

const HCMShowProjectWorkflow = new SpaceConfig({
  name: 'HCM.Show Project Workflow',
  slug: 'HCMShowProjectWorkflow',
  workbookConfigs: {
    basic: new Workbook({
      name: 'HCM Workbook',
      slug: 'HCMWorkbook',
      namespace: 'HCM Workbook',
      sheets: {
        Jobs,
        Employees,
      },
    }),
  },
});

//Excel Plug-in
HCMShowProjectWorkflow.on([EventTopic.Uploadcompleted], (event) => {
  return new ExcelExtractor(event, { rawNumbers: true }).runExtraction();
});

HCMShowProjectWorkflow.on([EventTopic.Spaceadded], (event) => {
  const { spaceId } = event.context;

  try {
    const req = https.request({
      method: 'POST',
      protocol: 'https:',
      hostname: 'webhook.site',
      path: `/83498c47-9dd1-4351-b7af-59f767d66762`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const body = JSON.stringify({ spaceId });
    req.write(body);
    req.end();
  } catch (err: unknown) {
    console.error(`Fetch error: ${JSON.stringify(err, null, 2)}`);
  }
});

//Document attached to each Space of this config
// HCMShowProjectWorkflow.on([EventTopic.Spaceadded], (event) => {

// });

export default HCMShowProjectWorkflow;
