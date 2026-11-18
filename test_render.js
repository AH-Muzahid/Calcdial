const React = require('react');
const ReactDOMServer = require('react-dom/server');

const element = React.createElement('select', {
  style: { WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' },
  className: 'appearance-none'
});

console.log(ReactDOMServer.renderToString(element));
