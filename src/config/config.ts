import { TEST } from '../core/constants';
import development from './env-dev';
import test from './env-test';

export default () => {
  if (process.env.NODE_ENV === TEST) {
    return test;
  } else return development;
};
