// index.ts
import {BSWAppConfig} from './AppConfig';
import developmentConfig from './development';
import productionConfig from './production';

const environment = process.env.NODE_ENV || 'development';
const config: BSWAppConfig =
  environment === 'production' ? productionConfig : developmentConfig;

export default config;
