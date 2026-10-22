import { forwardRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  TextInput as NativeTextInput,
  type TextInputProps as NativeTextInputProps,
  type TextInput as NativeTextInputInstance,
  View,
} from 'react-native';
import { Text } from '@neup/components/ui/text';
import outfitFonts from '@/@base/fonts/outfitfonts';

export type InputProps = NativeTextInputProps & {
  preIcon?: ReactNode;
  preText?: string;
  postIcon?: ReactNode;
  postText?: string;
  preAction?: () => void;
  postAction?: () => void;
};

export const Input = forwardRef<NativeTextInputInstance, InputProps>(
  function Input(
    {
      placeholderTextColor = '#9aa6a2',
      style,
      preIcon,
      preText,
      postIcon,
      postText,
      preAction,
      postAction,
      secureTextEntry,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) {
    const [focusProgress] = useState(() => new Animated.Value(0));

    const updateFocus = (nextFocused: boolean) => {
      Animated.timing(focusProgress, {
        toValue: nextFocused ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    };

    return (
      <Animated.View
        style={[
          styles.container,
          {
            borderColor: focusProgress.interpolate({
              inputRange: [0, 1],
              outputRange: ['#d7e1dc', '#173d35'],
            }),
            borderWidth: focusProgress.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.5],
            }),
          },
          style,
        ]}
      >
        {(preIcon != null || (preText != null && preText !== '')) && (
          <Adornment action={preAction} accessibilityLabel="Input leading action">
            {preIcon ?? <Text name="regular" style={styles.adornmentText}>{preText}</Text>}
          </Adornment>
        )}
        <NativeTextInput
          {...props}
          ref={ref}
          placeholderTextColor={placeholderTextColor}
          onFocus={(event) => {
            updateFocus(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            updateFocus(false);
            onBlur?.(event);
          }}
          secureTextEntry={secureTextEntry}
          style={[styles.input, secureTextEntry && styles.passwordInput]}
        />
        {(postIcon != null || (postText != null && postText !== '')) && (
          <Adornment action={postAction} accessibilityLabel="Input trailing action">
            {postIcon ?? <Text name="regular" style={styles.adornmentText}>{postText}</Text>}
          </Adornment>
        )}
      </Animated.View>
    );
  },
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: '#d7e1dc',
    borderRadius: 13,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 8,
    color: '#173d35',
    fontFamily: outfitFonts.regular,
    fontSize: 15,
    lineHeight: 21,
  },
  passwordInput: {
    letterSpacing: 2,
  },
  adornment: {
    minHeight: 40,
    minWidth: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adornmentText: {
    color: '#42604b',
  },
});

function Adornment({
  action,
  accessibilityLabel,
  children,
}: {
  action?: () => void;
  accessibilityLabel: string;
  children: ReactNode;
}) {
  if (!action) return <View style={styles.adornment}>{children}</View>;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={action}
      hitSlop={8}
      style={styles.adornment}
    >
      {children}
    </Pressable>
  );
}
