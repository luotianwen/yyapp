/**
 * Created by shen on 2017/3/6.
 * 本地缓存，通过公钥和私钥进行加密和解密
 */
import {md5} from 'vux'
export function getStorage(key) {
  var publicString = "-----BEGIN PUBLIC KEY-----\n" +
    'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAIWv2HL3BK1m13RG7GU2hw3DKCr/gbC+\n' +
    'Z1ignI7KEGeoMGMh/gThyN3mwH09YZq+6kxS7yC5C8ejCaw1U6/+3sMCAwEAAQ==\n' +
    '-----END PUBLIC KEY-----';
  var NodeRSA = require('node-rsa');
  var rsaKey = new NodeRSA();
  rsaKey.importKey(publicString, 'pkcs8-public');
  key=md5(key);
  let value =localStorage.getItem(key);

  if(value) {
    value = rsaKey.decryptPublic(value,'utf8');
    value = JSON.parse(value);
    return value;
  }
  else
  {
    return null;
  }
}
export function setStorage(key,value) {
  var NodeRSA = require('node-rsa');
  var keyString = "-----BEGIN PRIVATE KEY----- \
MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAha/YcvcErWbXdEbs \
ZTaHDcMoKv+BsL5nWKCcjsoQZ6gwYyH+BOHI3ebAfT1hmr7qTFLvILkLx6MJrDVT \
r/7ewwIDAQABAkAsKtCECwBMmbGNBPGM7trnvRZEPm4GiqFyMn4G3tNUq0ikpVDh \
0F5zzZ9nGEocwxPpYlj7cdnzBubElv4sLW6hAiEA+dW530+qNOaoEnj8QzDrfnGt \
VpV1ZTiGyJZRp7cXIX8CIQCI/GGrgtWtXENS67ZwmN5ux+RTkZ2KB9c7Ulti6d7c \
vQIhAKtNKE09ym7LWKKR4iYP/OiN+VRM1lm5EHGo4AQnPezxAiBVJhQMCVKK5RvQ \
EkagLNWupL/vlkcHwqHt9N5rWJY4PQIgMud8O5sgn78G74g9kqgChYnp9gurQwbS \
f0gXJ1B92uQ= \
-----END PRIVATE KEY-----";
  var rsaKey = new NodeRSA(keyString);
  key=md5(key);
  localStorage.setItem(key,rsaKey.encryptPrivate(JSON.stringify(value),'base64'));
}
export function removeStorage(key) {
  localStorage.removeItem(md5(key));
}
export function clearStorage() {
  window.localStorage.clear();
}




export default {
  install (Vue) {
    Vue.prototype.$getStorage = getStorage
    Vue.prototype.$setStorage = setStorage
    Vue.prototype.$removeStorage = removeStorage
    Vue.prototype.$clearStorage = clearStorage
  },
  $getStorage: getStorage,
  $setStorage:setStorage,
  $removeStorage:removeStorage,
  $clearStorage:clearStorage,
}

export const $getStorage = getStorage
export const $setStorage = setStorage
export const $removeStorage = removeStorage
export const $clearStorage = clearStorage
