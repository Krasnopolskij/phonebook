/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/charenc/charenc.js":
/*!*****************************************!*\
  !*** ./node_modules/charenc/charenc.js ***!
  \*****************************************/
/***/ ((module) => {

eval("var charenc = {\n  // UTF-8 encoding\n  utf8: {\n    // Convert a string to a byte array\n    stringToBytes: function (str) {\n      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));\n    },\n    // Convert a byte array to a string\n    bytesToString: function (bytes) {\n      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));\n    }\n  },\n  // Binary encoding\n  bin: {\n    // Convert a string to a byte array\n    stringToBytes: function (str) {\n      for (var bytes = [], i = 0; i < str.length; i++) bytes.push(str.charCodeAt(i) & 0xFF);\n      return bytes;\n    },\n    // Convert a byte array to a string\n    bytesToString: function (bytes) {\n      for (var str = [], i = 0; i < bytes.length; i++) str.push(String.fromCharCode(bytes[i]));\n      return str.join('');\n    }\n  }\n};\nmodule.exports = charenc;\n\n//# sourceURL=webpack://phonebook/./node_modules/charenc/charenc.js?");

/***/ }),

/***/ "./node_modules/crypt/crypt.js":
/*!*************************************!*\
  !*** ./node_modules/crypt/crypt.js ***!
  \*************************************/
/***/ ((module) => {

eval("(function () {\n  var base64map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',\n    crypt = {\n      // Bit-wise rotation left\n      rotl: function (n, b) {\n        return n << b | n >>> 32 - b;\n      },\n      // Bit-wise rotation right\n      rotr: function (n, b) {\n        return n << 32 - b | n >>> b;\n      },\n      // Swap big-endian to little-endian and vice versa\n      endian: function (n) {\n        // If number given, swap endian\n        if (n.constructor == Number) {\n          return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;\n        }\n\n        // Else, assume array and swap all items\n        for (var i = 0; i < n.length; i++) n[i] = crypt.endian(n[i]);\n        return n;\n      },\n      // Generate an array of any length of random bytes\n      randomBytes: function (n) {\n        for (var bytes = []; n > 0; n--) bytes.push(Math.floor(Math.random() * 256));\n        return bytes;\n      },\n      // Convert a byte array to big-endian 32-bit words\n      bytesToWords: function (bytes) {\n        for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8) words[b >>> 5] |= bytes[i] << 24 - b % 32;\n        return words;\n      },\n      // Convert big-endian 32-bit words to a byte array\n      wordsToBytes: function (words) {\n        for (var bytes = [], b = 0; b < words.length * 32; b += 8) bytes.push(words[b >>> 5] >>> 24 - b % 32 & 0xFF);\n        return bytes;\n      },\n      // Convert a byte array to a hex string\n      bytesToHex: function (bytes) {\n        for (var hex = [], i = 0; i < bytes.length; i++) {\n          hex.push((bytes[i] >>> 4).toString(16));\n          hex.push((bytes[i] & 0xF).toString(16));\n        }\n        return hex.join('');\n      },\n      // Convert a hex string to a byte array\n      hexToBytes: function (hex) {\n        for (var bytes = [], c = 0; c < hex.length; c += 2) bytes.push(parseInt(hex.substr(c, 2), 16));\n        return bytes;\n      },\n      // Convert a byte array to a base-64 string\n      bytesToBase64: function (bytes) {\n        for (var base64 = [], i = 0; i < bytes.length; i += 3) {\n          var triplet = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];\n          for (var j = 0; j < 4; j++) if (i * 8 + j * 6 <= bytes.length * 8) base64.push(base64map.charAt(triplet >>> 6 * (3 - j) & 0x3F));else base64.push('=');\n        }\n        return base64.join('');\n      },\n      // Convert a base-64 string to a byte array\n      base64ToBytes: function (base64) {\n        // Remove non-base-64 characters\n        base64 = base64.replace(/[^A-Z0-9+\\/]/ig, '');\n        for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {\n          if (imod4 == 0) continue;\n          bytes.push((base64map.indexOf(base64.charAt(i - 1)) & Math.pow(2, -2 * imod4 + 8) - 1) << imod4 * 2 | base64map.indexOf(base64.charAt(i)) >>> 6 - imod4 * 2);\n        }\n        return bytes;\n      }\n    };\n  module.exports = crypt;\n})();\n\n//# sourceURL=webpack://phonebook/./node_modules/crypt/crypt.js?");

/***/ }),

