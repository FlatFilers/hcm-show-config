import api from '@flatfile/api';

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
