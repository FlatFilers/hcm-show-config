import { Workbook, SpaceConfig } from '@flatfile/configure';

import benefitElections from '../../data-templates/benefits-templates/benefit_elections';

//Workbook  - Update to reference your Workbook with Sheet(s)
export default new SpaceConfig({
  name: 'HCM.Show Filefeed Workflow',
  slug: 'HCMShowFilefeedflows',
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
