// import * as dotenv from 'dotenv';
// dotenv.config({ path: './.env' });

export const env = {
  baseURL: process.env.BASE_URL || '',
  apiBaseURL: process.env.API_BASE_URL || '',
  postData: {
    title: process.env.POST_TITLE || '',
    body: process.env.POST_BODY || '',
    userId: Number(process.env.POST_USER_ID) || 1
  },
  patchData: {
    title: process.env.PATCH_TITLE || ''
  },
  putData: {
    id: Number(process.env.PUT_ID) || 1,
    title: process.env.PUT_TITLE || '',
    body: process.env.PUT_BODY || '',
    userId: Number(process.env.PUT_USER_ID) || 1
  }
};

export function getEnvConfig() {
  return {
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
    // Add more env variables as needed
  };
}