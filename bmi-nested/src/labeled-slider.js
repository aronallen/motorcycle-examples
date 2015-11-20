import {combine} from 'most';
import {div, span, input} from '@motorcycle/dom';

function labeledSlider({DOM, props$}, name = '') {
  let initialValue$ = props$.map(props => props.initial);
  let newValue$ = DOM.select(`.labeled-slider${name} .slider`).events('input')
    .map(ev => ev.target.value);
  let value$ = initialValue$.concat(newValue$);
  let vtree$ = combine((props, value) =>
    div(`.labeled-slider${name}`, [
      span('.label', [
        props.label + ' ' + value + props.unit
      ]),
      input('.slider', {
        props: {
          type: 'range',
          min: props.min,
          max: props.max,
          value: value
        }
      })
    ]),
    props$,
    value$
  );

  return {
    DOM: vtree$,
    value$
  };
}

export default labeledSlider;
