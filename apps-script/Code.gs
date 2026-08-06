/**
 * ============================================================
 *  เว็บงานแต่ง เก้า & เบ๊นซ์  —  Backend (Google Apps Script)
 * ============================================================
 *  วิธีใช้:
 *  1) เปิด Google Sheet ว่างๆ ขึ้นมา 1 ไฟล์
 *  2) เมนู Extensions > Apps Script
 *  3) ลบโค้ดเดิมทั้งหมด แล้ววางไฟล์นี้ทั้งไฟล์ลงไปแทน
 *  4) เลือกฟังก์ชัน "setup" ที่แถบด้านบน แล้วกด Run (▶) ครั้งเดียว
 *     - ครั้งแรกจะมี popup ขอสิทธิ์ ให้กด Allow ทั้งหมด
 *  5) Deploy > New deployment > Web app
 *     - Execute as: Me
 *     - Who has access: Anyone
 *     - กด Deploy แล้วคัดลอก "Web app URL" ไปใส่ใน js/config.js (API_URL)
 *  ดูรายละเอียดเต็มใน DEPLOY_GUIDE.md
 * ============================================================
 */

// ---------- ตั้งค่าเริ่มต้น (แก้ได้ภายหลังใน Script Properties) ----------
var DEFAULT_ADMIN_USER = 'benzkaow';
var DEFAULT_ADMIN_PASS = 'Benz@05112011';
var DEFAULT_BUDGET = 0;
var SESSION_HOURS = 6; // อายุ session ของ admin หลัง login (ชั่วโมง)

var SHEET_GUESTS = 'Guests';
var SHEET_EXPENSES = 'Expenses';
var SHEET_GALLERY = 'Gallery';
var SHEET_CONFIG = 'Config';

