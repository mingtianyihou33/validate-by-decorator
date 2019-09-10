import * as Koa from 'koa';
import * as bodify from 'koa-body';
import * as serve from 'koa-static';
import * as timing from 'koa-xtime';

const app = new Koa();
app.use(timing());
app.use(bodify({multipart: true, strict: false}));
app.use(serve(`${__dirname}/public`));
// app.use((ctx: Koa.Context) => {
//     ctx.body = 'hello ts';
// });
import {load} from './utils/route-decorators';
import {resolve} from 'path';

const router = load(resolve(__dirname, './routes'));


app.use(router.routes());

app.listen(3000, () => {
    console.log('http://localhost:3000');
});
