import { Workbook, SpaceConfig } from '@flatfile/configure';
import { EventTopic } from '@flatfile/api';
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor';

import Jobs from '../../data-templates/hcm-templates/jobs';
import Employees from '../../data-templates/hcm-templates/employees';
import { pushToWebhook } from '../../validations-plugins/actions/push-to-webhook';

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

// const HCMShowProjectWorkflow = new SpaceConfig({
//   name: 'HCM.Show Employees Only',
//   slug: 'HCMShowProjectWorkflowEmployeesOnly',
//   workbookConfigs: {
//     basic: new Workbook({
//       name: 'HCM Workbook',
//       slug: 'HCMWorkbookEmployees',
//       namespace: 'HCM Workbook',
//       sheets: {
//         Employees,
//       },
//     }),
//   },
// });

//Excel Plug-in
HCMShowProjectWorkflow.on([EventTopic.Uploadcompleted], (event) => {
  return new ExcelExtractor(event, { rawNumbers: true }).runExtraction();
  // return pushToWebhook
});

export default HCMShowProjectWorkflow;
