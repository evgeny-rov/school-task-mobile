import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseAuthStore } from 'pocketbase';

export default class AsyncAuthStore extends BaseAuthStore {
  constructor(storageKey = 'pb_auth') {
    super();

    this.storageKey = storageKey;
    this.queue = [];

    this._enqueue(async () => {
      const raw = await AsyncStorage.getItem(this.storageKey);
      if (raw) {
        const decoded = JSON.parse(raw);
        this.save(decoded.token, decoded.model);
      }
    });
  }

  save(token, model) {
    super.save(token, model);

    this._enqueue(() => {
      return AsyncStorage.setItem(this.storageKey, JSON.stringify({ token, model }));
    });
  }

  clear() {
    super.clear();

    this._enqueue(() => {
      return AsyncStorage.removeItem(this.storageKey);
    });
  }

  _enqueue(asyncCallback) {
    this.queue.push(asyncCallback);

    if (this.queue.length == 1) {
      this._dequeue();
    }
  }

  _dequeue() {
    if (!this.queue.length) {
      return;
    }

    this.queue[0]().finally(() => {
      this.queue.shift();

      if (!this.queue.length) {
        return;
      }

      this._dequeue();
    });
  }
}
