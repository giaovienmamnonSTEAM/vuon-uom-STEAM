// Hình minh họa cho thẻ chức năng (96×96) và các trạng thái soạn nội dung.
import {
  C, G, Kid, Teacher, Bunny, Bear, Star, Sparkle, Cloud, Flower, Heart, Book, Pencil, School, Calendar, Envelope, Bubble,
  Megaphone, Camera, Board, Notebook
} from './parts.jsx';

function Icon({ bg, label, children, className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" className={className} role="img" aria-label={label}>
      <circle cx={48} cy={50} r={44} fill={bg} />
      {children}
    </svg>
  );
}

const Paper = ({ x, y, s = 1, r = 0, lines = 4, head = C.peachD }) => (
  <G x={x} y={y} s={s} r={r}>
    <rect x={-20} y={-26} width={40} height={52} rx={4} fill={C.white} stroke={C.greyD} strokeWidth={1.5} />
    <rect x={-13} y={-19} width={26} height={5} rx={2.5} fill={head} />
    {Array.from({ length: lines }).map((_, i) => (
      <line key={i} x1={-13} y1={-6 + i * 7} x2={i % 2 ? 7 : 13} y2={-6 + i * 7} stroke={C.greyD} strokeWidth={2} strokeLinecap="round" />
    ))}
  </G>
);

export const ICONS = {
  'thong-bao': ({ className }) => (
    <Icon bg={C.skyL} label="Loa và tờ thông báo" className={className}>
      <Paper x={58} y={54} r={8} />
      <Megaphone x={36} y={46} s={0.95} r={-14} />
      <Sparkle x={78} y={20} r={5} />
    </Icon>
  ),
  'tin-nhan': ({ className }) => (
    <Icon bg={C.leaf} label="Phong bì và bong bóng trò chuyện" className={className}>
      <Envelope x={42} y={78} s={1.05} />
      <Bubble x={60} y={34} s={0.8} tail="left" />
      <Heart x={24} y={30} s={0.8} />
    </Icon>
  ),
  'thu-moi': ({ className }) => (
    <Icon bg={C.peach} label="Thiệp mời có hoa" className={className}>
      <G x={50} y={52} r={-6}>
        <rect x={-24} y={-30} width={48} height={60} rx={6} fill={C.cream} stroke={C.pinkD} strokeWidth={2} />
        <rect x={-18} y={-24} width={36} height={48} rx={4} fill="none" stroke={C.pink} strokeWidth={1.2} strokeDasharray="3 2" />
        <text x={0} y={6} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={C.pinkD} fontFamily="'Be Vietnam Pro', system-ui, sans-serif">THƯ MỜI</text>
        <line x1={-10} y1={14} x2={10} y2={14} stroke={C.greyD} strokeWidth={1.6} strokeLinecap="round" />
      </G>
      <Flower x={30} y={26} s={0.85} petal={C.pinkD} stem={false} />
      <Flower x={72} y={78} s={0.7} petal={C.yellowD} center={C.peachD} stem={false} />
      <Flower x={20} y={38} s={0.5} petal={C.white} stem={false} />
    </Icon>
  ),
  'ban-tin': ({ className }) => (
    <Icon bg={C.yellow} label="Quyển sổ và bút chì" className={className}>
      <Notebook x={46} y={80} s={1.05} cover={C.skyD} />
      <Pencil x={70} y={74} s={1.05} r={28} body={C.peachD} />
      <Star x={22} y={26} r={6} />
    </Icon>
  ),
  'tuyen-truyen': ({ className }) => (
    <Icon bg={C.leaf} label="Cô giáo đọc sách cùng trẻ" className={className}>
      <Teacher x={40} y={92} s={0.72} pose="hold" dress={C.skyD} />
      <Book x={40} y={60} s={0.75} open cover={C.peachD} />
      <Kid x={72} y={92} s={0.6} pose="hands" shirt={C.yellowD} girl />
      <Heart x={76} y={24} s={0.7} />
    </Icon>
  ),
  'truyen-thong': ({ className }) => (
    <Icon bg={C.skyL} label="Máy ảnh và bảng tin" className={className}>
      <Board x={46} y={66} s={0.85} />
      <Camera x={64} y={86} s={0.8} />
      <Sparkle x={22} y={78} r={5} fill={C.pinkD} />
    </Icon>
  ),
  'bien-tap': ({ className }) => (
    <Icon bg={C.purple} label="Bút chì đang sửa văn bản" className={className}>
      <Paper x={42} y={52} lines={4} head={C.skyD} />
      <path d="M30,48 Q38,44 46,48" stroke={C.red} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      <path d="M30,62 L40,62" stroke={C.leafD} strokeWidth={3} strokeLinecap="round" />
      <Pencil x={66} y={64} s={1.1} r={35} />
      <Sparkle x={78} y={26} r={6} fill={C.yellowD} />
    </Icon>
  ),
  'lich-su': ({ className }) => (
    <Icon bg={C.yellow} label="Hộp lưu trữ các bản đã soạn" className={className}>
      <G x={48} y={78}>
        <rect x={-26} y={-26} width={52} height={28} rx={5} fill={C.wood} />
        <rect x={-30} y={-32} width={60} height={9} rx={4} fill={C.brown} />
        <rect x={-8} y={-18} width={16} height={6} rx={3} fill={C.cream} />
      </G>
      <Paper x={40} y={40} s={0.6} r={-10} head={C.pinkD} />
      <Paper x={58} y={38} s={0.6} r={8} head={C.leafD} />
      <Star x={78} y={24} r={5} />
    </Icon>
  ),
  'thu-vien-hinh': ({ className }) => (
    <Icon bg={C.pink} label="Khung tranh minh họa" className={className}>
      <G x={48} y={50} r={-5}>
        <rect x={-28} y={-22} width={56} height={44} rx={5} fill={C.wood} />
        <rect x={-23} y={-17} width={46} height={34} rx={3} fill={C.skyL} />
        <path d="M-23,10 Q-10,-4 2,6 T23,2 L23,17 L-23,17 Z" fill={C.leafD} />
        <circle cx={12} cy={-7} r={5} fill={C.yellowD} />
      </G>
      <Flower x={20} y={76} s={0.55} petal={C.white} stem={false} />
      <Sparkle x={78} y={22} r={5} />
    </Icon>
  ),
  'thiet-lap': ({ className }) => (
    <Icon bg={C.skyL} label="Ngôi trường" className={className}>
      <School x={48} y={86} s={0.5} />
      <Cloud x={24} y={26} s={0.45} />
      <Flower x={16} y={78} s={0.5} />
      <Flower x={82} y={80} s={0.45} petal={C.yellowD} center={C.peachD} />
    </Icon>
  )
};