// รายชื่อแขกที่ import มาจากไฟล์ Excel ของพี่เบ๊นซ์ (165 คน)
// รูปแบบ: [ชื่อ, นามสกุล, ตำแหน่ง/หมายเหตุ]
var GUEST_SEED = [["ราตรี", "ศิริสมบูรณ์", "หัวหน้าหอผู้ป่วย 100 ปี พระศรีนครินทร์ 4 สามัญ"], ["จารุณี", "ลี้ธีระกุล", ""], ["รัชดา", "จิรประเสริฐวงศ์", ""], ["ศิริลักษณ์", "หรสิทธิ์", ""], ["อรวรรณ", "โพธิสุข", ""], ["อรุณี", "พึ่งแพง", ""], ["หทัยรัตน์", "คงแสง", ""], ["จีระภา", "พวงมาลัย", ""], ["จิตติยาพร", "ยางน้อย", ""], ["อมรรัตน์", "อนันโท", ""], ["อนิสา", "เพ็ชรเศษ", ""], ["กมลรัตน์", "สงนอก", ""], ["ประภาพรรณ", "สุบรรณพันธ์", ""], ["สุภลักษณ์", "แหวนวิเศษ", ""], ["กนกวรรณ", "หาวิถี", ""], ["ประภัสสร", "ตันติภิรมย์", ""], ["นัฏสิมา", "ชาวไทย", ""], ["จุฑามาศ", "ปัญโญ", ""], ["กฤติยา", "ศัยศักดิ์พงษ์", ""], ["ปภาวิน", "กิจประเสริฐ", ""], ["ปรียาภรณ์", "สุขแสน", ""], ["กนกวรรณ", "ฤดีกมล", ""], ["มัณฑนา", "จิตรจรัส", ""], ["ลำเทียน", "กล้าหาญ", ""], ["บุญเหลือ", "เอี่ยมโฉม", ""], ["กาญจนา", "ค่าไทยสง", ""], ["นวรัตน์", "เขียวหวาน", ""], ["วันทนา", "จรรย์สืบศรี", ""], ["อินทร์มณี", "เสาแก้ว", ""], ["สริตา", "ศรีประการ", ""], ["สุกัญญา", "สุริยจันทร์", ""], ["วาสนา", "ทุมมา", ""], ["เสาวนีย์", "ทองศรี", ""], ["อัญชนา", "มากเตี้ยม", ""], ["ดรุณี", "คำนนท์", ""], ["ปัญจาทีนี", "กลิ่นจำปา", ""], ["ไพรผกา", "นามนัย", ""], ["อุไรวรรณ", "บุญจันทร์", ""], ["ภัทรวดี", "ดวงประทุม", ""], ["จารุณิชา", "ตาทฤศโธรัยห์", ""], ["วาสนา", "วงเดือน", ""], ["พีรพรรณ", "ลิขิตตระกูล", ""], ["คณพร", "ทองใบใหญ่", ""], ["อาภรณ์", "แสงสุดใจ", ""], ["มยุรี", "หอมชื่น", ""], ["จรรยา", "แสนสุข", ""], ["นวภัทร", "สุขสวัสดิ์", ""], ["สุกัณญา", "ราชสิงโห", ""], ["ชุติมา", "ราชสิงโห", ""], ["ป้าภา", "", ""], ["ป้าวิชง", "", ""], ["ป้าสมใจ", "", ""], ["กัญจน์พรรณ", "นิ่มนวล", ""], ["กาญจนา", "พิมล", "หัวหน้าหอผู้ป่วย 100 ปี พระศรีนครินทร์ 8/2"], ["อาภร", "มั่งคั่ง", ""], ["ปฐมาภรณ์", "เตียงลัดดาวงศ์", "หัวหน้าหอผู้ป่วย 100 ปี พระศรีนครินทร์ 4/2"], ["วรินทร์ภรณ์", "แก้วประดิษฐ์", ""], ["งานการพยาบาลสูติศาสตร์-นรีเวชวิทยา", "", ""], ["ลาวัลย์", "การะวี", ""], ["วันทนา", "พิมพ์งาม", ""], ["วชิราภรณ์", "มั่งคั่ง", ""], ["วันดี", "สมัครการนา", ""], ["อารีย์", "ไกลถื่น", ""], ["สุกัญญา", "จันทรางกูล", ""], ["พรพิมล", "ศิริรักษ์", ""], ["อัครวัฒน์", "ฉันทแดนสุวรรณ และ ครอบครัว", "ผู้บริหารบริษัท ริชเชส ซัพพลาย จำกัด(มหาชน)"], ["อานนท์", "นาคทรานันท์", "Director of Operations"], ["น้องเอ็ม", "", ""], ["น้องเมย์", "", ""], ["น้องมอส", "", ""], ["น้องมาร์ค", "", ""], ["พี่นก", "", ""], ["พี่อ้อ", "", ""], ["พี่ใหญ่", "", ""], ["พี่โจ้", "", ""], ["เพื่อนฮูก", "", ""], ["เพื่อนเอก", "", ""], ["เพื่อนแล - พี่นุ้ย", "", ""], ["เพื่อนเบียร์", "", ""], ["เพื่อนไอซ์", "", ""], ["เพื่อนฮั้น - น้องหมิว", "", ""], ["พี่ตี่ - นุ้ย หลานนับตังค์", "", ""], ["แบงค์ - ส้ม หลานแบม", "", ""], ["น้องมิ้ว - น้องไอซ์", "", ""], ["ตี๋ - มิน", "", ""], ["แก๊ป - แนน", "", ""], ["พี่เจ - พี่หมู", "", ""], ["พี่รัน - พี่วรรณ", "", ""], ["พี่นคร - พี่จ๊ะโอ๋", "", ""], ["พี่แดง - พี่แจ๋ว", "", ""], ["เพื่อนโป่งโป๊ง-อิ้งค์", "", ""], ["เพื่อนตุ๊กตาและครอบครัว", "", ""], ["เพื่อนมิน", "", ""], ["พี่บอล-พี่อร", "", ""], ["ลุงพงษ์ - ป้าเปรี้ยว น้องภูมิ", "", ""], ["พีท - อาย", "", ""], ["น้าเจตน์ - น้าพร และน้อง ๆ", "", ""], ["ป้ามุก พี่มัส และครอบครัว", "", ""], ["ลุงเสน่ห์ พี่นุ และครอบครัว", "", ""], ["ลุงใหญ่ - ป้าเดียร์", "", ""], ["พี่จอยและครอบครัว", "", ""], ["ลุงปรีชา พี่นันและครอบครัว", "", ""], ["พี่หนูเล็ก และครอบครัว", "", ""], ["พี่หนุ่ม และ น้องฟ้า", "", ""], ["แม่สดใส พี่แนน - พี่ตั้ม", "", ""], ["ค็อปเตอร์ -น้องอ้อน - น้องกัปตัน", "", ""], ["น้องฮัท - น้องนุ๊ก", "", ""], ["เพื่อนมิ้น", "(BBC)", ""], ["เพื่อนนุ้ย", "(BBC)", ""], ["เพื่อนแพทตี้และครอบครัว", "(BBC)", ""], ["เพื่อนอ้อยใจ", "", ""], ["เพื่อนนุ", "", ""], ["เพื่อนมิ้งค์(กูกินคนเดียว)", "", ""], ["เพื่อนหงษ์", "", ""], ["เพื่อนเชอรี่", "", ""], ["พี่แบงค์และครอบครัว", "", ""], ["แม่เล็ก - ลุงอ๊อด", "", ""], ["พี่มิ่ว - พี่ทิพย์", "", ""], ["พี่ซิส", "", ""], ["เพื่อนเจมส์", "", ""], ["พี่ดู่", "", ""], ["พี่หน่อง", "", ""], ["พี่บอลและครอบครัว", "", ""], ["พี่โส", "", ""], ["พี่ไกด์", "", ""], ["พี่เอกและครอบครัว", "", ""], ["พี่ท็อปและครอบครัว", "", ""], ["พี่พิ", "", ""], ["พี่ต้น", "", ""], ["พี่ฝุ่น", "", ""], ["พี่ไก่", "", ""], ["อ๊อฟ", "", ""], ["ต้น-เฟริน์", "", ""], ["คิม", "", ""], ["อาหนุ่ย - อาแป๋ว", "", ""], ["อาเล็ก - พี่รุ่ง - ต้นข้าว", "", ""], ["น้องทราย", "", ""], ["ลุงป๋อย - ป้าแจง", "", ""], ["ลุงหมึก", "", ""], ["ป้าป้อม", "", ""], ["พี่เอก-แต้ว", "", ""], ["น้องฟ้า - น้องฟาง", "", ""], ["พี่ดิวและครอบครัว", "", ""], ["น้องมิ้น", "", ""], ["พี่หมวย", "(Siriraj)", ""], ["พี่ฝน", "(Siriraj)", ""], ["เค้ก - คุณโต้ง", "", ""], ["ป้ามร - ลุงโรจน์", "", ""], ["น้าน้อย - น้าดุ่ย", "", ""], ["น้าอึ่ง - น้าหนุ่ย", "", ""], ["ป้าน้อย - ลุงจง", "", ""], ["ลุงธรรม - ป้าดวง", "", ""], ["พี่ตั้ม - พี่กิ๊กและหลานๆ", "", ""], ["พี่หมู - พี่ปีใหม่ - น้องการ์ตูน", "", ""], ["น้าเพ็ญ - น้องเฌอแตม", "", ""], ["น้าตุ่น", "", ""], ["น้าอ้อยและครอบครัว", "", ""], ["น้าหน่อยและครอบครัว", "", ""], ["ป้าตุ้ย - เอแคล์", "", ""], ["ป้าหน่อย", "", ""], ["พี่อ้อ - น้องน้ำ", "", ""], ["ป้าคิดและครอบครัว", "", ""], ["ป้าหนู", "", ""], ["น้าหมี", "", ""], ["คุณมาร์คและครอบครัว", "", ""]];

