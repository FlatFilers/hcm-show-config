import { Workbook, SpaceConfig } from '@flatfile/configure';
import { EventTopic } from '@flatfile/api/api';
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor';

import benefitElections from '../../data-templates/benefits-templates/benefit_elections';

//Workbook  - Update to reference your Workbook with Sheet(s)

const HCMShowEmbeddedWorkflow = new SpaceConfig({
  name: 'HCM.Show Embedded Workflow',
  slug: 'HCMShowEmbeddedWorkflow',
  workbookConfigs: {
    basic: new Workbook({
      name: 'Benefits Workbook',
      slug: 'BenefitsWorkbook',
      namespace: 'Benefits Workbook',
      sheets: {
        benefitElections,
      },
    }),
  },
});

//Excel Plug-in
HCMShowEmbeddedWorkflow.on([EventTopic.FileCreated], (event) => {
  return new ExcelExtractor(event, { rawNumbers: true }).runExtraction();
});

export default HCMShowEmbeddedWorkflow;
