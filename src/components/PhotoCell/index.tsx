import { ActivityIndicator, DefaultTheme, Text } from "react-native-paper";
import { AlbumModel, PhotoModel, UserModel } from "../../model";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { memo, useState } from "react";
import { DEFAULT_THEME } from "../../theme";
const { width } = Dimensions.get('window');

const PhotCell = ({ item }: { item: PhotoModel }) => {
  const [loading, setLoading] = useState(true);

  const imageLaoded = () => {
    setLoading(false);
  };

  return (
    <View style={styles.imageContainer}>
      {loading && <ActivityIndicator style={styles.image} size='small' color={DEFAULT_THEME.color.primary} />}
      <Image onLoad={imageLaoded} style={styles.image} source={{ uri: item.thumbnailUrl + '.png' }} />
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  imageContainer: {
    backgroundColor: '#asf342',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: (width - 16) / 3,
    aspectRatio: 1,
    paddingBottom: 16,
  },
  image: {
    height: '100%',
    aspectRatio: 1, // Maintains aspect ratio (1:1)
    borderRadius: 5,
  },
});

// Memoizing to orevent unnecessory re-rendering of cell
export default memo(PhotCell);