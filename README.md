# react-window-dimensions
[![Build Status](https://travis-ci.org/bharley/react-window-dimensions.svg?branch=master)](https://travis-ci.org/bharley/react-window-dimensions)

A higher order component that can be used to inject the window dimensions into your component
as properties.


# Installation

```
npm i -S react-window-dimensions
```

# Basic Usage

```js
import React from 'react';
import windowDimensions from 'react-window-dimensions';

const MyComponent = ({ width, height }) => (
  <div>
    The window is {width} x {height}!
  </div>
);

export default windowDimensions()(MyComponent);
```

# Advanced Usage

```js
import React from 'react';
import windowDimensions from 'react-window-dimensions';
import debounce from 'lodash.debounce';

const MyComponent = ({ windowWidth }) => (
  <div>
    The window is {windowWidth} pixels wide!
  </div>
);

export default windowDimensions({
  take: () => ({ windowWidth: window.innerWidth }),
  debounce: onResize => debounce(onResize, 100),
})(MyComponent);
```

# Options

There are several options you can use to alter the higher order component:

- **take** - a function that maps the window to props that are passed into the wrapped component (default: `(props) => ({ width: window.innerWidth, height: window.innerHeight })`)
- **debounce** - a function that debounces the `resize` event handler (default: `fn => fn`)

# Contributing

Pull requests are welcome. Code style is inherited from [airbnb-base] and enforced by [eslint].
You can check that your changes respect the code style by running the `lint` command:

```
npm run lint
```

If you're submitting a bugfix, a test to document (and prevent) the issue is welcome.

[eslint]: http://eslint.org/
[airbnb-base]: https://www.npmjs.com/package/eslint-config-airbnb-base
