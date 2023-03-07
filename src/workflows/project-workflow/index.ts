import { Workbook, SpaceConfig } from '@flatfile/configure';
import { EventTopic } from '@flatfile/api';
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor';

import Jobs from '../../data-templates/hcm-templates/jobs';
import Employees from '../../data-templates/hcm-templates/employees';

//Workbook  - Update to reference your Workbook with Sheet(s)

const HCMShowProjectWorkflow = new SpaceConfig({
  name: 'HCM.Show Project Workflow',
  slug: 'HCMShowProjectWorkflow-apitest2',
  workbookConfigs: {
    basic: new Workbook({
      name: 'HCM Workbook',
      slug: 'HCMWorkbook-apitest2',
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

export default HCMShowProjectWorkflow;
