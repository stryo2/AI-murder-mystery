import { env } from './config/env';
import { createApp } from './app';

createApp().listen(env.PORT, () => {
  console.log(`Server listening on http://localhost:${env.PORT}`);
});