// ============================================================
//  SETUP — รันครั้งเดียวตอนติดตั้ง
// ============================================================
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // ---- สร้างชีท Guests ----
  var guestSheet = getOrCreateSheet_(ss, SHEET_GUESTS);
  if (guestSheet.getLastRow() === 0) {
    guestSheet.appendRow(['ID', 'FirstName', 'LastName', 'Position', 'Phone',
      'RSVPStatus', 'NumAttending', 'Message', 'RSVPAt', 'Source']);
    guestSheet.setFrozenRows(1);
    var rows = GUEST_SEED.map(function (g, i) {
      return [i + 1, g[0] || '', g[1] || '', g[2] || '', '', '', '', '', '', 'imported'];
    });
    if (rows.length > 0) {
      guestSheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
    }
  }

  // ---- สร้างชีท Expenses ----
  var expSheet = getOrCreateSheet_(ss, SHEET_EXPENSES);
  if (expSheet.getLastRow() === 0) {
    expSheet.appendRow(['ID', 'Date', 'Category', 'Item', 'Amount', 'Note', 'CreatedAt']);
    expSheet.setFrozenRows(1);
  }

  // ---- สร้างชีท Gallery ----
  var galSheet = getOrCreateSheet_(ss, SHEET_GALLERY);
  if (galSheet.getLastRow() === 0) {
    galSheet.appendRow(['ID', 'Type', 'DriveFileId', 'Url', 'ThumbUrl', 'Caption', 'UploaderName', 'CreatedAt']);
    galSheet.setFrozenRows(1);
  }

  // ---- สร้างชีท Config ----
  var cfgSheet = getOrCreateSheet_(ss, SHEET_CONFIG);
  if (cfgSheet.getLastRow() === 0) {
    cfgSheet.appendRow(['Key', 'Value']);
    cfgSheet.appendRow(['Budget', DEFAULT_BUDGET]);
    cfgSheet.setFrozenRows(1);
  }

  // ---- โฟลเดอร์ Drive สำหรับเก็บรูป/วีดีโอ ----
  var props = PropertiesService.getScriptProperties();
  if (!props.getProperty('DRIVE_FOLDER_ID')) {
    var folder = DriveApp.createFolder('เว็บงานแต่ง เก้า&เบ๊นซ์ - Gallery');
    props.setProperty('DRIVE_FOLDER_ID', folder.getId());
  }

  // ---- ตั้ง admin user/pass เริ่มต้น (ถ้ายังไม่เคยตั้ง) ----
  if (!props.getProperty('ADMIN_USER')) {
    props.setProperty('ADMIN_USER', DEFAULT_ADMIN_USER);
  }
  if (!props.getProperty('ADMIN_PASS')) {
    props.setProperty('ADMIN_PASS', DEFAULT_ADMIN_PASS);
  }

  SpreadsheetApp.flush();
  Logger.log('Setup complete! Drive folder id: ' + props.getProperty('DRIVE_FOLDER_ID'));
}

