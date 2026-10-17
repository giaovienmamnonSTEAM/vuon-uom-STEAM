// Gợi ý hình minh họa (có sẵn trong thư viện) theo loại nội dung và từ khóa.
// Chỉ chọn trong các hình vẽ sẵn — không tạo ảnh mới, không dùng URL bên ngoài.
import { SCENES } from './scenes.jsx';

// Ưu tiên theo chức năng + lựa chọn trong biểu mẫu
const BY_CHOICE = {
  'thong-bao': {
    'nghi-le': ['nghi-le', 'tet'], 'hoc-tro-lai': ['be-den-lop', 'truong-mam-non'], 'thoi-khoa-bieu': ['vui-hoc-vui-choi', 'truong-mam-non'],
    'do-dung': ['be-den-lop', 'sach-but-chi'], 'trai-nghiem': ['vuon-rau', 'san-choi'], 'hop-phu-huynh': ['hop-phu-huynh'],
    'suc-khoe': ['rua-tay', 'an-toan'], 'khoan-thu': ['truong-mam-non'], khan: ['truong-mam-non', 'an-toan'], khac: ['truong-mam-non']
  },
  'tin-nhan': {
    rieng: ['hop-phu-huynh'], nhom: ['vui-hoc-vui-choi', 'hop-phu-huynh'], 'do-dung': ['be-den-lop', 'sach-but-chi'], 'lich-hop': ['hop-phu-huynh'],
    'ne-nep': ['hop-phu-huynh', 'gia-dinh-doc-sach'], 'dong-vien': ['hop-phu-huynh', 'tri-an'], 'nhay-cam': ['hop-phu-huynh', 'gia-dinh-doc-sach']
  },
  'thu-moi': {
    'hop-dau-nam': ['hop-phu-huynh'], 'hop-cuoi-nam': ['hop-phu-huynh'], 'khai-giang': ['be-den-lop', 'truong-mam-non'],
    'tong-ket': ['van-nghe'], 'ngay-hoi-den-truong': ['be-den-lop', 'van-nghe'], steam: ['steam-xay-dung', 'steam-kham-pha'],
    'trai-nghiem': ['vuon-rau', 'san-choi'], 'su-kien': ['van-nghe', 'truong-mam-non']
  },
  'tuyen-truyen': {
    'dinh-duong': ['dinh-duong', 'bua-an-gia-dinh'], 've-sinh': ['rua-tay'], 'tai-nan': ['an-toan'], 'ngon-ngu': ['co-doc-truyen', 'gia-dinh-doc-sach'],
    'cam-xuc': ['gia-dinh-doc-sach', 'tri-an'], 'lop-mot': ['be-den-lop', 'sach-but-chi'], 'phoi-hop': ['hop-phu-huynh'],
    'thiet-bi': ['gia-dinh-doc-sach', 'san-choi'], 'tu-phuc-vu': ['be-den-lop', 'vui-hoc-vui-choi'], 'moi-truong': ['vuon-rau']
  },
  'truyen-thong': {
    facebook: [], website: ['truong-mam-non'], zalo: [], 'gioi-thieu': ['ve-tranh', 'co-doc-truyen'], 'chuyen-de': ['hop-phu-huynh'],
    'tong-ket': ['van-nghe'], 'bieu-duong': ['tri-an']
  }
};

const DEFAULTS = {
  'thong-bao': ['truong-mam-non'], 'tin-nhan': ['hop-phu-huynh'], 'thu-moi': ['van-nghe'], 'ban-tin': ['vui-hoc-vui-choi', 've-tranh', 'san-choi'],
  'tuyen-truyen': ['gia-dinh-doc-sach'], 'truyen-thong': ['van-nghe', 'truong-mam-non'], 'bien-tap': ['sach-but-chi']
};

const norm = (s) => String(s || '').toLocaleLowerCase('vi');

// Trả về danh sách id cảnh, phù hợp nhất đứng đầu (tối đa `limit`).
export function suggestScenes(moduleId, data = {}, text = '', limit = 4) {
  const score = new Map();
  const add = (id, pts) => score.set(id, (score.get(id) || 0) + pts);
  const choiceKey = moduleId === 'tuyen-truyen' ? data.chuDe : data.loai;
  (BY_CHOICE[moduleId]?.[choiceKey] || []).forEach((id, i) => add(id, 100 - i * 40));
  // Từ khóa trong thông tin giáo viên nhập (nặng hơn) và trong văn bản kết quả
  const input = norm(Object.values(data).filter((v) => typeof v === 'string').join(' '));
  const out = norm(text).slice(0, 3000);
  for (const sc of SCENES) {
    for (const tag of sc.tags) {
      if (input.includes(tag)) add(sc.id, 12);
      if (out.includes(tag)) add(sc.id, 3);
    }
  }
  (DEFAULTS[moduleId] || ['truong-mam-non']).forEach((id, i) => add(id, 5 - i));
  return [...score.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([id]) => id);
}
