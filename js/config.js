/**
 * ตั้งค่าเว็บไซต์งานแต่ง — แก้ไขค่าต่างๆ ในไฟล์นี้ได้ตามต้องการ
 */
window.WEDDING_CONFIG = {
  // ⚠️ สำคัญที่สุด: หลัง deploy Google Apps Script แล้ว เอา Web app URL มาใส่ตรงนี้
  API_URL: 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE',

  bride: {
    thName: 'ชุติกาญจน์ ณ สงขลา',
    nickname: 'เก้า',
    enName: 'Chutikarn',
    parents: 'พ.จ.อ.เฉลิมศักดิ์ ณ สงขลา (บิดา) และ นาง สุพัตรา ณ สงขลา (มารดา)'
  },
  groom: {
    thName: 'มงคล นิลวงษ์',
    nickname: 'เบ๊นซ์',
    enName: 'Mongkon',
    parents: 'นาย ปุญญวัจน์ นิลวงษ์ (บิดา) และ นาง ปรียา หอยสังข์ (มารดา)'
  },

  // ใช้ ISO string ตามเวลาไทย (Asia/Bangkok, UTC+7)
  weddingDateISO: '2026-10-09T16:00:00+07:00',
  weddingDateDisplay: 'วันศุกร์ที่ 9 ตุลาคม 2569',

  venue: {
    name: 'ริมธารา Rimtara พระราม 3 (ห้อง ริมนที)',
    address: 'อาคาร Sv City ถนนพระรามที่ 3',
    mapsLink: 'https://maps.app.goo.gl/Sv85fhQEZdon6jDn6',
    // ใส่ embed src ได้ถ้ามี (Google Maps > Share > Embed a map) ไม่บังคับ
    mapsEmbedSrc: ''
  },

  schedule: [
    { time: '16.29 น.', label: 'พิธีสวมแหวน', icon: '💍' },
    { time: '17.19 น.', label: 'พิธีหลั่งน้ำสังข์', icon: '🐚' },
    { time: '18.09 น.', label: 'ฉลองมงคลสมรส (รับประทานอาหาร)', icon: '🍽️' }
  ],
  eventTimeRange: '16.00 - 22.00 น.',

  themeColors: [
    { name: 'ชมพู', hex: '#F4C6CE' },
    { name: 'ชมพูอ่อน', hex: '#F8DCE2' },
    { name: 'มินท์', hex: '#BFE3D4' },
    { name: 'เขียวอ่อน', hex: '#D7EAC8' },
    { name: 'ครีม', hex: '#F3E7C9' },
    { name: 'ฟ้า', hex: '#BFD9EC' },
    { name: 'ม่วง', hex: '#D6C6E8' },
    { name: 'น้ำตาล', hex: '#C9A27C' }
  ],

  social: {
    hashtag: '#kbhappytime',
    facebook: '',
    instagram: ''
  },

  rsvpNote: 'ขออภัยหากมิได้เรียนเชิญด้วยตัวเอง',

  promptpay: {
    phone: '0826979767',
    accountName: 'มงคล นิลวงษ์',
    message: 'ร่วมยินดีกับ เก้า & เบ๊นซ์'
  },

  heroImage: 'assets/invitation-front.jpg',
  cardBackImage: 'assets/invitation-back.jpg'
};
