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
}