function getOrCreateSheet_(ss, name) {
  var sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  return sh;
}

// ============================================================
//  ENTRY POINTS
// ============================================================
function doGet(e) {
  try {
    var action = e.parameter.action;
    var result;
    switch (action) {
      case 'searchGuests':
        result = searchGuests_(e.parameter.q || '');
        break;
      case 'getGalleryPublic':
        result = getGalleryPublic_();
        break;
      case 'adminGetGuests':
        requireAdmin_(e.parameter.token);
        result = adminGetGuests_();
        break;
      case 'adminGetExpenses':
        requireAdmin_(e.parameter.token);
        result = adminGetExpenses_();
        break;
      case 'adminGetGallery':
        requireAdmin_(e.parameter.token);
        result = adminGetGallery_();
        break;
      case 'adminGetBudget':
        requireAdmin_(e.parameter.token);
        result = { budget: getConfigValue_('Budget', 0) };
        break;
      default:
        result = { error: 'unknown_action' };
    }
    return jsonOut_(result);
  } catch (err) {
    return jsonOut_({ error: String(err) });
  }
}

function doPost(e) {
  try {
    var body = {};
    if (e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }
    var action = body.action;
    var result;
    switch (action) {
      case 'submitRSVP':
        result = submitRSVP_(body);
        break;
      case 'uploadMedia':
        result = uploadMedia_(body);
        break;
      case 'adminLogin':
        result = adminLogin_(body.username, body.password);
        break;
      case 'adminAddGuest':
        requireAdmin_(body.token);
        result = adminAddGuest_(body);
        break;
      case 'adminUpdateGuest':
        requireAdmin_(body.token);
        result = adminUpdateGuest_(body);
        break;
      case 'adminDeleteGuest':
        requireAdmin_(body.token);
        result = adminDeleteGuest_(body.id);
        break;
      case 'adminAddExpense':
        requireAdmin_(body.token);
        result = adminAddExpense_(body);
        break;
      case 'adminUpdateExpense':
        requireAdmin_(body.token);
        result = adminUpdateExpense_(body);
        break;
      case 'adminDeleteExpense':
        requireAdmin_(body.token);
        result = adminDeleteExpense_(body.id);
        break;
      case 'adminDeleteMedia':
        requireAdmin_(body.token);
        result = adminDeleteMedia_(body.id);
        break;
      case 'adminSetBudget':
        requireAdmin_(body.token);
        result = setConfigValue_('Budget', body.budget);
        break;
      default:
        result = { error: 'unknown_action' };
    }
    return jsonOut_(result);
  } catch (err) {
    return jsonOut_({ error: String(err) });
  }
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
//  AUTH
// ============================================================
function adminLogin_(username, password) {
  var props = PropertiesService.getScriptProperties();
  var u = props.getProperty('ADMIN_USER');
  var p = props.getProperty('ADMIN_PASS');
  if (username === u && password === p) {
    var token = Utilities.getUuid();
    CacheService.getScriptCache().put('session_' + token, 'ok', SESSION_HOURS * 3600);
    return { success: true, token: token };
  }
  return { success: false, error: 'invalid_credentials' };
}

function requireAdmin_(token) {
  if (!token) throw new Error('unauthorized');
  var cached = CacheService.getScriptCache().get('session_' + token);
  if (cached !== 'ok') throw new Error('unauthorized');
}

// ============================================================
//  GUESTS / RSVP
// ============================================================
function getSheet_(name) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}

