import { PRODUCTION } from 'src/core/constants';
import development from './env-dev';
import production from './env-prod';

export default () => {
  if (process.env.NODE_ENV === PRODUCTION) {
    return production;
  } else return development;
};