/***/ "./node_modules/is-buffer/index.js":
/*!*****************************************!*\
  !*** ./node_modules/is-buffer/index.js ***!
  \*****************************************/
/***/ ((module) => {

eval("/*!\n * Determine if an object is a Buffer\n *\n * @author   Feross Aboukhadijeh <https://feross.org>\n * @license  MIT\n */\n\n// The _isBuffer check is for Safari 5-7 support, because it's missing\n// Object.prototype.constructor. Remove this eventually\nmodule.exports = function (obj) {\n  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);\n};\nfunction isBuffer(obj) {\n  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj);\n}\n\n// For Node v0.10 support. Remove this eventually.\nfunction isSlowBuffer(obj) {\n  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0));\n}\n\n//# sourceURL=webpack://phonebook/./node_modules/is-buffer/index.js?");

/***/ }),

/***/ "./node_modules/md5/md5.js":
/*!*********************************!*\
  !*** ./node_modules/md5/md5.js ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("(function () {\n  var crypt = __webpack_require__(/*! crypt */ \"./node_modules/crypt/crypt.js\"),\n    utf8 = (__webpack_require__(/*! charenc */ \"./node_modules/charenc/charenc.js\").utf8),\n    isBuffer = __webpack_require__(/*! is-buffer */ \"./node_modules/is-buffer/index.js\"),\n    bin = (__webpack_require__(/*! charenc */ \"./node_modules/charenc/charenc.js\").bin),\n    // The core\n    md5 = function (message, options) {\n      // Convert to byte array\n      if (message.constructor == String) {\n        if (options && options.encoding === 'binary') message = bin.stringToBytes(message);else message = utf8.stringToBytes(message);\n      } else if (isBuffer(message)) message = Array.prototype.slice.call(message, 0);else if (!Array.isArray(message) && message.constructor !== Uint8Array) message = message.toString();\n      // else, assume byte array already\n\n      var m = crypt.bytesToWords(message),\n        l = message.length * 8,\n        a = 1732584193,\n        b = -271733879,\n        c = -1732584194,\n        d = 271733878;\n\n      // Swap endian\n      for (var i = 0; i < m.length; i++) {\n        m[i] = (m[i] << 8 | m[i] >>> 24) & 0x00FF00FF | (m[i] << 24 | m[i] >>> 8) & 0xFF00FF00;\n      }\n\n      // Padding\n      m[l >>> 5] |= 0x80 << l % 32;\n      m[(l + 64 >>> 9 << 4) + 14] = l;\n\n      // Method shortcuts\n      var FF = md5._ff,\n        GG = md5._gg,\n        HH = md5._hh,\n        II = md5._ii;\n      for (var i = 0; i < m.length; i += 16) {\n        var aa = a,\n          bb = b,\n          cc = c,\n          dd = d;\n        a = FF(a, b, c, d, m[i + 0], 7, -680876936);\n        d = FF(d, a, b, c, m[i + 1], 12, -389564586);\n        c = FF(c, d, a, b, m[i + 2], 17, 606105819);\n        b = FF(b, c, d, a, m[i + 3], 22, -1044525330);\n        a = FF(a, b, c, d, m[i + 4], 7, -176418897);\n        d = FF(d, a, b, c, m[i + 5], 12, 1200080426);\n        c = FF(c, d, a, b, m[i + 6], 17, -1473231341);\n        b = FF(b, c, d, a, m[i + 7], 22, -45705983);\n        a = FF(a, b, c, d, m[i + 8], 7, 1770035416);\n        d = FF(d, a, b, c, m[i + 9], 12, -1958414417);\n        c = FF(c, d, a, b, m[i + 10], 17, -42063);\n        b = FF(b, c, d, a, m[i + 11], 22, -1990404162);\n        a = FF(a, b, c, d, m[i + 12], 7, 1804603682);\n        d = FF(d, a, b, c, m[i + 13], 12, -40341101);\n        c = FF(c, d, a, b, m[i + 14], 17, -1502002290);\n        b = FF(b, c, d, a, m[i + 15], 22, 1236535329);\n        a = GG(a, b, c, d, m[i + 1], 5, -165796510);\n        d = GG(d, a, b, c, m[i + 6], 9, -1069501632);\n        c = GG(c, d, a, b, m[i + 11], 14, 643717713);\n        b = GG(b, c, d, a, m[i + 0], 20, -373897302);\n        a = GG(a, b, c, d, m[i + 5], 5, -701558691);\n        d = GG(d, a, b, c, m[i + 10], 9, 38016083);\n        c = GG(c, d, a, b, m[i + 15], 14, -660478335);\n        b = GG(b, c, d, a, m[i + 4], 20, -405537848);\n        a = GG(a, b, c, d, m[i + 9], 5, 568446438);\n        d = GG(d, a, b, c, m[i + 14], 9, -1019803690);\n        c = GG(c, d, a, b, m[i + 3], 14, -187363961);\n        b = GG(b, c, d, a, m[i + 8], 20, 1163531501);\n        a = GG(a, b, c, d, m[i + 13], 5, -1444681467);\n        d = GG(d, a, b, c, m[i + 2], 9, -51403784);\n        c = GG(c, d, a, b, m[i + 7], 14, 1735328473);\n        b = GG(b, c, d, a, m[i + 12], 20, -1926607734);\n        a = HH(a, b, c, d, m[i + 5], 4, -378558);\n        d = HH(d, a, b, c, m[i + 8], 11, -2022574463);\n        c = HH(c, d, a, b, m[i + 11], 16, 1839030562);\n        b = HH(b, c, d, a, m[i + 14], 23, -35309556);\n        a = HH(a, b, c, d, m[i + 1], 4, -1530992060);\n        d = HH(d, a, b, c, m[i + 4], 11, 1272893353);\n        c = HH(c, d, a, b, m[i + 7], 16, -155497632);\n        b = HH(b, c, d, a, m[i + 10], 23, -1094730640);\n        a = HH(a, b, c, d, m[i + 13], 4, 681279174);\n        d = HH(d, a, b, c, m[i + 0], 11, -358537222);\n        c = HH(c, d, a, b, m[i + 3], 16, -722521979);\n        b = HH(b, c, d, a, m[i + 6], 23, 76029189);\n        a = HH(a, b, c, d, m[i + 9], 4, -640364487);\n        d = HH(d, a, b, c, m[i + 12], 11, -421815835);\n        c = HH(c, d, a, b, m[i + 15], 16, 530742520);\n        b = HH(b, c, d, a, m[i + 2], 23, -995338651);\n        a = II(a, b, c, d, m[i + 0], 6, -198630844);\n        d = II(d, a, b, c, m[i + 7], 10, 1126891415);\n        c = II(c, d, a, b, m[i + 14], 15, -1416354905);\n        b = II(b, c, d, a, m[i + 5], 21, -57434055);\n        a = II(a, b, c, d, m[i + 12], 6, 1700485571);\n        d = II(d, a, b, c, m[i + 3], 10, -1894986606);\n        c = II(c, d, a, b, m[i + 10], 15, -1051523);\n        b = II(b, c, d, a, m[i + 1], 21, -2054922799);\n        a = II(a, b, c, d, m[i + 8], 6, 1873313359);\n        d = II(d, a, b, c, m[i + 15], 10, -30611744);\n        c = II(c, d, a, b, m[i + 6], 15, -1560198380);\n        b = II(b, c, d, a, m[i + 13], 21, 1309151649);\n        a = II(a, b, c, d, m[i + 4], 6, -145523070);\n        d = II(d, a, b, c, m[i + 11], 10, -1120210379);\n        c = II(c, d, a, b, m[i + 2], 15, 718787259);\n        b = II(b, c, d, a, m[i + 9], 21, -343485551);\n        a = a + aa >>> 0;\n        b = b + bb >>> 0;\n        c = c + cc >>> 0;\n        d = d + dd >>> 0;\n      }\n      return crypt.endian([a, b, c, d]);\n    };\n\n  // Auxiliary functions\n  md5._ff = function (a, b, c, d, x, s, t) {\n    var n = a + (b & c | ~b & d) + (x >>> 0) + t;\n    return (n << s | n >>> 32 - s) + b;\n  };\n  md5._gg = function (a, b, c, d, x, s, t) {\n    var n = a + (b & d | c & ~d) + (x >>> 0) + t;\n    return (n << s | n >>> 32 - s) + b;\n  };\n  md5._hh = function (a, b, c, d, x, s, t) {\n    var n = a + (b ^ c ^ d) + (x >>> 0) + t;\n    return (n << s | n >>> 32 - s) + b;\n  };\n  md5._ii = function (a, b, c, d, x, s, t) {\n    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;\n    return (n << s | n >>> 32 - s) + b;\n  };\n\n  // Package private blocksize\n  md5._blocksize = 16;\n  md5._digestsize = 16;\n  module.exports = function (message, options) {\n    if (message === undefined || message === null) throw new Error('Illegal argument ' + message);\n    var digestbytes = crypt.wordsToBytes(md5(message, options));\n    return options && options.asBytes ? digestbytes : options && options.asString ? bin.bytesToString(digestbytes) : crypt.bytesToHex(digestbytes);\n  };\n})();\n\n//# sourceURL=webpack://phonebook/./node_modules/md5/md5.js?");

