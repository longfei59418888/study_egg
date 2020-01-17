/**
 * 事件模型
 * @author Xiaolong
 */
import { isEmptyObject } from '../extend';

class Event {
  constructor() {
    this.handlers = {};
  }

  on(type, handler, context) {
    const { __preBind } = this;
    __preBind(type, handler, context, false);
    return this;
  }

  once(type, handler, context) {
    const { __preBind } = this;
    __preBind(type, handler, context, true);
    return this;
  }

  trigger(type) {
    const { __preFire } = this;
    const args = [].slice.call(arguments, 1);
    __preFire(type, args);
    return this;
  }

  off(type) {
    const { __preFire } = this;
    __preFire(type);
    return this;
  }

  __preFire = (type, args = null) => {
    const { __fire, handlers } = this;
    type.split(/\s/).forEach((item) => {
      const typeName = item.split(/[.:]/);
      if (typeName[1]) {
        __fire(typeName[0], typeName[1], args, args === null);
      } else {
        Object.keys(handlers[type]).forEach((name) => {
          __fire(typeName[0], name, args, args === null);
        });
      }
    });
  }
  __fire = (type, name, args, state) => {
    const { handlers, __refresh } = this;
    if (!handlers[type] || !handlers[type][name]) return false;
    handlers[type][name].forEach((item) => {
      const { handler, context, one } = item;
      if (!state) handler.apply(context, args);
      if (one) item.end = true;
    });
    __refresh(type, name);
  }

  __refresh = (type, name) => {
    const { handlers } = this;
    const handler = handlers[type][name];
    handler.forEach((item, index) => {
      if (item.end) handler.splice(index, 1);
    });
    if (handler.length < 1) {
      delete handlers[type][name];
      if (isEmptyObject(handlers[type])) delete handlers[type];
    }
  }

  __preBind = (type, handler, context, state) => {
    const { __bind } = this;
    const name = type.trim().split(/\s/);
    name.forEach((item) => {
      const typeName = item.split(/[.:]/);
      __bind(typeName[0], typeName[1], handler, context, state);
    });
  }
  __bind = (type, name = '____defaults', handler, context = window, one = false) => {
    if (typeof handler !== 'function') {
      console.error(`type error: ${handler} not is a function_________`);
      return;
    }
    if (!this.handlers[type]) this.handlers[type] = {};
    if (!this.handlers[type][name]) this.handlers[type][name] = [];
    this.handlers[type][name].push({
      handler,
      context,
      one,
    });
  }
}


export default Event;
