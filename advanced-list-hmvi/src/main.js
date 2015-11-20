import {run} from '@motorcycle/core';
import {makeDOMDriver} from '@motorcycle/dom';
import app from './app.js';

function main(sources) {
  return {
    DOM: app.view(app.model(app.intent(sources.DOM)))
  };
}

run(main, {
  DOM: makeDOMDriver('#main-container')
});
