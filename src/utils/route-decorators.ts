import * as glob from 'glob';
import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import schema, {Rules} from 'async-validator';
import {log} from 'util';

type HTTPMethod = 'get' | 'put' | 'del' | 'post' | 'patch'
type LoadOptions = {
    extanme?: string
}

type RouteOptions = {
    prefix?: string
    middlewares?: Array<Koa.Middlewares>
}
const router = new KoaRouter();
const decorate = (method: HTTPMethod, path: string, options: RouteOptions, router: KoaRouter) => {
    return (target, property, descriptor) => {
        const url = options && options.prefix ? options.prefix + path : path;
        router[method](url, async (ctx: Koa.Context) => {
            // 将参数直接传入
            let param;
            switch (method) {
                case 'get':
                    param = ctx.request.query;
                    break;
                case 'post':
                    param = ctx.request.body;
                    break;
                default:
                    param = {};
            }
            ctx.body = await target[property](param);
        });
    };
};
const method = method => (path: string, options?: RouteOptions) => decorate(method, path, options, router);
export const get = method('get');
export const post = method('post');

export const load = (folder: string, options: LoadOptions = {}): KoaRouter => {
    const extName = options.extanme || '.{js,ts}';
    glob.sync(require('path').join(folder, `./**/*${extName}`)).forEach(item => require(item));
    return router;
};
// 校验装饰器
export const validate = (obj: Rules) => {
    let validator = new schema(obj);
    return (target, property, descriptor) => {
        let oldValue = descriptor.value;
        descriptor.value = async function () {
            console.log('被调用了', arguments[0]);
            let message: String;
            try {
                await validator.validate(arguments[0]);
                return await oldValue.apply(target, arguments);
            } catch (e) {
                message = e.errors[0].message;
            }
            return {status: 400, message};
        };
    };
};
