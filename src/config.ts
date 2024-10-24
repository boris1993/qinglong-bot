import dotenv from 'dotenv';

dotenv.config();

export const config = {
  QINGLONG_URL: process.env.QINGLONG_URL || '',
  QINGLONG_CLIENT_ID: process.env.QINGLONG_CLIENT_ID || '',
  QINGLONG_CLIENT_SECRET: process.env.QINGLONG_CLIENT_SECRET || '',
  DINGTALK_CLIENT_ID: process.env.DINGTALK_CLIENT_ID || '',
  DINGTALK_CLIENT_SECRET: process.env.DINGTALK_CLIENT_SECRET || '',
  TG_BOT_TOKEN: process.env.TG_BOT_TOKEN || '',
  TG_PROXY: process.env.TG_PROXY || '',
  TG_API_ROOT: process.env.TG_API_ROOT || 'https://api.telegram.org', // 默认值为 api.telegram.org
};
