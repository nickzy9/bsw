import React, { useEffect, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, ListRenderItemInfo } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchPhotos, clearData } from '../store/slice/PhotosSlice';
import { PhotoModel } from '../model';

import { DefaultTheme, IconButton } from 'react-native-paper';
import PhotoCell from '../components/PhotoCell';
import { PhotosProps } from '../navigation';
import EmptyState from '../components/EmptyState';
import { useTranslation } from 'react-i18next';
import { DEFAULT_THEME } from '../theme';

const PhotoScreen: React.FC<PhotosProps> = ({ route, navigation }: PhotosProps) => {

  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error, isLastPageReached, isAllPhotos } = useSelector((state: RootState) => state.photos);

  // TODO:- Improve AlbumID Parameter passing
  const toggleAllPhotos = useCallback(() => {
    dispatch(fetchPhotos({ start: 0, albumID: (!isAllPhotos) ? -1 : (route.params.album.id ?? -1) }));
  }, [dispatch, isAllPhotos, route.params.album.id]);

  useEffect(() => {
    navigation.setOptions({
      title: isAllPhotos ? 'All Photos' : route.params.album.title.slice(0, 20), // Dont overflow the text for iOS
      headerRight: () => (
        <IconButton icon="star" onPress={toggleAllPhotos} size={18} iconColor={DEFAULT_THEME.color.primary} />
      ),

      headerLeft: () => (
        <IconButton icon="arrow-left" onPress={navigation.goBack} size={18} iconColor={DEFAULT_THEME.color.primary} />
      )
    });

    navigation.addListener('beforeRemove', (e) => {
      dispatch(clearData());
    })

    dispatch(clearData());
    dispatch(fetchPhotos({ start: 0, albumID: isAllPhotos ? -1 : route.params.album.id ?? -1 }));
  }, [dispatch, isAllPhotos, route.params.album.id]);

  // Load next set of data 
  const _fetchNext = useCallback(() => {
    if (!loading && !isLastPageReached) {
      dispatch(fetchPhotos({ start: data.length, albumID: isAllPhotos ? -1 : route.params.album.id ?? -1 }));
    }
  }, [dispatch, { start: data.length }]);

  const _renderItem = ({ item }: ListRenderItemInfo<PhotoModel>) => {
    return <PhotoCell key={item.id} item={item} />;
  };

  const _tryAgain = useCallback(() => {
    dispatch(fetchPhotos({ start: 0, albumID: isAllPhotos ? -1 : route.params.album.id ?? -1 }));
  }, [dispatch, isAllPhotos, route.params.album.id]);

  // Show loading
  if (data.length == 0 && loading) {
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
    <FlatList contentContainerStyle={styles.container}
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={_renderItem}
      onEndReached={_fetchNext}
      horizontal={false}
      numColumns={3}
      onEndReachedThreshold={0.1}
      ListFooterComponent={loading ? <ActivityIndicator size='small' color={DEFAULT_THEME.color.primary} /> : null}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: DEFAULT_THEME.baseLayout.padding,
    paddingHorizontal: DEFAULT_THEME.baseLayout.padding,
    paddingBottom: DEFAULT_THEME.baseLayout.lastElementBottomPadding,
  }
});

export default PhotoScreen;
