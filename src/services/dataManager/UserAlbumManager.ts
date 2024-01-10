import {API_PATHS} from '../../constants/APIPaths';
import {API_PARAM_KEYS} from '../../constants/APIParamsKey';
import {ApiResponse, requestAPI} from '../network';
import {AlbumModel} from '../../model';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APP_CONSTANTS} from '../../constants/AppConstants';

export interface PersistedData {
  userID: number;
  albums: AlbumModel[];
  isAlldeleted: boolean;
}

class UserAlbumManager {
  private pesistData: PersistedData[] = [];
  getUserAlbums(userID: number): PersistedData | undefined {
    return this.pesistData.find(data => data.userID === userID);
  }

  setUserAlbums(
    userID: number,
    albums: AlbumModel[],
    isAlldeleted: boolean = false,
  ): void {
    // Check if the user already exists in the array
    const existingUserIndex = this.pesistData.findIndex(
      data => data.userID === userID,
    );

    // If user exists, update the data; otherwise, add a new entry
    if (existingUserIndex !== -1) {
      this.pesistData[existingUserIndex] = {userID, albums, isAlldeleted};
    } else {
      this.pesistData.push({userID, albums, isAlldeleted});
    }
  }

  private async loadUserAlbums(): Promise<void> {
    try {
      const userAlbumsJson = await AsyncStorage.getItem(
        APP_CONSTANTS.STORAGE_KEY,
      );
      if (userAlbumsJson) {
        this.pesistData = JSON.parse(userAlbumsJson);
      }
    } catch (error) {
      console.error('Error loading userAlbums from AsyncStorage:', error);
    }
  }

  private async saveUserAlbums(): Promise<void> {
    try {
      const userAlbumsJson = JSON.stringify(this.pesistData);
      await AsyncStorage.setItem(APP_CONSTANTS.STORAGE_KEY, userAlbumsJson);
    } catch (error) {
      console.error('Error saving userAlbums to AsyncStorage:', error);
    }
  }

  public async fetchUserAlbum(
    userId: number,
    completion: (result: {
      success: boolean;
      albums: AlbumModel[];
      error?: any;
    }) => void,
  ) {
    try {
      await this.loadUserAlbums();
      const storedData = this.getUserAlbums(userId);

      if (storedData) {
        completion({success: true, albums: storedData.albums, error: null});
        return;
      }

      const params: {[key: string]: any} = {
        [API_PARAM_KEYS.USER_ID]: userId,
      };
      const response: ApiResponse<AlbumModel[]> = await requestAPI<
        AlbumModel[]
      >(API_PATHS.ALBUMS, 'GET', params);
      if (response.success) {
        if (response.data) {
          this.setUserAlbums(userId, response.data);
        }

        await this.saveUserAlbums();

        completion({
          success: response.success,
          albums: response.data ?? [],
          error: null,
        });
        return;
      }

      completion({
        success: false,
        error: response.error,
        albums: [],
      });
      return;
    } catch (error) {
      ({success: false, error: error, albums: []});
    }
  }
  public async deleteAlbum(
    userId: number,
    albumId: number,
    completion: (result: {updateAlbums: AlbumModel[]}) => void,
  ) {
    try {
      const userAlbums = this.getUserAlbums(userId);

      if (userAlbums) {
        const updatedAlbums = userAlbums.albums.filter(
          album => album.id !== albumId,
        );
        this.setUserAlbums(userId, updatedAlbums, updatedAlbums.length == 0);

        // Save the updated user albums to storage asynchronously
        await this.saveUserAlbums();
        completion({updateAlbums: updatedAlbums});
        return;
      }
      completion({updateAlbums: []});
      return;
    } catch (error) {
      completion({updateAlbums: []});
      return;
    }
  }

  public async clearStorage(): Promise<void> {
    // Clear all persisted data
    try {
      await AsyncStorage.clear();
      this.pesistData = [];
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}

export const userAlbumManager = new UserAlbumManager();
