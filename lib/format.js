import sformat from 'should-format';
import config from './config.js';

export function format(value, opts) {
  return config.getFormatter(opts).format(value);
}

export function formatProp(value) {
  const formatter = config.getFormatter();
  return sformat.formatPlainObjectKey.call(formatter, value);
}
