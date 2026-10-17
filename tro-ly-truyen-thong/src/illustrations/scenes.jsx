// Thư viện cảnh minh họa (SVG vẽ sẵn trong ứng dụng, dùng được khi ngoại tuyến).
// Đây KHÔNG phải ảnh do AI tạo. Mỗi cảnh có nhóm và từ khóa để gợi ý theo nội dung.
import {
  C, G, Kid, Teacher, Parent, Bunny, Bear, Cat, Star, Sparkle, Cloud, Sun, Rainbow, Flower, Heart, Grass, Book, Pencil,
  Balloon, Bunting, Tree, School, House, Calendar, Bubble, Lantern, Moon, Blocks, Magnifier, Rocket, Gear, Table, Sink,
  Bubbles, Plate, Backpack, Easel, Slide, Ball, WateringCan, Sprout, Apricot, Notebook, Envelope
} from './parts.jsx';

export const GROUPS = [
  { value: 'truong-hoc', label: 'Trường học' },
  { value: 'co-va-tre', label: 'Cô giáo và trẻ' },
  { value: 'gia-dinh', label: 'Gia đình' },
  { value: 'sach-hoc-tap', label: 'Sách và học tập' },
  { value: 'trai-nghiem', label: 'Hoạt động trải nghiệm' },
  { value: 'suc-khoe', label: 'Sức khỏe và vệ sinh' },
  { value: 'le-hoi', label: 'Lễ hội và sự kiện' },
  { value: 'steam', label: 'STEAM và khám phá' }
];

// Khung chung 320×200 cho mọi cảnh
export function SceneFrame({ bg = C.skyL, title, children, className, svgRef }) {
  return (
    <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-label={title} className={className}>
      <title>{title}</title>
      <rect width="320" height="200" rx="18" fill={bg} />
      {children}
    </svg>
  );
}

const Flask = ({ x, y }) => (
  <G x={x} y={y}>
    <path d="M-5,-34 L5,-34 L5,-20 L16,0 L-16,0 L-5,-20 Z" fill={C.white} stroke={C.greyD} strokeWidth={1.8} strokeLinejoin="round" />
    <path d="M-12,-6 L12,-6 L16,0 L-16,0 Z" fill={C.leafD} />
    <circle cx={-2} cy={-12} r={2} fill={C.leafD} />
    <circle cx={3} cy={-16} r={1.4} fill={C.leafD} />
  </G>
);

const TrafficLight = ({ x, y }) => (
  <G x={x} y={y}>
    <rect x={-2.5} y={-70} width={5} height={70} fill={C.greyD} />
    <rect x={-9} y={-104} width={18} height={40} rx={6} fill={C.line} />
    <circle cy={-95} r={4.5} fill={C.red} opacity={0.35} />
    <circle cy={-84} r={4.5} fill={C.yellowD} opacity={0.35} />
    <circle cy={-73} r={4.5} fill={C.leafD} />
  </G>
);

const RedEnvelope = ({ x, y, r = 0 }) => (
  <G x={x} y={y} r={r}>
    <rect x={-8} y={-22} width={16} height={22} rx={2} fill={C.red} />
    <circle cx={0} cy={-12} r={3.5} fill={C.yellowD} />
  </G>
);

const RoundLantern = ({ x, y }) => (
  <G x={x} y={y}>
    <line x1={0} y1={-30} x2={0} y2={-18} stroke={C.line} strokeWidth={1} />
    <ellipse cx={0} cy={-6} rx={11} ry={13} fill={C.red} />
    <rect x={-6} y={-21} width={12} height={4} rx={1} fill={C.yellowD} />
    <rect x={-6} y={5} width={12} height={4} rx={1} fill={C.yellowD} />
    <path d="M-2,9 L-3,18 M2,9 L3,18" stroke={C.yellowD} strokeWidth={1.4} />
  </G>
);

