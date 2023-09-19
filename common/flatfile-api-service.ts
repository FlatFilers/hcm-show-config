import api from '@flatfile/api';
import { SheetConfig } from '@flatfile/api/api';

export class FlatfileApiService {
  static async getUserIdFromSpace({
    spaceId,
  }: {
    spaceId: string;
  }): Promise<string> {
    const space = await api.spaces.get(spaceId);

    // console.log('Space: ' + JSON.stringify(space));

    const userId = space.data.metadata.userId;

    if (!userId) {
      throw new Error(
        `No userId found in space metadata for spaceId ${spaceId}`
      );
    }

    return userId;
  }

  static async createWorkbook({
    name,
    spaceId,
    environmentId,
    blueprint,
  }: {
    name: string;
    spaceId: string;
    environmentId: string;
    blueprint: SheetConfig[];
  }) {
    // Create a new workbook using the Flatfile API
    const workbook = await api.workbooks.create({
      name,
      spaceId: spaceId,
      environmentId: environmentId,
      labels: ['primary'],
      sheets: blueprint,
      actions: [
        {
          operation: 'submitAction',
          mode: 'foreground',
          label: 'Submit',
          type: 'string',
          description: 'Submit Data to HCM Show',
          primary: true,
        },
      ],
    });

    if (workbook.data.id) {
      throw new Error(`Error creating workbook for spaceId ${spaceId}`);
    }

    return workbook.data.id;
  }

  static async configureSpace({
    spaceId,
    environmentId,
    workbookId,
    userId,
    documentId,
    theme,
  }: {
    spaceId: string;
    environmentId: string;
    workbookId: string;
    userId: string;
    documentId: string;
    theme: any;
  }) {
    await api.spaces.update(spaceId, {
      environmentId,
      primaryWorkbookId: workbookId,
      guestAuthentication: ['shared_link'],
      metadata: {
        userId,
        sidebarConfig: {
          showSidebar: true,
          defaultPage: {
            documentId,
          },
        },
        theme,
      },
    });
  }
}
