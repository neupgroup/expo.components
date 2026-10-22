import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type TextInputProps as NativeTextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Input } from '@neup/components/ui/input';
import { Text } from '@neup/components/ui/text';

export type PasswordInputProps = Omit<NativeTextInputProps, 'secureTextEntry'> & {
  containerStyle?: StyleProp<ViewStyle>;
};

export function PasswordInput({
  containerStyle,
  style,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      <Input
        {...props}
        secureTextEntry={!visible}
        style={[styles.input, style]}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={visible ? 'Hide password' : 'Show password'}
        accessibilityState={{ selected: visible }}
        onPress={() => setVisible((current) => !current)}
        hitSlop={8}
        style={styles.toggle}
      >
        <Text name="caption" color="#42604b">
          {visible ? 'Hide' : 'Show'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    paddingRight: 68,
  },
  toggle: {
    position: 'absolute',
    right: 14,
    minHeight: 44,
    justifyContent: 'center',
  },
});
