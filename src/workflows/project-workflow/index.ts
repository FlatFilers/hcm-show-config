import { Workbook, SpaceConfig } from '@flatfile/configure';

import Jobs from '../../data-templates/hcm-templates/jobs';
import Employees from '../../data-templates/hcm-templates/employees';

//Workbook  - Update to reference your Workbook with Sheet(s)
export default new SpaceConfig({
  name: 'HCM.Show Project Workflow',
  slug: 'HCMShowProjectWorkflows1',
  workbookConfigs: {
    basic: new Workbook({
      name: 'HCM Workbook',
      slug: 'HCMWorkbook-21',
      namespace: 'HCM Workbook',
      sheets: {
        Jobs,
        Employees,
      },
    }),
  },
});