export function ModuleIcon({ id, className = 'h-16 w-16' }) {
  const I = ICONS[id];
  return I ? <I className={className} /> : null;
}

// ---------------------------------------------------------------------------
// Trạng thái
// ---------------------------------------------------------------------------
export function LoadingArt({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" className={className} role="img" aria-label="Cô giáo đang chuẩn bị nội dung">
      <ellipse cx={80} cy={114} rx={60} ry={6} fill={C.leaf} />
      <g className="art-bob">
        <Teacher x={70} y={112} s={0.95} pose="hold" dress={C.skyD} glasses />
        <Book x={70} y={70} s={0.85} open cover={C.peachD} />
      </g>
      <g className="art-twinkle">
        <Sparkle x={120} y={30} r={7} />
        <Sparkle x={134} y={56} r={4} fill={C.pinkD} />
        <Star x={26} y={36} r={6} fill={C.sky} />
      </g>
      <Pencil x={124} y={108} s={0.8} r={30} />
    </svg>
  );
}

export function SuccessArt({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={className} role="img" aria-label="Đã xong">
      <circle cx={24} cy={25} r={18} fill={C.leafD} />
      <path d="M15,25 L21.5,31.5 L33,19" stroke={C.white} strokeWidth={4.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Star x={40} y={9} r={5} />
      <Sparkle x={8} y={10} r={3.5} fill={C.pinkD} />
    </svg>
  );
}

export function OopsArt({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 80" className={className} role="img" aria-label="Có trục trặc nhỏ">
      <Cloud x={52} y={24} s={0.9} fill={C.skyL} />
      <path d="M40,40 l-3,7 M54,40 l-3,7 M68,40 l-3,7" stroke={C.sky} strokeWidth={2.5} strokeLinecap="round" />
      <Bunny x={30} y={78} s={0.8} />
      <G x={30} y={42}>
        <path d="M-14,0 A14,10 0 0 1 14,0 Z" fill={C.peachD} />
        <line x1={0} y1={0} x2={0} y2={12} stroke={C.line} strokeWidth={1.5} />
      </G>
    </svg>
  );
}

export function EmptyArt({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 110" className={className} role="img" aria-label="Chưa có nội dung">
      <ellipse cx={80} cy={104} rx={62} ry={6} fill={C.leaf} />
      <G x={78} y={98}>
        <rect x={-30} y={-72} width={60} height={72} rx={6} fill={C.white} stroke={C.greyD} strokeWidth={1.5} />
        {[-58, -48, -38, -28, -18].map((ly, i) => (
          <line key={ly} x1={-20} y1={ly} x2={i % 2 ? 10 : 20} y2={ly} stroke={C.skyL} strokeWidth={3} strokeLinecap="round" />
        ))}
      </G>
      <Pencil x={118} y={92} s={1} r={30} />
      <Bear x={36} y={106} s={0.75} />
      <Sparkle x={128} y={28} r={6} />
      <Star x={34} y={30} r={5} fill={C.pinkD} />
    </svg>
  );
}
