import { useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export const AlbumsExpandableContainer = ({
    children,
    expanded,
    updatedHeight
  }: {
    children: React.ReactNode;
    expanded: boolean;
    updatedHeight: number;
  }) => {
    const [height, setHeight] = useState(0);
    const animatedHeight = useSharedValue(0);

    const onLayout = (event: LayoutChangeEvent) => {
      const onLayoutHeight = event.nativeEvent.layout.height;
      if (onLayoutHeight > 0 && height !== onLayoutHeight) {
        setHeight(onLayoutHeight);
      }
    };

    const collapsableStyle = useAnimatedStyle(() => {
      animatedHeight.value = expanded ? withTiming(updatedHeight) : withTiming(0);
      return {
        height: animatedHeight.value,
      };
    }, [expanded, updatedHeight]);
  
    return (
      <Animated.View style={[collapsableStyle, { overflow: "hidden" }]}> 
        <View style={{ position: "absolute" }} onLayout={onLayout}>
          {children}
        </View>
      </Animated.View>
    );
  };