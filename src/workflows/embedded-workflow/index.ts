import { Workbook, SpaceConfig } from '@flatfile/configure';
import { EventTopic } from '@flatfile/api';
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor';

import benefitElections from '../../data-templates/benefits-templates/benefit_elections';

//Workbook  - Update to reference your Workbook with Sheet(s)

const HCMShowEmbeddedWorkflow = new SpaceConfig({
  name: 'HCM.Show Embedded Workflow',
  slug: 'HCMShowEmbeddedorkflow',
  workbookConfigs: {
    basic: new Workbook({
      name: 'Benefits Workbook',
      slug: 'Benefitsorkbook',
      namespace: 'Benefits Workbook',
      sheets: {
        benefitElections,
      },
    }),
  },
});

//Excel Plug-in
HCMShowEmbeddedWorkflow.on([EventTopic.Uploadcompleted], (event) => {
  return new ExcelExtractor(event, { rawNumbers: true }).runExtraction();
});

export default HCMShowEmbeddedWorkflow;
