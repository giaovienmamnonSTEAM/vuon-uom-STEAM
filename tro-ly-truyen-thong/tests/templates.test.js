import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MODULES, EDIT_ACTIONS, EDITOR_SAMPLE, initialFormData } from '../src/lib/catalog.js';
import { TEMPLATE_GENERATORS } from '../src/lib/compose.js';
import { applyEditAction, fixSpelling, findHarshWords } from '../src/lib/textTools.js';

const settings = { tenTruong: '', tenLop: '', tenGiaoVien: '' };

for (const mod of MODULES) {
  test(`${mod.id}: dữ liệu mẫu soạn được, không lộ undefined`, () => {
    for (let v = 0; v < 3; v++) {
      const r = TEMPLATE_GENERATORS[mod.id](mod.sample, settings, v);
      assert.ok(r.text.length > 40);
      assert.ok(!/undefined|null|NaN|\[object/.test(r.text), r.text);
    }
  });
  test(`${mod.id}: biểu mẫu trống không lỗi`, () => {
    const data = initialFormData(mod, {});
    const r = TEMPLATE_GENERATORS[mod.id](data, {}, 0);
    assert.equal(typeof r.text, 'string');
    assert.ok(!/undefined|null|NaN/.test(r.text), r.text);
  });
  test(`${mod.id}: mọi lựa chọn đều soạn được`, () => {
    for (const f of mod.fields.filter((f) => f.options)) {
      for (const o of f.options) {
        const r = TEMPLATE_GENERATORS[mod.id]({ ...mod.sample, [f.name]: o.value }, settings, 1);
        assert.ok(!/undefined|null/.test(r.text), `${f.name}=${o.value}\n${r.text}`);
      }
    }
  });
}

test('biên tập: các thao tác không đổi ngày giờ', () => {
  for (const a of EDIT_ACTIONS) {
    const r = applyEditAction(a.value, EDITOR_SAMPLE, {}, 0);
    assert.ok(r.text.includes('20/11'), a.value + '\n' + r.text);
    assert.ok(r.text.includes('7h30'), a.value + '\n' + r.text);
    assert.ok(!/undefined/.test(r.text));
  }
});

test('sửa chính tả', () => {
  const r = fixSpelling(EDITOR_SAMPLE);
  assert.ok(r.text.includes('chân thành'));
  assert.ok(r.text.startsWith('Kính gửi'));
  assert.ok(r.text.includes('Ngày Nhà giáo Việt Nam') || r.text.includes('ngày Nhà giáo Việt Nam'));
  assert.ok(!r.text.includes(' ,'));
  assert.equal(fixSpelling('Lúc 7.30 ngày 1,5').text, 'Lúc 7.30 ngày 1,5');
});

test('từ ngữ phán xét', () => {
  assert.equal(findHarshWords('Con khám phá rất giỏi').length, 0);
  assert.ok(findHarshWords('Con hay đánh bạn và lười ăn').length >= 2);
});

import { generateThuMoi } from '../src/lib/templates/thuMoi.js';

test('thư mời không tự thêm quốc hiệu, người ký khi chưa cung cấp', () => {
  const r = generateThuMoi({ loai: 'steam', tenSuKien: 'Ngày hội STEAM', thoiGian: '8h ngày 15/11', quocHieu: 'khong' }, {}, 0);
  assert.ok(!r.text.includes('CỘNG HÒA'));
  assert.ok(!r.text.includes('HIỆU TRƯỞNG') && !r.text.includes('Ký, ghi rõ'));
  assert.ok(r.text.includes('8h ngày 15/11'));
  assert.ok(r.text.includes('[CẦN BỔ SUNG: Địa điểm]'));
});

test('mở rộng theo quy tắc giữ dữ kiện', () => {
  const r = applyEditAction('mo-rong', 'Lớp nghỉ ngày 21/11 lúc 7h30.', {}, 0);
  assert.ok(r.text.includes('21/11') && r.text.includes('7h30') && r.text.length > 40);
});
