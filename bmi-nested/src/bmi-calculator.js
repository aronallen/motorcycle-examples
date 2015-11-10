import {just, combine} from 'most'
import {h} from '@motorcycle/dom';
import labeledSlider from './labeled-slider';

function bmiCalculator({DOM}) {
  let weightProps$ = just({
    label: 'Weight', unit: 'kg', min: 40, initial: 70, max: 140
  });
  let heightProps$ = just({
    label: 'Height', unit: 'cm', min: 140, initial: 170, max: 210
  });
  let weightSlider = labeledSlider({DOM, props$: weightProps$}, '.weight');
  let heightSlider = labeledSlider({DOM, props$: heightProps$}, '.height');

  let bmi$ = combine(
    (weight, height) => {
      let heightMeters = height * 0.01;
      let bmi = Math.round(weight / (heightMeters * heightMeters));
      return bmi;
    },
    weightSlider.value$,
    heightSlider.value$
  );

  return {
    DOM: bmi$.combine(
      (bmi, weightVTree, heightVTree) =>
        h('div', [
          weightVTree,
          heightVTree,
          h('h2', 'BMI is ' + bmi)
        ])
      , weightSlider.DOM,
      heightSlider.DOM
    )
  };
}

export default bmiCalculator;
