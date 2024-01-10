import React, { useState } from "react";
import { AlbumModel, UserModel } from "../../model";
import { Button, DefaultTheme, Icon, IconButton, Text } from "react-native-paper";
import { Dimensions, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { AlbumsExpandableContainer } from "../AlbumsExpandableContainer";
import { userAlbumManager } from "../../services/dataManager";
import { DEFAULT_THEME } from "../../theme";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get('window');
const CHILD_CELL_HEIGHT = 58;

interface UserItemProps {
  item: UserModel;
  callback: (album: AlbumModel) => void;
}

export const UserSectionCellWithAlbums: React.FC<UserItemProps> = ({ item, callback }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [albums, setAlbums] = useState<AlbumModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    userAlbumManager.fetchUserAlbum(item.id, (result) => {
      setLoading(false);
      setAlbums(result.albums)
    });
  };

  const onItemPress = () => {

    setExpanded(!expanded);
    if (expanded) {
      return;
    }
    fetchData();
  };

  const handleDelete = (value: AlbumModel) => {
    userAlbumManager.deleteAlbum(item.id, value.id, (result) => {
      setAlbums(result.updateAlbums);
    });
  };

  // Albums
  const renderAlbumComponents = () => {
    return albums.length > 0 ? albums.map((albumItem, index) => (
      <TouchableWithoutFeedback key={index} onPress={() => callback(albumItem)}>
        <View style={styles.albumContainer}>
          <View style={styles.albumTextContainer}>
            <Text style={styles.albumText}>{albumItem.title}</Text>
            <Icon size={16} source='arrow-right' />
          </View>
          <IconButton icon="delete" onPress={() => handleDelete(albumItem)} size={24} iconColor={DEFAULT_THEME.color.primary} />
        </View>
      </TouchableWithoutFeedback>
    )
    ) : <Text> {t('Albums are empty')}</Text>;
  };

  // User section
  return (
    <View style={styles.userCellBGContainer}>
      <View style={styles.userCellInternalContainer}>
        <View style={styles.userCellTextContainer}>
          <Text style={styles.userCellTitleText}>{item.name}</Text>
          <Text style={styles.userCellSubtitleText}>{item.email}</Text>
        </View>
        <Button textColor={DEFAULT_THEME.color.primary} icon={expanded ? "arrow-up" : "arrow-down"} 
        onPress={onItemPress} 
        loading={loading}>  
        {expanded ? 'Hide' : 'Show'} </Button>
      </View>

      <AlbumsExpandableContainer
        expanded={expanded}
        updatedHeight={albums.length == 0 && !loading ? CHILD_CELL_HEIGHT + 12 : (albums.length * (CHILD_CELL_HEIGHT + 12))} >
        {renderAlbumComponents()}
      </AlbumsExpandableContainer>
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  userCellBGContainer: {
    borderColor: DEFAULT_THEME.color.primary,
    borderWidth: 1,
    marginBottom: DEFAULT_THEME.baseLayout.margin,
    borderRadius: DEFAULT_THEME.baseLayout.cornerRadius1,
    padding: DEFAULT_THEME.baseLayout.padding,
  },

  userCellInternalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },

  userCellTextContainer: {
    justifyContent: "space-around",
    flexDirection: 'column'
  },

  userCellTitleText: {
    opacity: 0.7, fontSize: DEFAULT_THEME.fontSize.title
  },

  userCellSubtitleText: {
    marginVertical: 4,
    opacity: 0.5,
    fontSize: DEFAULT_THEME.fontSize.subTitle
  },

  albumContainer: {
    flex: 1,
    paddingVertical: 2,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    width: width - 90,
    marginBottom: 8,
    marginLeft: 24,
  },

  albumTextContainer: {
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    flex: 1,
    borderWidth: 1,
    borderRadius: DEFAULT_THEME.baseLayout.cornerRadius2,
    borderColor: DefaultTheme.colors.secondary,
    // backgroundColor: DEFAULT_THEME.color.tertiary,
    height: CHILD_CELL_HEIGHT,
  },

  albumText: {
    flex: 1, // Takes the available space
    marginRight: 16, // Minimum difference between text and delete button
    fontSize: DEFAULT_THEME.fontSize.small
  },
});