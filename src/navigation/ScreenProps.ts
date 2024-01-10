import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AlbumModel } from "../model";

export type RootStackParamList = {
    UserList: undefined,
    Photos: { album: AlbumModel }
};
  
export type UserListProps = NativeStackScreenProps<RootStackParamList, 'UserList'>
export type PhotosProps = NativeStackScreenProps<RootStackParamList, 'Photos'>