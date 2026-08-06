/**
 * ตัวช่วยเรียก Google Apps Script Web App API
 * ใช้ Content-Type: text/plain เพื่อเลี่ยง CORS preflight (Apps Script ตอบ preflight ไม่ได้)
 */
(function (global) {
  function apiUrl() {
    return window.WEDDING_CONFIG && window.WEDDING_CONFIG.API_URL;
  }

  function isConfigured() {
    var u = apiUrl();
    return u && u.indexOf('PASTE_YOUR') === -1;
  }

  function get(action, params) {
    params = params || {};
    if (!isConfigured()) {
      return Promise.reject(new Error('API_NOT_CONFIGURED'));
    }
    var qs = Object.keys(params).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    }).join('&');
    var url = apiUrl() + '?action=' + encodeURIComponent(action) + (qs ? '&' + qs : '');
    return fetch(url).then(function (r) { return r.json(); });
  }

  function post(action, data) {
    data = data || {};
    if (!isConfigured()) {
      return Promise.reject(new Error('API_NOT_CONFIGURED'));
    }
    var payload = Object.assign({ action: action }, data);
    return fetch(apiUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    }).then(function (r) { return r.json(); });
  }

  global.WeddingAPI = { get: get, post: post, isConfigured: isConfigured };
})(window);
