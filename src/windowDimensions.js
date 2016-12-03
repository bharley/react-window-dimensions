import React from 'react';

export default ({
  take = () => ({ width: window.innerWidth, height: window.innerHeight }),
  debounce = fn => fn,
} = {}) => Component => class WindowDimensions extends React.Component {
  static displayName = 'WindowDimensions';

  state = {
    width: 0,
    height: 0,
  };

  onResize = debounce(() => {
    // Note that while we're not actually using this state, it will be used to
    // tell React that this component may need to render again.
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  });

  componentWillMount() {
    window.addEventListener('resize', this.onResize, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize, false);
  }

  render() {
    const props = this.props;
    const windowProps = take(props);

    return (
      <Component {...props} {...windowProps} />
    );
  }
};
