import PocketBase from 'pocketbase';
import AsyncAuthStore from './async_auth_store';

export const pb = new PocketBase('https://cool-petabyte.pockethost.io', new AsyncAuthStore());