const Confetti = ({ items }) => (
  <g>
    {items.map(([x, y, c, r], i) => (
      <rect key={i} x={x} y={y} width={4} height={8} rx={1.5} fill={c} transform={`rotate(${r} ${x} ${y})`} />
    ))}
  </g>
);

export const SCENES = [
  // ---------------- Trường học ----------------
  {
    id: 'truong-mam-non', group: 'truong-hoc', title: 'Ngôi trường mầm non',
    tags: ['ngôi trường', 'cơ sở vật chất', 'khoản thu', 'giới thiệu trường', 'tuyển sinh'],
    bg: C.skyL,
    render: () => (
      <>
        <Sun x={270} y={40} />
        <Cloud x={70} y={42} s={0.9} />
        <Cloud x={190} y={30} s={0.6} />
        <Grass y={168} />
        <School x={160} y={172} />
        <Tree x={42} y={172} s={0.9} />
        <Tree x={282} y={174} s={0.75} fruit />
        <Flower x={96} y={170} s={0.8} />
        <Flower x={228} y={172} s={0.7} petal={C.peachD} />
        <Bunny x={252} y={186} s={0.6} />
      </>
    )
  },
  {
    id: 'be-den-lop', group: 'truong-hoc', title: 'Các bé vui vẻ đến lớp',
    tags: ['đến lớp', 'đi học', 'học trở lại', 'khai giảng', 'ngày hội đến trường', 'lớp một', 'đồ dùng', 'chuẩn bị'],
    bg: C.cream,
    render: () => (
      <>
        <Sun x={38} y={36} r={12} />
        <Cloud x={130} y={34} s={0.7} />
        <Grass y={170} fill={C.leaf} />
        <School x={240} y={172} s={0.72} />
        <Teacher x={196} y={176} s={0.72} pose="wave" dress={C.skyD} />
        <Backpack x={64} y={164} s={0.7} fill={C.pinkD} />
        <Kid x={80} y={182} s={0.95} pose="wave" shirt={C.yellowD} girl />
        <Backpack x={142} y={166} s={0.7} />
        <Kid x={128} y={184} s={0.92} pose="down" shirt={C.peachD} />
        <Star x={160} y={60} r={5} />
        <Sparkle x={100} y={70} r={5} fill={C.pinkD} />
      </>
    )
  },
  // ---------------- Cô giáo và trẻ ----------------
  {
    id: 'co-doc-truyen', group: 'co-va-tre', title: 'Cô đọc truyện cùng các bé',
    tags: ['đọc sách', 'đọc truyện', 'kể chuyện', 'ngôn ngữ', 'thư viện', 'tuyên truyền', 'phát triển ngôn ngữ'],
    bg: C.yellow,
    render: () => (
      <>
        <rect x={0} y={150} width={320} height={50} rx={0} fill={C.peach} opacity={0.6} />
        <rect x={20} y={40} width={60} height={70} rx={6} fill={C.cream} />
        {[52, 74, 96].map((sy) => <rect key={sy} x={20} y={sy} width={60} height={4} fill={C.wood} />)}
        <Book x={36} y={52} s={0.5} cover={C.skyD} r={-90} />
        <Book x={46} y={52} s={0.5} cover={C.pinkD} r={-90} />
        <Book x={62} y={74} s={0.5} cover={C.leafD} r={-90} />
        <Book x={34} y={96} s={0.5} cover={C.peachD} r={-90} />
        <Teacher x={170} y={170} s={1.12} pose="hold" dress={C.skyD} glasses />
        <Book x={170} y={124} s={1.05} open cover={C.peachD} />
        <Kid x={102} y={186} s={0.8} pose="hands" shirt={C.leafD} girl flip />
        <Kid x={238} y={186} s={0.8} pose="hands" shirt={C.peachD} />
        <Bunny x={282} y={188} s={0.7} />
        <Star x={250} y={42} r={6} />
        <Sparkle x={272} y={66} r={5} fill={C.pinkD} />
        <Heart x={118} y={60} s={1.1} />
      </>
    )
  },
  {
    id: 've-tranh', group: 'co-va-tre', title: 'Bé vẽ tranh cùng cô',
    tags: ['vẽ', 'tạo hình', 'nghệ thuật', 'tô màu', 'sáng tạo', 'hoạt động học'],
    bg: C.skyL,
    render: () => (
      <>
        <rect x={0} y={160} width={320} height={40} fill={C.leaf} />
        <Easel x={120} y={174} s={1.1} />
        <Kid x={64} y={186} s={0.95} pose="point" shirt={C.pinkD} girl />
        <Teacher x={216} y={176} s={0.95} pose="point" dress={C.leafD} flip />
        <Kid x={270} y={188} s={0.75} pose="up" shirt={C.yellowD} />
        <Pencil x={160} y={188} s={0.7} r={70} body={C.skyD} />
        <Pencil x={176} y={192} s={0.7} r={80} body={C.pinkD} />
        <Rainbow x={262} y={70} r={34} w={6} />
        <Star x={40} y={40} r={6} />
      </>
    )
  },
  {
    id: 'tri-an', group: 'co-va-tre', title: 'Bé tặng hoa cô giáo',
    tags: ['20/11', 'nhà giáo', 'tri ân', 'cảm ơn', 'biểu dương', 'gương tốt', 'yêu thương', '8/3', 'phụ nữ'],
    bg: C.peach,
    render: () => (
      <>
        <Bunting x1={10} x2={310} y={18} />
        <rect x={0} y={162} width={320} height={38} fill={C.cream} />
        <Teacher x={190} y={176} s={1.05} pose="hold" dress={C.purpleD} />
        <Kid x={126} y={186} s={1} pose="hold" shirt={C.yellowD} girl />
        <Flower x={136} y={136} s={0.8} petal={C.pinkD} />
        <Flower x={128} y={140} s={0.7} petal={C.red} />
        <Flower x={144} y={142} s={0.65} petal={C.white} />
        <Heart x={160} y={84} s={1.3} />
        <Heart x={232} y={72} s={0.9} fill={C.red} />
        <Heart x={96} y={90} s={0.8} />
        <Cat x={262} y={188} s={0.75} />
        <Sparkle x={60} y={60} r={6} fill={C.yellowD} />
      </>
    )
  },
  // ---------------- Gia đình ----------------
  {
    id: 'hop-phu-huynh', group: 'gia-dinh', title: 'Cô giáo trao đổi với cha mẹ',
    tags: ['họp phụ huynh', 'phụ huynh', 'trao đổi', 'phối hợp', 'gia đình và nhà trường', 'tin nhắn', 'nhạy cảm', 'nề nếp'],
    bg: C.cream,
    render: () => (
      <>
        <rect x={0} y={160} width={320} height={40} fill={C.skyL} />
        <rect x={120} y={30} width={80} height={50} rx={6} fill={C.leaf} stroke={C.wood} strokeWidth={4} />
        <Heart x={160} y={58} s={1.2} />
        <Teacher x={72} y={176} s={1} pose="point" dress={C.skyD} />
        <Parent x={232} y={176} s={1} pose="hold" shirt={C.peachD} flip />
        <Parent x={284} y={178} s={0.95} dad shirt={C.leafD} flip />
        <Table x={160} y={176} w={100} />
        <rect x={140} y={140} width={22} height={16} rx={2} fill={C.white} transform="rotate(-6 151 148)" />
        <rect x={160} y={141} width={22} height={16} rx={2} fill={C.yellow} transform="rotate(5 171 149)" />
        <Bubble x={44} y={52} s={0.9} />
        <Bubble x={262} y={48} s={0.8} tail="right" />
      </>
    )
  },
  {
    id: 'gia-dinh-doc-sach', group: 'gia-dinh', title: 'Mẹ và bé đọc sách ở nhà',
    tags: ['gia đình', 'ở nhà', 'đọc sách', 'thiết bị điện tử', 'màn hình', 'cảm xúc', 'gắn kết', 'ông bà'],
    bg: C.yellow,
    render: () => (
      <>
        <rect x={0} y={150} width={320} height={50} fill={C.peach} opacity={0.7} />
        <rect x={210} y={30} width={70} height={56} rx={6} fill={C.skyL} stroke={C.white} strokeWidth={5} />
        <line x1={245} y1={30} x2={245} y2={86} stroke={C.white} strokeWidth={4} />
        <Moon x={226} y={50} r={8} />
        <rect x={70} y={120} width={150} height={44} rx={16} fill={C.pinkD} opacity={0.75} />
        <rect x={60} y={108} width={20} height={56} rx={10} fill={C.pinkD} />
        <rect x={210} y={108} width={20} height={56} rx={10} fill={C.pinkD} />
        <Parent x={118} y={164} s={0.95} pose="hold" shirt={C.skyD} />
        <Kid x={170} y={168} s={0.9} pose="hold" shirt={C.leafD} girl />
        <Book x={146} y={128} s={1.05} open cover={C.leafD} />
        <Cat x={262} y={190} s={0.8} />
        <Heart x={150} y={60} s={1.2} />
        <Star x={40} y={40} r={5} />
      </>
    )
  },
  {
    id: 'bua-an-gia-dinh', group: 'gia-dinh', title: 'Bữa ăn gia đình đầm ấm',
    tags: ['bữa ăn', 'gia đình', 'dinh dưỡng', 'ăn uống', 'biếng ăn', 'thói quen ăn'],
    bg: C.leaf,
    render: () => (
      <>
        <rect x={0} y={166} width={320} height={34} fill={C.cream} />
        <Parent x={70} y={178} s={0.95} dad shirt={C.skyD} pose="hold" />
        <Parent x={250} y={178} s={0.95} shirt={C.peachD} pose="hold" flip />
        <Kid x={160} y={184} s={0.9} pose="up" shirt={C.yellowD} />
        <Table x={160} y={182} w={190} />
        <Plate x={110} y={148} s={0.7} />
        <Plate x={210} y={148} s={0.7} />
        <ellipse cx={160} cy={150} rx={18} ry={7} fill={C.white} stroke={C.greyD} strokeWidth={1.5} />
        <ellipse cx={160} cy={146} rx={12} ry={6} fill={C.cream} />
        <Heart x={160} y={40} s={1.2} />
        <Sparkle x={110} y={60} r={5} />
        <Sparkle x={214} y={56} r={5} fill={C.pinkD} />
      </>
    )
  },
  // ---------------- Sách và học tập ----------------
  {
    id: 'sach-but-chi', group: 'sach-hoc-tap', title: 'Sách vở, bút chì và ngôi sao',
    tags: ['sách', 'học tập', 'bút chì', 'đồ dùng học tập', 'chữ cái', 'lớp một', 'biên tập'],
    bg: C.skyL,
    render: () => (
      <>
        <Rainbow x={160} y={150} r={92} w={9} />
        <Cloud x={60} y={150} s={1.1} />
        <Cloud x={262} y={150} s={1.1} />
        <Book x={160} y={190} s={2.4} cover={C.skyD} />
        <Book x={160} y={166} s={2.1} cover={C.peachD} />
        <Book x={160} y={145} s={1.8} cover={C.leafD} />
        <Pencil x={110} y={188} s={1.2} r={-12} />
        <Pencil x={212} y={188} s={1.2} r={14} body={C.pinkD} />
        <Star x={160} y={84} r={12} />
        <Star x={100} y={60} r={6} fill={C.pinkD} />
        <Star x={222} y={56} r={7} fill={C.sky} />
        <Bear x={272} y={196} s={0.7} />
      </>
    )
  },
  {
    id: 'vui-hoc-vui-choi', group: 'sach-hoc-tap', title: 'Một tuần vui học, vui chơi',
    tags: ['bản tin', 'tuần', 'hoạt động', 'vui chơi', 'học tập', 'xếp hình', 'góc chơi'],
    bg: C.cream,
    render: () => (
      <>
        <rect x={0} y={160} width={320} height={40} fill={C.leaf} />
        <Notebook x={52} y={150} s={1.1} cover={C.skyD} />
        <Pencil x={80} y={150} s={0.9} r={25} />
        <Calendar x={52} y={78} s={0.8} />
        <Blocks x={190} y={176} s={1.2} />
        <Kid x={140} y={186} s={0.9} pose="up" shirt={C.peachD} girl />
        <Kid x={252} y={186} s={0.9} pose="point" shirt={C.leafD} flip />
        <Ball x={292} y={182} r={9} />
        <Bear x={108} y={192} s={0.6} />
        <Star x={210} y={40} r={7} />
        <Sparkle x={160} y={48} r={5} fill={C.pinkD} />
        <Sparkle x={274} y={60} r={4} fill={C.skyD} />
      </>
    )
  },
  // ---------------- Hoạt động trải nghiệm ----------------
  {
    id: 'vuon-rau', group: 'trai-nghiem', title: 'Bé trồng cây, chăm vườn',
    tags: ['trải nghiệm', 'vườn', 'trồng cây', 'môi trường', 'thiên nhiên', 'ngoài trời', 'bảo vệ môi trường'],
    bg: C.skyL,
    render: () => (
      <>
        <Sun x={50} y={42} />
        <Cloud x={200} y={36} s={0.8} />
        <Grass y={150} fill={C.leaf} />
        <rect x={20} y={168} width={280} height={18} rx={8} fill={C.brownL} />
        <Sprout x={100} y={176} />
        <Sprout x={150} y={176} s={0.85} />
        <Sprout x={200} y={176} s={1.1} />
        <Kid x={62} y={186} s={0.9} pose="hold" shirt={C.yellowD} girl />
        <WateringCan x={74} y={158} s={0.8} />
        <Kid x={246} y={186} s={0.9} pose="wave" shirt={C.skyD} flip />
        <Tree x={290} y={150} s={0.8} fruit />
        <Bunny x={170} y={150} s={0.5} />
      </>
    )
  },
  {
    id: 'san-choi', group: 'trai-nghiem', title: 'Vui chơi ngoài trời',
    tags: ['ngoài trời', 'vận động', 'thể chất', 'sân chơi', 'trò chơi', 'thể thao'],
    bg: C.skyL,
    render: () => (
      <>
        <Cloud x={60} y={40} />
        <Cloud x={240} y={30} s={0.7} />
        <Sun x={280} y={60} r={11} />
        <Grass y={166} />
        <Slide x={110} y={172} s={1.4} />
        <Kid x={83} y={92} s={0.75} pose="up" shirt={C.peachD} girl />
        <Kid x={212} y={186} s={0.95} pose="up" shirt={C.leafD} />
        <Ball x={256} y={176} r={10} />
        <Kid x={290} y={188} s={0.8} pose="wave" shirt={C.yellowD} girl flip />
        <Flower x={30} y={172} s={0.7} />
      </>
    )
  },
  // ---------------- Sức khỏe và vệ sinh ----------------
  {
    id: 'rua-tay', group: 'suc-khoe', title: 'Bé rửa tay đúng cách',
    tags: ['rửa tay', 'vệ sinh', 'vệ sinh cá nhân', 'phòng bệnh', 'dịch bệnh', 'sức khỏe', 'xà phòng'],
    bg: C.skyL,
    render: () => (
      <>
        <rect x={0} y={150} width={320} height={50} fill={C.white} opacity={0.7} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} x={i * 40} y={60} width={38} height={88} fill={C.white} opacity={0.35} />)}
        <Sink x={128} y={180} s={1.3} />
        <Kid x={180} y={190} s={1.05} pose="point" shirt={C.peachD} girl flip />
        <Bubbles x={150} y={112} />
        <Bubbles x={112} y={102} />
        <rect x={86} y={104} width={16} height={22} rx={5} fill={C.leafD} />
        <rect x={91} y={96} width={6} height={9} rx={2} fill={C.greyD} />
        <Sparkle x={70} y={70} r={7} fill={C.skyD} />
        <Sparkle x={256} y={60} r={6} fill={C.skyD} />
        <Star x={60} y={120} r={6} />
      </>
    )
  },
  {
    id: 'dinh-duong', group: 'suc-khoe', title: 'Ăn đủ chất, lớn khỏe mạnh',
    tags: ['dinh dưỡng', 'ăn uống', 'rau củ', 'trái cây', 'sức khỏe', 'bữa ăn', 'thực đơn'],
    bg: C.leaf,
    render: () => (
      <>
        <rect x={0} y={162} width={320} height={38} fill={C.cream} />
        <Kid x={110} y={186} s={1.05} pose="up" shirt={C.skyD} />
        <Table x={196} y={186} w={130} />
        <Plate x={196} y={152} s={1.1} />
        <circle cx={250} cy={146} r={9} fill={C.red} />
        <path d="M250,137 q3,-5 6,-3" stroke={C.green} strokeWidth={2} fill="none" />
        <ellipse cx={150} cy={148} rx={6} ry={8} fill={C.yellowD} transform="rotate(30 150 148)" />
        <path d="M262,150 L272,128" stroke={C.peachD} strokeWidth={6} strokeLinecap="round" />
        <path d="M272,128 l-4,-6 M272,128 l5,-5" stroke={C.green} strokeWidth={2} strokeLinecap="round" />
        <Heart x={110} y={60} s={1.3} />
        <Star x={200} y={56} r={8} />
        <Bear x={40} y={192} s={0.7} />
      </>
    )
  },
  {
    id: 'an-toan', group: 'suc-khoe', title: 'Bé an toàn cùng bố mẹ',
    tags: ['an toàn', 'tai nạn', 'thương tích', 'giao thông', 'phòng tránh', 'nghỉ hè', 'bảo vệ'],
    bg: C.yellow,
    render: () => (
      <>
        <Cloud x={70} y={40} s={0.8} />
        <rect x={0} y={160} width={320} height={40} fill={C.greyD} />
        {[30, 80, 130, 180, 230, 280].map((sx) => <rect key={sx} x={sx} y={176} width={30} height={7} rx={2} fill={C.white} />)}
        <TrafficLight x={270} y={168} />
        <Parent x={140} y={170} s={1} pose="hand" shirt={C.skyD} />
        <Kid x={186} y={174} s={0.9} pose="down" shirt={C.peachD} girl />
        <G x={60} y={120}>
          <path d="M0,-30 L22,-22 L22,0 Q22,18 0,28 Q-22,18 -22,0 L-22,-22 Z" fill={C.leafD} />
          <path d="M-9,0 L-2,8 L11,-8" stroke={C.white} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </G>
        <Heart x={220} y={60} s={1} />
      </>
    )
  },
  // ---------------- Lễ hội và sự kiện ----------------
  {
    id: 'nghi-le', group: 'le-hoi', title: 'Lịch nghỉ lễ và các bé vui vẻ',
    tags: ['nghỉ lễ', 'nghỉ học', 'lịch', 'kỳ nghỉ', 'tết dương lịch', '30/4', '1/5', '2/9', 'quốc khánh', 'lịch học'],
    bg: C.skyL,
    render: () => (
      <>
        <Calendar x={160} y={110} s={1.6} day="Nghỉ" />
        <Kid x={70} y={186} s={1} pose="up" shirt={C.peachD} girl />
        <Kid x={250} y={186} s={1} pose="up" shirt={C.leafD} />
        <Balloon x={36} y={70} fill={C.pinkD} />
        <Balloon x={284} y={64} fill={C.yellowD} />
        <Balloon x={300} y={90} fill={C.sky} s={0.8} />
        <Confetti items={[[110, 40, C.pinkD, 20], [210, 30, C.yellowD, -30], [130, 150, C.sky, 40], [200, 160, C.peachD, -20], [96, 120, C.leafD, 60], [228, 128, C.purple, 10]]} />
        <Bunny x={160} y={196} s={0.6} />
      </>
    )
  },
  {
    id: 'trung-thu', group: 'le-hoi', title: 'Đêm hội trăng rằm',
    tags: ['trung thu', 'trăng rằm', 'đèn ông sao', 'lồng đèn', 'phá cỗ', 'rước đèn'],
    bg: '#d6dcf5',
    render: () => (
      <>
        <Moon x={250} y={52} r={24} />
        {[[40, 30], [90, 60], [150, 26], [196, 70], [300, 110]].map(([sx, sy], i) => <Sparkle key={i} x={sx} y={sy} r={4} fill={C.white} />)}
        <rect x={0} y={164} width={320} height={36} fill={C.purple} opacity={0.6} />
        <Kid x={90} y={190} s={1} pose="up" shirt={C.peachD} girl />
        <Lantern x={70} y={112} s={1} fill={C.red} />
        <Kid x={190} y={190} s={1} pose="wave" shirt={C.skyD} />
        <Lantern x={211} y={110} s={0.95} fill={C.yellowD} />
        <Bunny x={270} y={192} s={0.75} />
        <RoundLantern x={140} y={56} />
      </>
    )
  },
  {
    id: 'van-nghe', group: 'le-hoi', title: 'Ngày hội văn nghệ của bé',
    tags: ['lễ hội', 'sự kiện', 'văn nghệ', 'tổng kết', 'biểu diễn', 'ngày hội', '1/6', 'khai giảng', 'lễ'],
    bg: C.peach,
    render: () => (
      <>
        <rect x={20} y={20} width={280} height={150} rx={10} fill={C.cream} />
        <Bunting x1={20} x2={300} y={26} />
        <rect x={20} y={150} width={280} height={24} rx={4} fill={C.wood} />
        <Kid x={110} y={152} s={0.95} pose="up" shirt={C.pinkD} girl />
        <Kid x={160} y={152} s={0.95} pose="wave" shirt={C.skyD} />
        <Kid x={210} y={152} s={0.95} pose="up" shirt={C.yellowD} girl />
        <Balloon x={46} y={82} fill={C.pinkD} />
        <Balloon x={274} y={80} fill={C.skyD} />
        <Star x={160} y={58} r={9} />
        <Sparkle x={124} y={70} r={5} fill={C.peachD} />
        <Sparkle x={200} y={66} r={5} fill={C.leafD} />
        <Teacher x={292} y={192} s={0.6} pose="open" dress={C.leafD} flip />
      </>
    )
  },
  {
    id: 'tet', group: 'le-hoi', title: 'Bé vui đón Tết',
    tags: ['tết', 'tết nguyên đán', 'năm mới', 'xuân', 'lì xì', 'mai', 'đào'],
    bg: C.cream,
    render: () => (
      <>
        <RoundLantern x={40} y={44} />
        <RoundLantern x={280} y={44} />
        <Apricot x={70} y={176} s={1.6} />
        <rect x={0} y={170} width={320} height={30} fill={C.peach} />
        <Kid x={150} y={188} s={1} pose="hold" shirt={C.pinkD} girl />
        <RedEnvelope x={150} y={160} />
        <Kid x={214} y={188} s={1} pose="wave" shirt={C.yellowD} />
        <Cat x={268} y={192} s={0.75} />
        <Sparkle x={190} y={60} r={6} fill={C.yellowD} />
        <Sparkle x={120} y={70} r={5} fill={C.red} />
      </>
    )
  },
  // ---------------- STEAM và khám phá ----------------
  {
    id: 'steam-kham-pha', group: 'steam', title: 'Bé khám phá, thử nghiệm',
    tags: ['steam', 'khám phá', 'thí nghiệm', 'khoa học', 'quan sát', 'thử nghiệm', 'vật chìm', 'nổi'],
    bg: C.leaf,
    render: () => (
      <>
        <rect x={0} y={160} width={320} height={40} fill={C.cream} />
        <Table x={190} y={190} w={150} top={C.sky} />
        <Flask x={150} y={160} />
        <Flask x={236} y={160} />
        <Sprout x={196} y={160} s={0.9} />
        <Kid x={80} y={190} s={1.05} pose="point" shirt={C.yellowD} />
        <Magnifier x={112} y={120} s={1} r={-40} />
        <Bubbles x={152} y={110} />
        <Star x={250} y={50} r={8} />
        <Sparkle x={70} y={46} r={6} fill={C.skyD} />
        <Bunny x={290} y={194} s={0.6} />
      </>
    )
  },
  {
    id: 'steam-xay-dung', group: 'steam', title: 'Bé xây dựng và sáng tạo',
    tags: ['steam', 'xây dựng', 'lắp ghép', 'chế tạo', 'kỹ thuật', 'tên lửa', 'sáng tạo', 'hội thi'],
    bg: C.skyL,
    render: () => (
      <>
        <Gear x={46} y={46} r={14} fill={C.sky} />
        <Gear x={72} y={70} r={9} fill={C.yellowD} />
        <Rocket x={262} y={70} s={1.3} r={25} />
        <Sparkle x={228} y={40} r={5} fill={C.yellowD} />
        <rect x={0} y={170} width={320} height={30} fill={C.leaf} />
        <Blocks x={160} y={176} s={1.6} />
        <Kid x={86} y={190} s={1} pose="up" shirt={C.peachD} girl />
        <Kid x={236} y={190} s={1} pose="point" shirt={C.leafD} flip />
        <Bear x={290} y={196} s={0.6} />
      </>
    )
  }
];

