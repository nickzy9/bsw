import { userAlbumManager } from '../UserAlbumManager';
import AsyncStorageMock from '../../../../__mocks__/@react-native-async-storage/async-storage';

// Mock AsyncStorage methods
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
}));

describe('UserAlbumManager', () => {
  afterEach(() => {
    jest.clearAllMocks();
    userAlbumManager['pesistData'] = []; // Reset persisted data
  });

  it('should fetch user albums successfully', async () => {
    // Mock AsyncStorage getItem to return a stored data
    AsyncStorageMock.getItem.mockResolvedValueOnce(JSON.stringify([{ userID: 1, albums: [], isAlldeleted: false }]));

    const completionMock = jest.fn();
    await userAlbumManager.fetchUserAlbum(1, completionMock);

    expect(completionMock).toHaveBeenCalledWith({
      success: true,
      albums: [],
      error: null,
    });
  });
});