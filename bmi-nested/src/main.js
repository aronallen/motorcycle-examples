import {run} from '@motorcycle/core';
import {makeDOMDriver} from '@motorcycle/dom';
import bmiCalculator from './bmi-calculator';

const main = bmiCalculator;

run(main, {
  DOM: makeDOMDriver('#main-container')
});
