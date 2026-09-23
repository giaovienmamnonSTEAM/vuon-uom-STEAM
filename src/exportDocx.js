/* ============ XUẤT FILE WORD (.docx) ============
   Khổ A4 dọc, Times New Roman 13, lề trên/dưới 2 cm, trái 3 cm, phải 2 cm.
   Phần III là MỘT bảng liên tục 2 cột "Hoạt động của Cô | Hoạt động của Trẻ";
   mỗi bước/giai đoạn chiếm đúng MỘT hàng, tên bước là dòng đầu ô Cô (đậm, gạch chân).
   Chỉ gồm 3 phần cốt lõi I – II – III.
*/
import {
  AlignmentType, BorderStyle, Document, Packer, Paragraph, Table, TableCell,
  TableRow, TextRun, UnderlineType, VerticalAlign, WidthType
} from 'docx';
import { STEAM_LABELS, SKILL_LABELS, PREP_CO_LABELS, PREP_TRE_LABELS, splitLines, fileSlug } from './planModel.js';

const FONT = 'Times New Roman';
const SIZE = 26; // half-points = 13pt
const CONTENT_WIDTH = 11906 - 1701 - 1134; // A4 trừ lề trái/phải (twip)

function run(text, opts = {}) {
  return new TextRun({ text: String(text ?? ''), font: FONT, size: SIZE, ...opts });
}

function para(children, opts = {}) {
  return new Paragraph({
    children: Array.isArray(children) ? children : [run(children)],
    spacing: { after: 60, line: 288 },
    alignment: AlignmentType.JUSTIFIED,
    ...opts
  });
}

function heading(text) {
  return para([run(text, { bold: true })], { spacing: { before: 200, after: 80 } });
}

function subHeading(text) {
  return para([run(text, { bold: true, italics: true })], { spacing: { before: 100, after: 40 } });
}

function labeled(label, items, indent = 0) {
  const list = (items || []).filter(Boolean);
  if (!list.length) return [];
  if (list.length === 1) {
    return [para([run(label + ': ', { bold: true }), run(list[0])], { indent: { left: indent } })];
  }
  return [
    para([run(label + ':', { bold: true })], { indent: { left: indent } }),
    ...list.map((t) => para('- ' + t, { indent: { left: indent + 284 } }))
  ];
}

function bullets(items, indent = 284) {
  return (items || []).filter(Boolean).map((t) => para('- ' + t, { indent: { left: indent } }));
}

function cellParas(lines, first = []) {
  const out = [...first];
  lines.forEach((l) => out.push(para(l, { alignment: AlignmentType.LEFT })));
  if (!out.length) out.push(para(''));
  return out;
}

function stepRow(step) {
  const titleText = step.ten_buoc + (step.thoi_gian ? ` (${step.thoi_gian})` : '');
  const coFirst = [para([run(titleText, { bold: true, underline: { type: UnderlineType.SINGLE } })], { alignment: AlignmentType.LEFT })];
  if (step.muc_dich) {
    coFirst.push(para([run('Mục đích: ', { italics: true, bold: true }), run(step.muc_dich, { italics: true })], { alignment: AlignmentType.LEFT }));
  }
  const coLines = [];
  const treLines = [];
  (step.luot || []).forEach((l) => {
    coLines.push(...splitLines(l.co));
    treLines.push(...splitLines(l.tre));
  });
  const coParas = cellParas(coLines, coFirst);
  if (step.tich_hop_steam) {
    coParas.push(para([run('→ Tích hợp STEAM: ' + step.tich_hop_steam, { italics: true })], { alignment: AlignmentType.LEFT }));
  }
  // Ô trẻ bắt đầu bằng một dòng trống để thẳng hàng với tên bước ở ô cô.
  const treParas = cellParas(treLines, [para('')]);
  return new TableRow({
    children: [
      new TableCell({ children: coParas, width: { size: CONTENT_WIDTH / 2, type: WidthType.DXA }, margins: cellMargins }),
      new TableCell({ children: treParas, width: { size: CONTENT_WIDTH / 2, type: WidthType.DXA }, margins: cellMargins })
    ]
  });
}

const cellMargins = { top: 80, bottom: 80, left: 110, right: 110 };
const border = { style: BorderStyle.SINGLE, size: 4, color: '000000' };