function sheetToObjects_(sheet) {
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var out = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row.join('') === '') continue;
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    obj._row = i + 1; // แถวจริงใน sheet (สำหรับ update/delete)
    out.push(obj);
  }
  return out;
}

function searchGuests_(q) {
  var sheet = getSheet_(SHEET_GUESTS);
  var guests = sheetToObjects_(sheet);
  q = (q || '').toString().trim().toLowerCase();
  if (!q) return { results: [] };
  var matches = guests.filter(function (g) {
    var full = (g.FirstName + ' ' + g.LastName).toLowerCase();
    return full.indexOf(q) !== -1;
  }).slice(0, 15).map(function (g) {
    return {
      id: g.ID,
      firstName: g.FirstName,
      lastName: g.LastName,
      position: g.Position,
      rsvpStatus: g.RSVPStatus
    };
  });
  return { results: matches };
}

function submitRSVP_(body) {
  var sheet = getSheet_(SHEET_GUESTS);
  var guests = sheetToObjects_(sheet);
  var now = new Date();
  var attending = body.attending === 'yes' ? 'yes' : 'no';
  var numAttending = attending === 'yes' ? (parseInt(body.numAttending, 10) || 1) : 0;

  var targetRow = null;

  if (body.guestId) {
    for (var i = 0; i < guests.length; i++) {
      if (String(guests[i].ID) === String(body.guestId)) {
        targetRow = guests[i]._row;
        break;
      }
    }
  }

  if (!targetRow && body.firstName) {
    var fn = body.firstName.trim().toLowerCase();
    var ln = (body.lastName || '').trim().toLowerCase();
    for (var k = 0; k < guests.length; k++) {
      if (guests[k].FirstName.toString().trim().toLowerCase() === fn &&
          guests[k].LastName.toString().trim().toLowerCase() === ln) {
        targetRow = guests[k]._row;
        break;
      }
    }
  }

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var col = {};
  headers.forEach(function (h, idx) { col[h] = idx + 1; });

  if (!targetRow) {
    // แขกใหม่ที่ไม่อยู่ในลิสต์ -> เพิ่มแถวใหม่
    var newId = guests.length > 0 ? Math.max.apply(null, guests.map(function (g) { return Number(g.ID) || 0; })) + 1 : 1;
    sheet.appendRow([
      newId,
      body.firstName || '',
      body.lastName || '',
      '',
      body.phone || '',
      attending,
      numAttending,
      body.message || '',
      now,
      'rsvp'
    ]);
  } else {
    sheet.getRange(targetRow, col['Phone']).setValue(body.phone || '');
    sheet.getRange(targetRow, col['RSVPStatus']).setValue(attending);
    sheet.getRange(targetRow, col['NumAttending']).setValue(numAttending);
    sheet.getRange(targetRow, col['Message']).setValue(body.message || '');
    sheet.getRange(targetRow, col['RSVPAt']).setValue(now);
  }

  return { success: true };
}

