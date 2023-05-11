import path from 'path';
import waitOn from 'wait-on';
import { createServer } from 'vite';

(async () => {
  let port: number | undefined = undefined;
  const server = await createServer({
    root: path.resolve(__dirname, '../../'),
    configFile: './config/vite.config.dev.ts',
  });
  const app = await server.listen();
  port = app.config.server.port;
  process.env.PORT = `${port}`;
  console.log('port', port);
  wait();
})();

function wait() {
  let param = {
    resources: ['http://localhost:5173/index.html'],
    timeout: 5000,
  };
  waitOn(param, (err) => {
    console.log('err', err);
  });
}