export const getScene = (id) => SCENES.find((s) => s.id === id);

export function SceneArt({ id, className, svgRef }) {
  const sc = getScene(id) || SCENES[0];
  return (
    <SceneFrame bg={sc.bg} title={sc.title} className={className} svgRef={svgRef}>
      {sc.render()}
    </SceneFrame>
  );
}

// ---------------------------------------------------------------------------
// Hình banner trang chủ: cô giáo, các bé, thỏ, cầu vồng, mây, sao (nền trong suốt)
// ---------------------------------------------------------------------------
export function HeroArt({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 230" className={className} role="img" aria-label="Cô giáo và các bé">
      <Rainbow x={196} y={150} r={110} w={10} />
      <Cloud x={100} y={150} s={1.2} />
      <Cloud x={296} y={150} s={1.2} />
      <ellipse cx={196} cy={218} rx={160} ry={14} fill={C.leaf} />
      <Teacher x={196} y={214} s={1.45} pose="wave" dress={C.skyD} />
      <Kid x={120} y={220} s={1.12} pose="hold" shirt={C.peachD} girl />
      <Book x={120} y={186} s={0.75} cover={C.skyD} r={-8} />
      <Kid x={272} y={220} s={1.12} pose="up" shirt={C.leafD} />
      <Bunny x={326} y={224} s={0.8} />
      <Star x={52} y={50} r={8} />
      <Star x={330} y={34} r={6} fill={C.pinkD} />
      <Sparkle x={86} y={92} r={6} fill={C.white} />
      <Sparkle x={300} y={92} r={5} fill={C.white} />
      <Heart x={250} y={56} s={1.1} />
      <Flower x={40} y={200} s={0.8} />
      <Envelope x={40} y={150} s={0.8} />
    </svg>
  );
}

// Họa tiết nhỏ cho banner ở các trang con: cầu vồng, mây, sao
export function BannerDeco({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 90" className={className} aria-hidden="true">
      <Rainbow x={110} y={84} r={56} w={7} />
      <Cloud x={58} y={78} s={0.8} />
      <Cloud x={164} y={78} s={0.8} />
      <Star x={24} y={22} r={6} />
      <Star x={188} y={18} r={5} fill={C.pinkD} />
      <Sparkle x={110} y={14} r={5} fill={C.white} />
      <Heart x={150} y={34} s={0.8} />
    </svg>
  );
}
