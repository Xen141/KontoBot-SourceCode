var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/lib/AsyncQueueEntry.ts
var AsyncQueueEntry = class {
  constructor(queue) {
    __publicField(this, "promise");
    __publicField(this, "resolve");
    __publicField(this, "reject");
    __publicField(this, "queue");
    __publicField(this, "signal", null);
    __publicField(this, "signalListener", null);
    this.queue = queue;
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
  setSignal(signal) {
    if (signal.aborted)
      return this;
    this.signal = signal;
    this.signalListener = () => {
      const index = this.queue["promises"].indexOf(this);
      if (index !== -1)
        this.queue["promises"].splice(index, 1);
      this.reject(new Error("Request aborted manually"));
    };
    this.signal.addEventListener("abort", this.signalListener);
    return this;
  }
  use() {
    this.dispose();
    this.resolve();
    return this;
  }
  abort() {
    this.dispose();
    this.reject(new Error("Request aborted manually"));
    return this;
  }
  dispose() {
    if (this.signal) {
      this.signal.removeEventListener("abort", this.signalListener);
      this.signal = null;
      this.signalListener = null;
    }
  }
};
__name(AsyncQueueEntry, "AsyncQueueEntry");

// src/lib/AsyncQueue.ts
var AsyncQueue = class {
  constructor() {
    __publicField(this, "promises", []);
  }
  get remaining() {
    return this.promises.length;
  }
  get queued() {
    return this.remaining === 0 ? 0 : this.remaining - 1;
  }
  wait(options) {
    const entry = new AsyncQueueEntry(this);
    if (this.promises.length === 0) {
      this.promises.push(entry);
      return Promise.resolve();
    }
    this.promises.push(entry);
    if (options?.signal)
      entry.setSignal(options.signal);
    return entry.promise;
  }
  shift() {
    if (this.promises.length === 0)
      return;
    if (this.promises.length === 1) {
      this.promises.shift();
      return;
    }
    this.promises.shift();
    this.promises[0].use();
  }
  abortAll() {
    if (this.queued === 0)
      return;
    for (let i = 1; i < this.promises.length; ++i) {
      this.promises[i].abort();
    }
    this.promises.length = 1;
  }
};
__name(AsyncQueue, "AsyncQueue");
export {
  AsyncQueue
};
//# sourceMappingURL=index.mjs.map