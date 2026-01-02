import { client } from '@/api/client.gen';

client.interceptors.request.use((request: Request) => {
  // 1. Logic to get the cookie from the browser
  const csrfToken = document.cookie
    .split('; ')
    .find((row) => row.startsWith('csrftoken='))
    ?.split('=')[1];

  // 2. If it exists, put it in the header for the Django backend
  if (csrfToken) {
    request.headers.set('X-CSRFToken', csrfToken);
  }

  return request;
});