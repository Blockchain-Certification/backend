import Logger from './shared/core/logger';
import { port } from './config';
import app from './app';
console.log('vao');
app
  .listen(port, () => {
    Logger.info(`server running on port : ${port}`);
  })
  .on('error', (e) => Logger.error(e));