/***/ }),

/***/ "./public/scripts/index.js":
/*!*********************************!*\
  !*** ./public/scripts/index.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const md5 = __webpack_require__(/*! md5 */ \"./node_modules/md5/md5.js\");\nconst form = document.getElementById('login-form');\nconst button = document.getElementById('button');\n\n// начинаем прослушивать событие отправки данных из формы\nform.addEventListener('submit', async event => {\n  //прерываем автоматическую передачу данных из формы и блокируем кнопку\n  event.preventDefault();\n  button.disabled = true;\n  document.getElementById('warning').innerHTML = 'Авторизация...';\n  const dataJson = serializeForm(event.target);\n  const hashJSON = hashData(dataJson);\n\n  //отправка данных\n  const response = await sendData(hashJSON);\n  response.json().then(data => inputResult(data));\n});\n\n// функция отправляет данные в виде json с помощью post\nasync function sendData(data) {\n  return await fetch('/login', {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json'\n    },\n    body: data\n  });\n}\n\n// из формы достаются данные и преобразуются в json для отправки\nfunction serializeForm(form) {\n  const {\n    elements\n  } = form;\n  const array = Array.from(elements);\n  return JSON.stringify({\n    login: array[0].value,\n    password: array[1].value\n  });\n}\n\n// функция хеширования\nfunction hashData(dataJSON) {\n  let parseData = JSON.parse(dataJSON);\n  const hash = md5(parseData.password);\n  parseData.password = hash;\n  return JSON.stringify(parseData);\n}\n\n// обработка ответа от сервера\nfunction inputResult(responseFromServer) {\n  console.log(responseFromServer); // для отладки\n  if (responseFromServer.message === 'success_auth') {\n    document.getElementById('warning').innerHTML = ' ';\n    window.location.pathname = '/home';\n  } else if (responseFromServer.message === 'wrong_password') {\n    document.getElementById('warning').innerHTML = 'Неверный пароль';\n  } else {\n    document.getElementById('warning').innerHTML = 'Пользователя не существует';\n  }\n  button.disabled = false;\n}\n\n//# sourceURL=webpack://phonebook/./public/scripts/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./public/scripts/index.js");
/******/ 	
/******/ })()
;