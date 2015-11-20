import {just, combine} from 'most'
import isolate from '@cycle/isolate'
import {div, h2} from '@motorcycle/dom';
import LabeledSlider from './labeled-slider';

function bmiCalculator({DOM}) {
  let weightProps$ = just({
    label: 'Weight', unit: 'kg', min: 40, initial: 70, max: 140
  });
  let heightProps$ = just({
    label: 'Height', unit: 'cm', min: 140, initial: 170, max: 210
  });

  let WeightSlider = isolate(LabeledSlider);
  let HeightSlider = isolate(LabeledSlider);

  let weightSlider = WeightSlider({DOM, props$: weightProps$}, '.weight');
  let heightSlider = HeightSlider({DOM, props$: heightProps$}, '.height');

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
        div([
          weightVTree,
          heightVTree,
          h2('BMI is ' + bmi)
        ]),
      weightSlider.DOM,
      heightSlider.DOM
    )
  };
}

export default bmiCalculator;
