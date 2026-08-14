import '@testing-library/jest-dom';

process.env.JWT_SECRET = 'test-secret-123';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';

if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

if (typeof global.Headers === 'undefined' || !global.Headers.prototype.get) {
  global.Headers = class Headers {
    constructor(init = {}) {
      this.map = new Map();
      if (init) {
        if (typeof init.entries === 'function') {
          for (const [k, v] of init.entries()) {
            this.map.set(k.toLowerCase(), v);
          }
        } else {
          Object.entries(init).forEach(([k, v]) => this.map.set(k.toLowerCase(), String(v)));
        }
      }
    }
    get(name) {
      return this.map.get(name.toLowerCase()) || null;
    }
    set(name, value) {
      this.map.set(name.toLowerCase(), String(value));
    }
  };
}

if (typeof global.Request === 'undefined' || !global.Request.prototype.json) {
  global.Request = class Request {
    constructor(input, options = {}) {
      this.url = typeof input === 'string' ? input : input.url;
      this.method = options.method || 'GET';
      this.headers = new global.Headers(options.headers || {});
      this.body = options.body || null;
    }
    async json() {
      if (typeof this.body === 'string') {
        return JSON.parse(this.body);
      }
      return this.body || {};
    }
    async text() {
      if (typeof this.body === 'string') {
        return this.body;
      }
      return JSON.stringify(this.body || {});
    }
  };
}

if (typeof global.Response === 'undefined' || !global.Response.json) {
  global.Response = class Response {
    constructor(body, options = {}) {
      this._body = body;
      this.status = options.status || 200;
      this.headers = new global.Headers(options.headers || {});
    }
    static json(data, options = {}) {
      return new Response(JSON.stringify(data), {
        ...options,
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      });
    }
    async json() {
      if (typeof this._body === 'string') {
        return JSON.parse(this._body);
      }
      return this._body || {};
    }
    async text() {
      if (typeof this._body === 'string') {
        return this._body;
      }
      return JSON.stringify(this._body || {});
    }
  };
}
