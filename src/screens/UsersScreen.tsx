import React, { useEffect, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, ListRenderItemInfo } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { AlbumModel, UserModel } from '../model';
import { UserSectionCellWithAlbums } from '../components/UserSectionCellWithAlbums';
import { fetchUsers } from '../store/slice/UsersSlice';
import { UserListProps } from '../navigation';
import EmptyState from '../components/EmptyState';
import { DEFAULT_THEME } from '../theme';
import { useTranslation } from 'react-i18next';

const UserList = ({ navigation }: UserListProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error, isLastPageReached } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchUsers(0));
  }, [dispatch, 0]);

  const _tryAgain = useCallback(() => {
    dispatch(fetchUsers(0));
  }, [dispatch, 0]);

  // Fetch next set of users
  const _fetchNext = useCallback(() => {
    if (!loading && !isLastPageReached) {
      dispatch(fetchUsers(data.length));
    }
  }, [dispatch, data.length, loading]);

  const renderItem = ({ item }: ListRenderItemInfo<UserModel>) => {
    return <UserSectionCellWithAlbums item={item} callback={(album: AlbumModel) => {
      // dispatch(reset());
      navigation.navigate('Photos', { album: album });
    }} />;
  };

  // Show loading
  if (loading && data.length == 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='small' color={DEFAULT_THEME.color.primary} />
      </View>
    );
  }

  // Show full page error
  if (error && data.length == 0) {
    return (
      <EmptyState buttonTitle={t('Try Again!')} errorMessage={t(error)} onRetry={() => _tryAgain()} />
    );
  }

  return (
    <View>
      <FlatList contentContainerStyle={styles.container}
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={_fetchNext}
        onEndReachedThreshold={0.1} // Adjust based on your needs
        ListFooterComponent={loading ? <ActivityIndicator size="small" color={DEFAULT_THEME.color.primary} /> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: DEFAULT_THEME.baseLayout.padding,
    paddingHorizontal: DEFAULT_THEME.baseLayout.padding,
    paddingBottom: DEFAULT_THEME.baseLayout.lastElementBottomPadding,
  },
});

export default UserList;
