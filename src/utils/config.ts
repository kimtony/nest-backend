import { parse } from 'yaml';
import * as path from 'path';
import * as fs from 'fs';

// 获取项目运行环境
export const getEnv = () => {
  return process.env.NODE_ENV;
};

export const IS_PRODUCTION = getEnv() === 'production';

// 读取项目配置
export const getConfig = () => {
  const environment = IS_PRODUCTION ? IS_PRODUCTION : 'dev';
  console.log( `当前运行的环境:${environment}`);
  const yamlPath = path.join(process.cwd(), `./config.${environment}.yml`);
  const file = fs.readFileSync(yamlPath, 'utf8');
  const config = parse(file);
  return config;
};