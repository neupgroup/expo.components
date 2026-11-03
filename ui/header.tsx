import { useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { Text } from './text';
import { BaseIcon } from '@/components/element/base-icon';
import theme from '@base/theme.json';

export type ScrollHeaderProps = {
  title: string;
  description?: string;
  onBack?: () => void;
  onHeightChange?: (height: number) => void;
  style?: StyleProp<ViewStyle>;
};

// Render the expanded page header and report its natural height for scroll transitions.
export function ScrollPageHeader({ title, description, onBack, onHeightChange, style }: ScrollHeaderProps) {
  // Report the rendered layout height to the page that owns the scroll view.
  function handleHeaderLayout(event: LayoutChangeEvent) {
    onHeightChange?.(event.nativeEvent.layout.height);
  }

  return (
    <View onLayout={handleHeaderLayout} style={[styles.fullHeader, style]}>
      {onBack ? <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={onBack} style={styles.fullBack}>
        <BaseIcon name="arrow-left" size={18} color="#173d35" />
        <Text name="regular" style={styles.backLabel}>Back</Text>
      </Pressable> : null}
      <Text name="title" style={styles.title}>{title}</Text>
      {description ? <Text name="regular" style={styles.description}>{description}</Text> : null}
    </View>
  );
}

// Render the compact header and animate it against the measured expanded header height.
export function StickyPageHeader({ title, description, onBack, scrollY, headerHeight }: ScrollHeaderProps & { onBack?: () => void; scrollY: Animated.Value; headerHeight: number }) {
  const compactProgress = useRef(new Animated.Value(0)).current;
  const visibleState = useRef(false);
  const transition = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (!headerHeight) return;
    const listenerId = scrollY.addListener(({ value }) => {
      const shouldShow = value >= headerHeight;
      if (shouldShow === visibleState.current) return;
      visibleState.current = shouldShow;
      transition.current?.stop();
      transition.current = Animated.timing(compactProgress, {
        toValue: shouldShow ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      });
      transition.current.start();
    });
    return () => scrollY.removeListener(listenerId);
  }, [compactProgress, headerHeight, scrollY]);

  const compactTranslateY = compactProgress.interpolate({ inputRange: [0, 1], outputRange: [-110, 0] });
  const shadowOpacity = compactProgress.interpolate({ inputRange: [0, 1], outputRange: [0, Platform.OS === 'ios' ? 0.09 : 0.1] });
  const textOpacity = compactProgress.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] });
  const textTranslateY = compactProgress.interpolate({ inputRange: [0, 1], outputRange: [8, 0] });
  const blurOpacity = compactProgress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });

  return (
      <Animated.View pointerEvents="box-none" style={[styles.compactHeader, { shadowOpacity, elevation: compactProgress.interpolate({ inputRange: [0, 1], outputRange: [0, Platform.OS === 'android' ? 4 : 2] }), transform: [{ translateY: compactTranslateY }] }]}>
      {onBack ? <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={onBack} style={styles.compactBack}>
        <BaseIcon name="arrow-left" size={21} color="#173d35" />
      </Pressable> : null}
      <View style={styles.compactText}>
        <Animated.View style={{ opacity: textOpacity, transform: [{ translateY: textTranslateY }] }}>
          <Text name="title3" numberOfLines={1} style={styles.compactTitle}>{title}</Text>
        </Animated.View>
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: blurOpacity }]}>
          <BlurView intensity={22} tint="light" style={StyleSheet.absoluteFill} />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fullHeader: { paddingTop: theme.spacing.space72, paddingHorizontal: theme.spacing.space20, paddingBottom: theme.spacing.space20 },
  fullBack: { minHeight: 44, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.space6 },
  backLabel: { color: '#173d35' },
  title: {},
  description: { marginTop: theme.spacing.headingDescriptionGap, color: '#71817b' },
  compactHeader: { position: 'absolute', zIndex: 5, top: 0, left: 0, right: 0, minHeight: 96, paddingTop: theme.spacing.space40, paddingHorizontal: theme.spacing.space20, paddingBottom: theme.spacing.space4, backgroundColor: '#ffffff', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e5ebe7', shadowColor: '#173d35', shadowOffset: { width: 0, height: Platform.OS === 'ios' ? 2 : 3 }, shadowRadius: Platform.OS === 'ios' ? 5 : 5, flexDirection: 'row', alignItems: 'center' },
  compactBack: { width: 34, height: 44, justifyContent: 'center', alignItems: 'flex-start' },
  compactText: { flex: 1, justifyContent: 'center' },
  compactTitle: { fontSize: 20, letterSpacing: -1.1, fontWeight: '400', flexShrink: 1 },
});
