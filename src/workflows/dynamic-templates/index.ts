import { Workbook, SpaceConfig } from '@flatfile/configure';
import { EventTopic } from '@flatfile/api';
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor';

import Jobs from '../../data-templates/hcm-templates/jobs';
import Employees from '../../data-templates/hcm-templates/employees';
//import https from 'https';

//Workbook  - Update to reference your Workbook with Sheet(s)

const HCMShowDynamicTemplates = new SpaceConfig({
  name: 'HCM.show Dynamic Templates',
  slug: 'hcm-dynamic-2',
  workbookConfigs: {
    basic: new Workbook({
      name: 'Dynamic Templates Workbook',
      slug: 'dynamic-wb',
      namespace: 'HCM Workbook',
      sheets: {
        Employees,
        Jobs,
      },
    }),
  },
});

//Excel Plug-in
HCMShowDynamicTemplates.on([EventTopic.Uploadcompleted], (event) => {
  return new ExcelExtractor(event, { rawNumbers: true }).runExtraction();
});

// HCMShowProjectWorkflow.on([EventTopic.Spaceadded], (event) => {
//   const { spaceId } = event.context;

//   try {
//     const req = https.request({
//       method: 'POST',
//       protocol: 'https:',
//       hostname: 'webhook.site',
//       path: `/83498c47-9dd1-4351-b7af-59f767d66762`,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//     const body = JSON.stringify({ spaceId });
//     req.write(body);
//     req.end();
//   } catch (err: unknown) {
//     console.error(`Fetch error: ${JSON.stringify(err, null, 2)}`);
//   }
// });

//Document attached to each Space of this config
// HCMShowProjectWorkflow.on([EventTopic.Spaceadded], (event) => {

// });

export default HCMShowDynamicTemplates;
