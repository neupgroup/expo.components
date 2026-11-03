import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type ViewStyle,
} from 'react-native';
import { useState, type ReactNode } from 'react';
import { Text } from '@neup/components/ui/text';

export type ButtonVariant = 'solid' | 'tinted' | 'outlined' | 'plain' | 'text';
export type ButtonConvey = 'danger' | 'warning' | 'success' | 'info' | 'none';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';
export type ButtonAlignment = 'left' | 'center' | 'right';

export type ButtonStyleProps = {
  variant?: ButtonVariant;
  convey?: ButtonConvey;
  size?: ButtonSize;
  alignment?: ButtonAlignment;
};

type ButtonProps = Omit<PressableProps, 'children'> & ButtonStyleProps & {
  children: ReactNode;
  loading?: boolean;
  preIcon?: ReactNode;
  postIcon?: ReactNode;
};

const conveyColors: Record<Exclude<ButtonConvey, 'none'>, { background: string; foreground: string; border: string; tint: string }> = {
  danger: { background: '#dc2626', foreground: '#fff', border: '#dc2626', tint: '#fef2f2' },
  warning: { background: '#d97706', foreground: '#fff', border: '#d97706', tint: '#fffbeb' },
  success: { background: '#15803d', foreground: '#fff', border: '#15803d', tint: '#f0fdf4' },
  info: { background: '#0284c7', foreground: '#fff', border: '#0284c7', tint: '#f0f9ff' },
};

export function buttonVariants({
  variant = 'tinted',
  convey = 'none',
  size = 'default',
  alignment = 'center',
}: ButtonStyleProps = {}): ViewStyle {
  const semantic = convey === 'none' ? undefined : conveyColors[convey];
  const primary = { background: '#173d35', foreground: '#d8f36a', border: '#173d35', tint: '#eaf2e3' };
  const colors = variant === 'solid' ? semantic ?? primary : primary;

  const variantStyle: ViewStyle = variant === 'solid'
    ? { backgroundColor: colors.background, borderColor: colors.background, borderWidth: 1 }
    : variant === 'tinted'
      ? { backgroundColor: colors.tint, borderColor: `${colors.border}33`, borderWidth: 1 }
      : variant === 'outlined'
        ? { backgroundColor: 'transparent', borderColor: colors.border, borderWidth: 1 }
        : { backgroundColor: 'transparent', borderColor: 'transparent', borderWidth: 1 };

  const sizeStyle: ViewStyle = size === 'sm'
    ? { minHeight: 36, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 }
    : size === 'lg'
      ? { minHeight: 44, paddingHorizontal: 32, paddingVertical: 10, borderRadius: 8 }
      : size === 'icon'
        ? { width: 40, height: 40, paddingHorizontal: 0, paddingVertical: 0 }
        : { minHeight: 40, paddingHorizontal: 16, paddingVertical: 8 };

  return {
    ...variantStyle,
    ...sizeStyle,
    alignItems: 'center',
    justifyContent: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center',
  };
}

function buttonTextColor(variant: ButtonVariant, convey: ButtonConvey) {
  const semantic = convey === 'none' ? undefined : conveyColors[convey];
  if (variant === 'solid') return semantic?.foreground ?? '#d8f36a';
  if (variant === 'tinted' || variant === 'outlined') return semantic?.border ?? '#173d35';
  return '#173d35';
}

export function Button({
  children,
  loading = false,
  disabled = false,
  variant = 'tinted',
  convey = 'none',
  size = 'default',
  alignment = 'center',
  preIcon,
  postIcon,
  style,
  onHoverIn,
  onHoverOut,
  ...props
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const isDisabled = disabled || loading;
  const foreground = buttonTextColor(variant, convey);

  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onHoverIn={(event) => {
        setHovered(true);
        onHoverIn?.(event);
      }}
      onHoverOut={(event) => {
        setHovered(false);
        onHoverOut?.(event);
      }}
      style={(state) => [
        styles.button,
        buttonVariants({ variant, convey, size, alignment }),
        hovered && variant === 'solid' && styles.solidHovered,
        state.pressed && styles.active,
        isDisabled && styles.disabled,
        typeof style === 'function' ? style(state) : style,
      ]}
    >
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={foreground} size="small" />
        </View>
      ) : (
        <View style={[styles.content, alignment === 'left' ? styles.contentLeft : alignment === 'right' ? styles.contentRight : styles.contentCenter]}>
          {preIcon}
          {typeof children === 'string' ? (
            <Text name="propertyTourButton" style={{ color: foreground }}>{children}</Text>
          ) : children}
          {postIcon}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contentLeft: { justifyContent: 'flex-start' },
  contentCenter: { justifyContent: 'center' },
  contentRight: { justifyContent: 'flex-end' },
  solidHovered: {
    backgroundColor: '#245448',
  },
  active: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  loading: {
    minHeight: 24,
    justifyContent: 'center',
  },
});
