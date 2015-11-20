import most from 'most';
import hold from '@most/hold'
import {h} from '@motorcycle/dom';
import ticker from './ticker.js';

function makeRandomColor() {
  let hexColor = Math.floor(Math.random() * 16777215).toString(16);
  while (hexColor.length < 6) {
    hexColor = '0' + hexColor;
  }
  hexColor = '#' + hexColor;
  return hexColor;
}

function intent(DOM) {
  const tickerActions = ticker.intent(DOM);
  const getTickerItemId = (ev) => parseInt(
    ev.target.parentElement.className.match(/item\d+/)[0].replace('item', '')
  );
  return {
    stopTicker$: tickerActions.stop$.map(getTickerItemId),
    removeTicker$: tickerActions.remove$.map(getTickerItemId)
  };
}

function model(actions) {
  const color$ = most.periodic(1000, 1)
    .map(makeRandomColor)
    .startWith('#000000');

  const insertMod$ = most.periodic(5000, 1)
    .loop(x => ({seed: x+1, value: x+1}), 0)
    .take(10)
    .map(id => function (oldList) {
      const stopThisTicker$ = actions.stopTicker$.filter(x => x === id);
      const tickerState$ = hold(
        ticker.model({color$}, {stop$: stopThisTicker$})
      )
      tickerState$.drain();
      return oldList.concat([{id, state$: tickerState$}]);
    });

  const removeMod$ = actions.removeTicker$
    .map(id => function (oldList) {
      return oldList.filter(item => item.id !== id);
    });

  const mod$ = most.merge(insertMod$, removeMod$);

  return mod$
    .scan((acc, mod) => mod(acc), [])
}

function view(state$) {
  return state$.map(listOfTickers =>
    h('div#the-view', listOfTickers.length ?
      listOfTickers.map(item => ticker.view(item.state$, `.item${item.id}`)) :
      h('h3', 'Loading...')
    )
  );
}

export default {intent, model, view};
