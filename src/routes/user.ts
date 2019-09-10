import * as Koa from 'koa';
import {get, post, validate} from '../utils/route-decorators';

let users = [{name: 'zhangsan', age: 12}, {name: 'lisi', age: 12}];

export default class User {
    @get('/users')
    public list() {
        return {status: 200, data: users};
    }

    @post('/users')
    @validate({age: {type: 'number', max: 20, message: '年龄不符合要求'}})
    public add(obj) {
        users.push(obj);
        return {status: 200};
    }
}

