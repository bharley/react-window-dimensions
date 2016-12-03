/* eslint no-unused-expressions:0 */

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import debounce from 'lodash.debounce';
import windowDimensions from '../src';

const ExampleComponent = ({ a, b, ...props }) => ( // eslint-disable-line no-unused-vars, react/prop-types
  <div {...props}>Hello</div>
);

const resizeWindow = (width, height) => {
  // Resize the window
  window.innerWidth = width;
  window.innerHeight = height;

  // Fire an event
  const event = document.createEvent('Event');
  event.initEvent('resize', false, false);
  window.dispatchEvent(event);
};

const blockingTimeout = time => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, time);
});

describe('windowDimensions', () => {
  let wrapper = null;
  let WrappedComponent = null;
  let originalInnerWidth = null;
  let originalInnerHeight = null;

  beforeEach(() => {
    WrappedComponent = windowDimensions()(ExampleComponent);

    // Save the original window properties
    originalInnerWidth = window.innerWidth;
    originalInnerHeight = window.innerHeight;

    // Standardize the dimensions
    window.innerWidth = 1024;
    window.innerHeight = 768;
  });

  afterEach(() => {
    // Ensure we unmount the component
    if (wrapper) {
      wrapper.unmount();
      wrapper = null;
    }

    // Restore the window properties
    window.innerWidth = originalInnerWidth;
    window.innerHeight = originalInnerHeight;
  });

  it('should render the wrapped component', () => {
    wrapper = shallow(<WrappedComponent />);
    expect(wrapper.name()).to.equal('ExampleComponent');
  });

  it('should pass properties through', () => {
    wrapper = shallow(
      <WrappedComponent id="important-container" className="example-class" />,
    );
    expect(wrapper.prop('id')).to.equal('important-container');
    expect(wrapper.prop('className')).to.equal('example-class');
  });

  it('should inject `width` and `height` by default', () => {
    wrapper = shallow(<WrappedComponent />);
    expect(wrapper.prop('width')).to.equal(window.innerWidth);
    expect(wrapper.prop('height')).to.equal(window.innerHeight);
  });

  it('should update when the window dimensions change', () => {
    wrapper = shallow(<WrappedComponent />);
    expect(wrapper.prop('width')).to.equal(1024);
    expect(wrapper.prop('height')).to.equal(768);
    resizeWindow(1920, 1080);
    expect(wrapper.prop('width')).to.equal(1920);
    expect(wrapper.prop('height')).to.equal(1080);
  });

  describe('api', () => {
    describe('take', () => {
      it('should allow the injected props to be customized', () => {
        WrappedComponent = windowDimensions({
          take: () => ({ a: window.innerWidth, b: window.innerHeight }),
        })(ExampleComponent);
        wrapper = shallow(<WrappedComponent />);
        expect(wrapper.prop('a')).to.equal(window.innerWidth);
        expect(wrapper.prop('b')).to.equal(window.innerHeight);
      });

      it('should provide the props for altering the injected props', () => {
        WrappedComponent = windowDimensions({
          take: ({ showWidth }) => {
            if (showWidth) {
              return { width: window.innerWidth };
            }

            return {};
          },
        })(ExampleComponent);
        wrapper = shallow(<WrappedComponent showWidth={false} />);
        expect(wrapper.prop('width')).to.be.undefined;
        wrapper.setProps({ showWidth: true });
        expect(wrapper.prop('width')).to.equal(window.innerWidth);
      });
    });

    describe('debounce', () => {
      it('should accept a function wrapper', () => {
        let spy;
        WrappedComponent = windowDimensions({
          debounce: (fn) => {
            spy = sinon.spy(fn);
            return spy;
          },
        })(ExampleComponent);
        wrapper = shallow(<WrappedComponent />);
        resizeWindow(1920, 1080);
        resizeWindow(2560, 1440);
        expect(spy.calledTwice).to.be.true;
      });

      it('should work with lodash\'s implementation of debounce', async () => {
        let spy;
        WrappedComponent = windowDimensions({
          debounce: (fn) => {
            spy = sinon.spy(fn);
            return debounce(spy, 10);
          },
        })(ExampleComponent);
        wrapper = shallow(<WrappedComponent />);
        resizeWindow(1920, 1080);
        resizeWindow(2560, 1440);
        await blockingTimeout(15);
        resizeWindow(1920, 1080);
        resizeWindow(2560, 1440);
        await blockingTimeout(15);
        expect(spy.calledTwice).to.be.true;
      });
    });
  });
});
