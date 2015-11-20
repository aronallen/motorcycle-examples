import most from 'most';
import {h} from '@motorcycle/dom';

function intent(DOM, name = '') {
  const removeClicks$ = DOM.select(`${name}.ticker .remove-btn`)
    .events('click');
  const stop$ = removeClicks$;
  const remove$ = removeClicks$.delay(500);
  return {stop$, remove$};
}

function model(props, actions) {
  const x$ = most.periodic(50, 1)
    .loop(x => ({value: x+1, seed: x+1}), 0)
    .takeUntil(actions.stop$);
  const y$ = most.periodic(100, 1)
    .loop(x => ({value: x+1, seed: x+1}), 0)
    .takeUntil(actions.stop$);
  const color$ = most.merge(
    props.color$.takeUntil(actions.stop$),
    actions.stop$.map(() => '#FF0000')
  );
  return most.combine(
    (x, y, color) => ({x, y, color}),
    x$, y$, color$
  )
}

function view(state$, name = '') {
  return state$
    .map(({color, x, y}) => {
      const style = {color, backgroundColor: '#ECECEC'};
      return h(`div.ticker${name}`, {style}, [
        h('h4', `x${x} ${color}`),
        h('h1', `Y${y} ${color}`),
        h('button.remove-btn', 'Remove')
      ]);
    });
}

export default {intent, model, view};
