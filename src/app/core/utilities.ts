import * as SecureStorage from 'secure-web-storage';
import * as CryptoJS from 'crypto-js';
import * as uuid from 'uuid';

var keySize = 256;
var ivSize = 128;
var iterations = 100;
const TCK = '';
var isencrypt = false;
export function UUID() {
  return uuid.v4();
}

var secureSessionStorage = new SecureStorage(sessionStorage, {
  hash: (key: any) => {
    return hash(key);
  },
  encrypt: (data: any) => {
    return encrypt(data);
  },
  decrypt: (data: any) => {
    return decrypt(data);
  },
});

export function encrypt(msg,tk=TCK) {
  let kc = hash(getSessionStorage(TCK)||tk);
  if (typeof msg === 'object') {
    msg = JSON.stringify(msg)
  }
  var salt = CryptoJS.lib.WordArray.random(ivSize / 8);
  var key = CryptoJS.PBKDF2('g_'+kc, salt, {
    keySize: keySize / 32,
    iterations: iterations
  });
  var iv = CryptoJS.lib.WordArray.random(ivSize / 8);
  var encrypted = CryptoJS.AES.encrypt(msg, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  });
  // salt, iv will be hex 32 in length
  // append them to the ciphertext for use  in decryption
  var transitmessage = salt.toString() + iv.toString() + encrypted.toString();
  return transitmessage;
}

export function decrypt(transitmessage,tk=TCK) {
  let kc = hash(getSessionStorage(TCK)||tk);
  var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
  var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
  var encrypted = transitmessage.substring(64);
  var key = CryptoJS.PBKDF2('g_'+kc, salt, {
    keySize: keySize / 32,
    iterations: iterations
  });
  var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  })
  let data = decrypted.toString(CryptoJS.enc.Utf8)
  return data;
}
export function hash(str) {
  if (typeof str === 'object') {
      str = JSON.stringify(str)
  }
  return CryptoJS.MD5('' + str).toString();
}

export function setSessionStorage(key: any, value: any, expires?: number) {
  key = hash(key);
  if (expires === undefined || expires === null) {
    //expires = (24 * 60 * 60);  // default: seconds for 1 day
    expires = 60 * 60 * 24;  // default: seconds for  1 day
  } else {
    expires = Math.abs(expires); //make sure it's positive
  }
  //var now = Date.now();  //millisecs since epoch time, lets deal only with integer
  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth();
  let day = today.getDate();
  let startDate = year + '-' + pad(month + 1) + '-' + pad(day);
  let now = new Date(startDate + ' 02:50:00').getTime();

  var schedule = now + expires * 1000;
  try {
    secureSessionStorage.setItem(key, value);
    secureSessionStorage.setItem(key + '_expiresIn', '' + schedule);
  } catch (e) {
    //this.logger.info('setStorage: Error setting key [' + key + '] in localStorage: ' + JSON.stringify(e));
    return false;
  }
  return true;
}

export function getSessionStorage(key: any): any {
  key = hash(key);
  var now = new Date().getTime();  //epoch time, lets deal only with integer
  // set expiration for storage
  try {
    var expiresIn = +(secureSessionStorage.getItem(key + '_expiresIn'));
    if (expiresIn === undefined || expiresIn === null) { expiresIn = 0; }
    if (expiresIn < now) {// Expired
      removeSessionStorage(key);
      return null;
    } else {
      try {
        var value = secureSessionStorage.getItem(key);
        return value
      } catch (error) {
        return null
      }

    }
  }
  catch (e) {
    return null
  }
}

export function removeSessionStorage(name: any) {
  name = hash(name);
  try {
    secureSessionStorage.removeItem(name);
    secureSessionStorage.removeItem(name + '_expiresIn');
  } catch (e) {
    return false;
  }
  return true;
}

export function clearSessionStorage() {
  secureSessionStorage.clear();
}

export function pad(n: any, len = 2) {
  let l = Math.floor(len);
  let sn = '' + n;
  let snl = sn.length;
  if (snl >= l) return sn;
  return '0'.repeat(l - snl) + sn;
}