function adminGetGuests_() {
  var sheet = getSheet_(SHEET_GUESTS);
  var guests = sheetToObjects_(sheet);
  var stats = { total: guests.length, yes: 0, no: 0, pending: 0, headcount: 0 };
  guests.forEach(function (g) {
    if (g.RSVPStatus === 'yes') { stats.yes++; stats.headcount += Number(g.NumAttending) || 0; }
    else if (g.RSVPStatus === 'no') { stats.no++; }
    else { stats.pending++; }
  });
  return { guests: guests.map(function (g) {
    return {
      id: g.ID, firstName: g.FirstName, lastName: g.LastName, position: g.Position,
      phone: g.Phone, rsvpStatus: g.RSVPStatus, numAttending: g.NumAttending,
      message: g.Message, rsvpAt: g.RSVPAt, source: g.Source
    };
  }), stats: stats };
}

function adminAddGuest_(body) {
  var sheet = getSheet_(SHEET_GUESTS);
  var guests = sheetToObjects_(sheet);
  var newId = guests.length > 0 ? Math.max.apply(null, guests.map(function (g) { return Number(g.ID) || 0; })) + 1 : 1;
  sheet.appendRow([newId, body.firstName || '', body.lastName || '', body.position || '', body.phone || '', '', '', '', '', 'manual']);
  return { success: true, id: newId };
}

function adminUpdateGuest_(body) {
  var sheet = getSheet_(SHEET_GUESTS);
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var col = {};
  headers.forEach(function (h, idx) { col[h] = idx + 1; });
  var guests = sheetToObjects_(sheet);
  var target = null;
  for (var i = 0; i < guests.length; i++) {
    if (String(guests[i].ID) === String(body.id)) { target = guests[i]._row; break; }
  }
  if (!target) return { success: false, error: 'not_found' };
  var fieldsMap = {
    firstName: 'FirstName', lastName: 'LastName', position: 'Position', phone: 'Phone',
    rsvpStatus: 'RSVPStatus', numAttending: 'NumAttending', message: 'Message'
  };
  Object.keys(fieldsMap).forEach(function (key) {
    if (body[key] !== undefined) {
      sheet.getRange(target, col[fieldsMap[key]]).setValue(body[key]);
    }
  });
  return { success: true };
}

function adminDeleteGuest_(id) {
  var sheet = getSheet_(SHEET_GUESTS);
  var guests = sheetToObjects_(sheet);
  for (var i = 0; i < guests.length; i++) {
    if (String(guests[i].ID) === String(id)) {
      sheet.deleteRow(guests[i]._row);
      return { success: true };
    }
  }
  return { success: false, error: 'not_found' };
}

// ============================================================
//  EXPENSES
// ============================================================
function adminGetExpenses_() {
  var sheet = getSheet_(SHEET_EXPENSES);
  var rows = sheetToObjects_(sheet);
  var total = 0;
  var byCategory = {};
  rows.forEach(function (r) {
    var amt = Number(r.Amount) || 0;
    total += amt;
    byCategory[r.Category] = (byCategory[r.Category] || 0) + amt;
  });
  return {
    expenses: rows.map(function (r) {
      return { id: r.ID, date: r.Date, category: r.Category, item: r.Item, amount: r.Amount, note: r.Note };
    }),
    total: total,
    byCategory: byCategory,
    budget: getConfigValue_('Budget', 0)
  };
}

function adminAddExpense_(body) {
  var sheet = getSheet_(SHEET_EXPENSES);
  var rows = sheetToObjects_(sheet);
  var newId = rows.length > 0 ? Math.max.apply(null, rows.map(function (r) { return Number(r.ID) || 0; })) + 1 : 1;
  sheet.appendRow([newId, body.date || '', body.category || '', body.item || '', Number(body.amount) || 0, body.note || '', new Date()]);
  return { success: true, id: newId };
}

function adminUpdateExpense_(body) {
  var sheet = getSheet_(SHEET_EXPENSES);
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var col = {};
  headers.forEach(function (h, idx) { col[h] = idx + 1; });
  var rows = sheetToObjects_(sheet);
  var target = null;
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i].ID) === String(body.id)) { target = rows[i]._row; break; }
  }
  if (!target) return { success: false, error: 'not_found' };
  var fieldsMap = { date: 'Date', category: 'Category', item: 'Item', amount: 'Amount', note: 'Note' };
  Object.keys(fieldsMap).forEach(function (key) {
    if (body[key] !== undefined) {
      sheet.getRange(target, col[fieldsMap[key]]).setValue(key === 'amount' ? Number(body[key]) : body[key]);
    }
  });
  return { success: true };
}

