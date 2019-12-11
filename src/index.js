import deepDiff from 'deep-diff';
import deepMerge from 'deepmerge';
import resolveSecret from './tools/resolveSecret';
import SimpleEvent from './tools/SimpleEvent';

function parseQuery(queryString) {
  const query = {};
  const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
  for (let i = 0; i < pairs.length; i += 1) {
    const pair = pairs[i].split('=');
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
}

function deprecationNotice(method, isBreaking = false) {
  if (isBreaking) {
    console.warn(
      `[@withkoji/vcc] ${method} is deprecated and no longer available.`,
    );
  } else {
    console.warn(
      `[@withkoji/vcc] ${method} is deprecated and no longer needs to be called.\nYou can safely remove this call from your project!`,
    );
  }
}

const configDidChange = new SimpleEvent();
let config = require('./res/config.json');

if (window && window.location.search && window.location.search !== '') {
  const query = parseQuery(window.decodeURI(window.location.search));
  const urlConfig = JSON.parse(query.config);
  config = deepMerge({ ...config }, urlConfig);
}

export default {
  config,
  configDidChange,
  enableConfigDidChange: () => {
    if (module.hot) {
      module.hot.accept('./res/config.json', () => {
        const previousValue = { ...config };
        // eslint-disable-next-line global-require
        config = require('./res/config.json');

        const originalDiff = deepDiff(previousValue, config);
        console.log(originalDiff);

        const changes = originalDiff.map((diff) => {
          if (diff.kind === 'A') {
            return {
              previousValue: diff.item.lhs,
              newValue: diff.item.rhs,
              path: [...diff.path, diff.index],
            };
          }

          return {
            previousValue: diff.lhs,
            newValue: diff.rhs,
            path: diff.path,
          };
        });

        configDidChange.emit({
          newValue: config,
          previousValue,
          changes,
        });
      });
    }
  },
  resolveSecret,

  // Deprecated
  pageLoad: () => deprecationNotice('Koji.pageLoad()'),
  on: () => deprecationNotice('Koji.on()'),
  request: () => deprecationNotice('Koji.request()', true),
  pwaPrompt: () => deprecationNotice('Koji.pwaPrompt()', true),
};