function headerCell(text) {
  return new TableCell({
    children: [para([run(text, { bold: true })], { alignment: AlignmentType.CENTER })],
    width: { size: CONTENT_WIDTH / 2, type: WidthType.DXA },
    verticalAlign: VerticalAlign.CENTER,
    shading: { fill: 'F2F2F2' },
    margins: cellMargins
  });
}

export async function exportDocx(plan) {
  const ti = plan.thong_tin || {};
  const md = plan.muc_dich_yeu_cau || {};
  const kt = md.kien_thuc || {};
  const kn = md.ky_nang || {};
  const cb = plan.chuan_bi || {};
  const co = cb.co || {};
  const tre = cb.tre || {};

  const children = [];
  children.push(para([run('GIÁO ÁN STEAM', { bold: true, size: 32 })], { alignment: AlignmentType.CENTER, spacing: { after: 200 } }));

  [
    ['Tên hoạt động', ti.ten_hoat_dong],
    ['Chủ đề', ti.chu_de],
    ['Lĩnh vực', ti.linh_vuc],
    ['Độ tuổi', ti.do_tuoi],
    ['Thời gian', ti.thoi_gian],
    ['Hình thức', ti.hinh_thuc],
    ['Quy trình', ti.quy_trinh],
    ['Áp dụng STEAM', ti.muc_do_steam]
  ].forEach(([k, v]) => {
    if (v) children.push(para([run(k + ': ', { bold: true }), run(v)]));
  });

  // I. MỤC ĐÍCH – YÊU CẦU
  children.push(heading('I. MỤC ĐÍCH – YÊU CẦU'));
  children.push(subHeading('1. Kiến thức'));
  STEAM_LABELS.forEach(([k, label]) => {
    children.push(...labeled(`${k} – ${label}`, kt[k]?.length ? kt[k] : ['Không áp dụng.'], 284));
  });
  children.push(subHeading('2. Kỹ năng'));
  children.push(para([run("* Nhóm kỹ năng 4C's:", { bold: true })], { indent: { left: 284 } }));
  SKILL_LABELS.forEach(([k, label]) => children.push(...labeled(label, kn[k], 568)));
  if (kn.ky_nang_khac?.length) {
    children.push(para([run('* Kỹ năng khác:', { bold: true })], { indent: { left: 284 } }));
    children.push(...bullets(kn.ky_nang_khac, 568));
  }
  children.push(subHeading('3. Thái độ'));
  children.push(...bullets(md.thai_do));

  // II. CHUẨN BỊ
  children.push(heading('II. CHUẨN BỊ'));
  children.push(subHeading('1. Chuẩn bị của Cô'));
  PREP_CO_LABELS.forEach(([k, label]) => children.push(...labeled(label, co[k], 284)));
  children.push(subHeading('2. Chuẩn bị của Trẻ'));
  PREP_TRE_LABELS.forEach(([k, label]) => children.push(...labeled(label, tre[k], 284)));
  if (cb.phu_huynh?.length) {
    children.push(subHeading('3. Phối hợp chuẩn bị với Phụ huynh học sinh'));
    children.push(...bullets(cb.phu_huynh));
  }

  // III. CÁCH TIẾN HÀNH
  children.push(heading('III. CÁCH TIẾN HÀNH'));
  children.push(new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [CONTENT_WIDTH / 2, CONTENT_WIDTH / 2],
    borders: { top: border, bottom: border, left: border, right: border, insideHorizontal: border, insideVertical: border },
    rows: [
      new TableRow({ tableHeader: true, children: [headerCell('Hoạt động của Cô'), headerCell('Hoạt động của Trẻ')] }),
      ...(plan.cach_tien_hanh || []).map(stepRow)
    ]
  }));

  const doc = new Document({
    creator: 'Vườn Ươm STEAM',
    title: ti.ten_hoat_dong || 'Giáo án STEAM',
    styles: { default: { document: { run: { font: FONT, size: SIZE } } } },
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1134, bottom: 1134, left: 1701, right: 1134 }
        }
      },
      children
    }]
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'GiaoAn_STEAM_' + fileSlug(ti.ten_hoat_dong) + '.docx';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
