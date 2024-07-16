import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '../constants/Colors';
import { forwardRef } from 'react';
import { opacity } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

type ButtonProps = {
  text: string;
  isLoading?: boolean;
  disabled?: boolean;
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const Button = forwardRef<View | null, ButtonProps>(
  ({ text, isLoading = false, disabled, ...pressableProps }, ref) => {
    return (
      <Pressable
        ref={ref}
        {...pressableProps}
        disabled={disabled || isLoading}
        style={[
          { opacity: (isLoading || disabled) ? 0.5 : 1 },
          styles.container
        ]}>
        <Text style={styles.text}>{text}</Text>
        {
          isLoading &&
          <View style={styles.activityIndicator}>
            <ActivityIndicator color='white' />
          </View>
        }
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    alignItems: 'center',
    borderRadius: 100,
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  activityIndicator: {
    position: 'absolute',
    right: 20,
    top: 15,
  },
});

export default Button;