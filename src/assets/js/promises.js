import { c, error } from './helpers/console';
const pow = (value, callback) => {
  setTimeout(() => {
    callback(value, value * value);
  }, Math.random() * 1000);
};

const pow2 = (value) => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({ value, result: value * value });
  }, Math.random() * 1000);
});

const promise = () => {
  pow(2, (value, result) => {
    c('[Callback]: Start');
    c(`[Callback]: ${value}, ${result}`);
    pow(4, (value, result) => {
      c(`[Callback]: ${value}, ${result}`);
      pow(6, (value, result) => {
        c(`[Callback]: ${value}, ${result}`);
        c('[Callback]: End');
      });
    });
  });

  pow2(2)
    .then(data => {
      c('[Promise]: Start')
      c(`[Promise]: ${data.value} - ${data.result}`);
      return pow2(4);
    })
    .then(data => {
      c(`[Promise]: ${data.value} - ${data.result}`);
      return pow2(6);
    })
    .then(data => {
      c(`[Promise]: ${data.value} - ${data.result}`);
    })
    .catch(e => error(e))
    .finally(() => c('[Promise]: End'))
};

export default promise;