function adminDeleteExpense_(id) {
  var sheet = getSheet_(SHEET_EXPENSES);
  var rows = sheetToObjects_(sheet);
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i].ID) === String(id)) {
      sheet.deleteRow(rows[i]._row);
      return { success: true };
    }
  }
  return { success: false, error: 'not_found' };
}

// ============================================================
//  GALLERY (Drive storage)
// ============================================================
function getDriveFolder_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('DRIVE_FOLDER_ID');
  if (!id) throw new Error('no_drive_folder_run_setup_first');
  return DriveApp.getFolderById(id);
}

function uploadMedia_(body) {
  var maxBytes = body.type === 'video' ? 60 * 1024 * 1024 : 12 * 1024 * 1024;
  var b64 = body.base64Data || '';
  var approxBytes = Math.floor(b64.length * 0.75);
  if (approxBytes > maxBytes) {
    return { success: false, error: 'file_too_large' };
  }
  var folder = getDriveFolder_();
  var blob = Utilities.newBlob(Utilities.base64Decode(b64), body.mimeType, body.filename);
  var file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  var fileId = file.getId();
  var url, thumbUrl;
  if (body.type === 'video') {
    url = 'https://drive.google.com/file/d/' + fileId + '/preview';
    thumbUrl = 'https://drive.google.com/thumbnail?id=' + fileId + '&sz=w500';
  } else {
    url = 'https://drive.google.com/thumbnail?id=' + fileId + '&sz=w1600';
    thumbUrl = 'https://drive.google.com/thumbnail?id=' + fileId + '&sz=w500';
  }

  var sheet = getSheet_(SHEET_GALLERY);
  var rows = sheetToObjects_(sheet);
  var newId = rows.length > 0 ? Math.max.apply(null, rows.map(function (r) { return Number(r.ID) || 0; })) + 1 : 1;
  var now = new Date();
  sheet.appendRow([newId, body.type, fileId, url, thumbUrl, body.caption || '', body.uploaderName || '', now]);

  return { success: true, id: newId, url: url, thumbUrl: thumbUrl, type: body.type };
}

function getGalleryPublic_() {
  var sheet = getSheet_(SHEET_GALLERY);
  var rows = sheetToObjects_(sheet);
  rows.sort(function (a, b) { return new Date(b.CreatedAt) - new Date(a.CreatedAt); });
  return {
    items: rows.map(function (r) {
      return {
        id: r.ID, type: r.Type, url: r.Url, thumbUrl: r.ThumbUrl,
        caption: r.Caption, uploaderName: r.UploaderName, createdAt: r.CreatedAt
      };
    })
  };
}

function adminGetGallery_() {
  return getGalleryPublic_();
}

function adminDeleteMedia_(id) {
  var sheet = getSheet_(SHEET_GALLERY);
  var rows = sheetToObjects_(sheet);
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i].ID) === String(id)) {
      try {
        DriveApp.getFileById(rows[i].DriveFileId).setTrashed(true);
      } catch (e) { /* ไฟล์อาจถูกลบไปแล้ว ข้ามไป */ }
      sheet.deleteRow(rows[i]._row);
      return { success: true };
    }
  }
  return { success: false, error: 'not_found' };
}

// ============================================================
//  CONFIG (เช่น งบประมาณ)
// ============================================================
function getConfigValue_(key, defaultVal) {
  var sheet = getSheet_(SHEET_CONFIG);
  var rows = sheetToObjects_(sheet);
  for (var i = 0; i < rows.length; i++) {
    if (rows[i].Key === key) return rows[i].Value;
  }
  return defaultVal;
}

function setConfigValue_(key, value) {
  var sheet = getSheet_(SHEET_CONFIG);
  var rows = sheetToObjects_(sheet);
  for (var i = 0; i < rows.length; i++) {
    if (rows[i].Key === key) {
      sheet.getRange(rows[i]._row, 2).setValue(value);
      return { success: true };
    }
  }
  sheet.appendRow([key, value]);
  return { success: true };
}
