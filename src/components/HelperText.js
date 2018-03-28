/* @flow */

import * as React from 'react';
import colorModule from 'color';
import { View, Animated, StyleSheet } from 'react-native';
import Text from './Typography/Text';
import withTheme from '../core/withTheme';
import { black, white } from '../styles/colors';
import type { Theme } from '../types';

const helperTextHeight = 16;

type Props = {
  /**
   * If true, user won't be able to interact with the component.
   */
  disabled?: boolean,
  /**
   * Helper text to display under the input.
   */
  helperText?: string,
  /**
   * Whether to style the TextInput with error style.
   */
  hasError: boolean,
  /**
   * Text to replace the helper text with on error.
   */
  errorText?: string,
  /**
   * Underline color of the input.
   */
  activeColor?: string,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
};

type State = {
  errorShown: Animated.Value,
};

/**
 * TextInputs allow users to input text.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/textinput.unfocused.png" />
 *     <figcaption>Unfocused</span>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/textinput.focused.png" />
 *     <figcaption>Focused</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { TextInput } from 'react-native-paper';
 *
 * class MyComponent extends React.Component {
 *   state = {
 *     text: ''
 *   };
 *
 *   render(){
 *     return (
 *       <TextInput
 *         label='Email'
 *         value={this.state.text}
 *         onChangeText={text => this.setState({ text })}
 *       />
 *     );
 *   }
 * }
 * ```
 *
 * @extends TextInput props https://facebook.github.io/react-native/docs/textinput.html#props
 *
 */

class HelperText extends React.Component<Props, State> {
  static defaultProps = {
    disabled: false,
    hasError: false,
    multiline: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      errorShown: new Animated.Value(props.hasError ? 1 : 0),
    };
  }

  state: State;

  componentWillReceiveProps(nextProps) {
    if (nextProps.hasError !== this.props.hasError) {
      (nextProps.hasError ? this._animateFocus : this._animateBlur)(
        this.state.errorShown
      );
    }
  }

  componentWillUnmount() {
    clearTimeout(this._timer);
  }

  _timer: any;
  _root: any;
  _setRef: any = (c: Object) => {
    this._root = c;
  };

  _animateFocus = (animatedValue: Animated.Value) => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 150,
    }).start();
  };

  _animateBlur = (animatedValue: Animated.Value) => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 180,
    }).start();
  };

  getHelperTextColor(dark: boolean) {
    return dark
      ? colorModule(white)
          .alpha(0.7)
          .rgb()
          .string()
      : colorModule(black)
          .alpha(0.54)
          .rgb()
          .string();
  }

  renderUnderlineText(text?: string, containerStyle: Object, color: string) {
    return (
      text && (
        <Animated.View style={containerStyle}>
          {text && <Text style={[styles.helperText, { color }]}>{text}</Text>}
        </Animated.View>
      )
    );
  }

  render() {
    const {
      disabled,
      helperText,
      hasError,
      errorText,
      style,
      theme,
      activeColor,
    } = this.props;
    const { colors, dark } = theme;
    const { disabled: inactiveColor, errorText: errorTextColor } = colors;

    const helperTextColor = disabled
      ? inactiveColor
      : activeColor ||
        (hasError && errorTextColor) ||
        this.getHelperTextColor(dark);

    const underlineArea = {
      height: Animated.multiply(
        helperTextHeight,
        helperText ? 1 : errorText ? this.state.errorShown : 0
      ),
      width: '100%',
    };

    const helperTextContainer = {
      opacity: errorText
        ? Animated.add(1, Animated.multiply(this.state.errorShown, -1))
        : 1,
    };

    const errorTextContainer = {
      position: 'absolute',
      opacity: this.state.errorShown,
      transform: [
        {
          translateY: this.state.errorShown.interpolate({
            inputRange: [0, 1],
            outputRange: [-helperTextHeight, 0],
          }),
        },
      ],
    };

    return (
      <View style={style}>
        {helperText || errorText ? (
          <Animated.View style={underlineArea}>
            {this.renderUnderlineText(
              helperText,
              helperTextContainer,
              helperTextColor
            )}
            {this.renderUnderlineText(
              errorText,
              errorTextContainer,
              errorTextColor
            )}
          </Animated.View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  helperText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default withTheme(HelperText);
