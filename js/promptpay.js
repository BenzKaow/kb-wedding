/**
 * PromptPay QR payload generator
 * อิงตามมาตรฐาน EMV QR Code สำหรับ Thai QR Payment (PromptPay)
 * รองรับ: เบอร์มือถือ (10 หลัก) และเลขบัตรประชาชน (13 หลัก)
 */
(function (global) {
  function serialize(id, value) {
    var length = ('00' + value.length).slice(-2);
    return id + length + value;
  }

  function crc16(str) {
    var crc = 0xffff;
    for (var i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (var j = 0; j < 8; j++) {
        crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
      }
      crc &= 0xffff;
    }
    var hex = crc.toString(16).toUpperCase();
    return ('0000' + hex).slice(-4);
  }

  function formatTarget(target) {
    target = String(target).replace(/[^0-9]/g, '');
    var type;
    if (target.length === 13) {
      type = '02'; // เลขบัตรประชาชน / เลขทะเบียนนิติบุคคล
    } else {
      type = '01'; // เบอร์มือถือ
      target = target.replace(/^0/, '66');
      target = ('0000000000000' + target).slice(-13);
    }
    return { type: type, value: target };
  }

  function generatePayload(target, amount) {
    var t = formatTarget(target);

    var merchantInfo =
      serialize('00', 'A000000677010111') +
      serialize(t.type, t.value);

    var parts =
      serialize('00', '01') +
      serialize('01', amount ? '12' : '11') +
      serialize('29', merchantInfo);

    if (amount) {
      parts += serialize('54', Number(amount).toFixed(2));
    }
    parts += serialize('58', 'TH') + serialize('53', '764');

    var withCrcPlaceholder = parts + '6304';
    var crc = crc16(withCrcPlaceholder);
    return withCrcPlaceholder + crc;
  }

  global.PromptPay = { generatePayload: generatePayload };
})(window);
