import { Workbook, SpaceConfig } from '@flatfile/configure';
import { EventTopic } from '@flatfile/api';
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor';

import benefitElections from '../../data-templates/benefits-templates/benefit_elections';

//Workbook  - Update to reference your Workbook with Sheet(s)

const HCMShowFilefeedWorkflow05181 = new SpaceConfig({
  name: 'HCM.Show FilefeedWorkflow05181',
  slug: 'HCMShowFilefeedWorkflow05181',
  workbookConfigs: {
    basic: new Workbook({
      name: 'Filefeed Workbook 05181',
      slug: 'FilefeedWorkbook05181',
      namespace: 'Filefeed Workbook 05181',
      sheets: {
        benefitElections,
      },
    }),
  },
});

//Excel Plug-in
HCMShowFilefeedWorkflow05181.on([EventTopic.Uploadcompleted], (event) => {
  return new ExcelExtractor(event, { rawNumbers: true }).runExtraction();
});

export default HCMShowFilefeedWorkflow05181;
