// Bộ "linh kiện" vẽ SVG dùng chung cho mọi hình minh họa của ứng dụng.
// Phong cách: hoạt hình 2D phẳng, bo tròn, màu pastel; không dùng gradient/id
// để nhiều hình trên cùng trang không xung đột, xuất PNG/SVG được khi ngoại tuyến.
// Quy ước: nhân vật và đồ vật vẽ quanh gốc (0,0) = chân/đáy ở giữa; đặt vị trí bằng x, y, s (tỉ lệ).

export const C = {
  sky: '#9dcdef', skyL: '#d8ecfa', skyD: '#4a97d4',
  cream: '#fffaf0', yellow: '#fde9a8', yellowD: '#f6c94c',
  peach: '#fdcfb4', peachD: '#f59e7a', pink: '#f7b3c2', pinkD: '#ec7f9b',
  leaf: '#cfeccf', leafD: '#86c98a', green: '#5aa65e',
  skin: '#f8d5bd', skin2: '#e9b48f', hair: '#3d2c2c', hair2: '#7a4a2a',
  line: '#4a3f55', white: '#ffffff', red: '#ef6f6c', purple: '#c3b3ef', purpleD: '#8f78d6',
  brown: '#b9875f', brownL: '#e7c49f', wood: '#e8b77f', grey: '#e9eef3', greyD: '#b8c4cf'
};

export const G = ({ x = 0, y = 0, s = 1, r = 0, children, ...rest }) => (
  <g transform={`translate(${x} ${y})${r ? ` rotate(${r})` : ''}${s !== 1 ? ` scale(${s})` : ''}`} {...rest}>
    {children}
  </g>
);

// ---------- Khuôn mặt ----------
function Face({ cy, w = 5, k = 1, blush = true }) {
  return (
    <g>
      <ellipse cx={-w} cy={cy} rx={1.7 * k} ry={2 * k} fill={C.line} />
      <ellipse cx={w} cy={cy} rx={1.7 * k} ry={2 * k} fill={C.line} />
      <circle cx={-w + 0.6} cy={cy - 0.7} r={0.55 * k} fill={C.white} />
      <circle cx={w + 0.6} cy={cy - 0.7} r={0.55 * k} fill={C.white} />
      <path d={`M${-3.6 * k},${cy + 5 * k} Q0,${cy + 8.6 * k} ${3.6 * k},${cy + 5 * k}`} stroke={C.line} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      {blush && (
        <>
          <ellipse cx={-w - 4 * k} cy={cy + 4 * k} rx={2.6 * k} ry={1.8 * k} fill={C.pinkD} opacity={0.45} />
          <ellipse cx={w + 4 * k} cy={cy + 4 * k} rx={2.6 * k} ry={1.8 * k} fill={C.pinkD} opacity={0.45} />
        </>
      )}
    </g>
  );
}

const ARM_POSES = {
  down: [[-17, -24], [17, -24]],
  wave: [[-17, -24], [21, -60]],
  up: [[-20, -60], [20, -60]],
  hold: [[-8, -32], [8, -32]],
  point: [[-17, -24], [24, -44]],
  hands: [[-6, -36], [6, -36]]
};

// ---------- Bé (cao ~74) ----------
export function Kid({ x = 0, y = 0, s = 1, girl = false, shirt = C.peachD, pants = C.skyD, skin = C.skin, hair = C.hair, pose = 'down', flip = false, children }) {
  const [l, rr] = ARM_POSES[pose] || ARM_POSES.down;
  return (
    <G x={x} y={y} s={s}>
      <g transform={flip ? 'scale(-1 1)' : undefined}>
        {/* chân */}
        <rect x={-9} y={-24} width={7} height={21} rx={3.5} fill={girl ? skin : pants} />
        <rect x={2} y={-24} width={7} height={21} rx={3.5} fill={girl ? skin : pants} />
        <ellipse cx={-5.5} cy={-2.5} rx={5.5} ry={3.2} fill={C.line} />
        <ellipse cx={5.5} cy={-2.5} rx={5.5} ry={3.2} fill={C.line} />
        {/* tay sau thân */}
        <line x1={-11} y1={-41} x2={l[0]} y2={l[1]} stroke={shirt} strokeWidth={7} strokeLinecap="round" />
        <circle cx={l[0]} cy={l[1]} r={3.8} fill={skin} />
        {/* thân */}
        {girl ? (
          <path d="M-11,-45 L11,-45 L16,-20 L-16,-20 Z" fill={shirt} stroke={shirt} strokeWidth={5} strokeLinejoin="round" />
        ) : (
          <rect x={-13} y={-46} width={26} height={25} rx={9} fill={shirt} />
        )}
        <path d="M-5,-45 L0,-40 L5,-45" stroke={C.white} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
        <line x1={11} y1={-41} x2={rr[0]} y2={rr[1]} stroke={shirt} strokeWidth={7} strokeLinecap="round" />
        <circle cx={rr[0]} cy={rr[1]} r={3.8} fill={skin} />
        {/* đầu */}
        {girl && (
          <>
            <circle cx={-17} cy={-58} r={6.5} fill={hair} />
            <circle cx={17} cy={-58} r={6.5} fill={hair} />
            <circle cx={-14} cy={-64} r={3} fill={C.pinkD} />
            <circle cx={14} cy={-64} r={3} fill={C.pinkD} />
          </>
        )}
        <circle cx={0} cy={-60} r={15.5} fill={skin} />
        <path d="M-15.8,-59 A15.8,15.8 0 0 1 15.8,-59 Q12,-66 4,-65 Q-2,-71 -8,-66 Q-13,-65 -15.8,-59 Z" fill={hair} />
        <Face cy={-58} />
        {children}
      </g>
    </G>
  );
}

// ---------- Cô giáo (cao ~104) ----------
export function Teacher({ x = 0, y = 0, s = 1, dress = C.skyD, skin = C.skin, hair = C.hair, pose = 'down', flip = false, glasses = false, children }) {
  const P = {
    down: [[-20, -30], [20, -30]],
    wave: [[-20, -30], [25, -88]],
    hold: [[-9, -44], [9, -44]],
    point: [[-20, -30], [30, -64]],
    open: [[-26, -50], [26, -50]]
  }[pose] || [[-20, -30], [20, -30]];
  return (
    <G x={x} y={y} s={s}>
      <g transform={flip ? 'scale(-1 1)' : undefined}>
        <rect x={-8} y={-16} width={6} height={14} rx={3} fill={skin} />
        <rect x={2} y={-16} width={6} height={14} rx={3} fill={skin} />
        <ellipse cx={-5} cy={-2.5} rx={6} ry={3} fill={C.line} />
        <ellipse cx={5} cy={-2.5} rx={6} ry={3} fill={C.line} />
        {/* tóc sau */}
        <rect x={-20} y={-100} width={40} height={36} rx={16} fill={hair} />
        <line x1={-12} y1={-62} x2={P[0][0]} y2={P[0][1]} stroke={dress} strokeWidth={7.5} strokeLinecap="round" />
        <circle cx={P[0][0]} cy={P[0][1]} r={4} fill={skin} />
        {/* váy chữ A */}
        <path d="M-12,-68 L12,-68 L23,-15 L-23,-15 Z" fill={dress} stroke={dress} strokeWidth={5} strokeLinejoin="round" />
        <path d="M-6,-68 L0,-60 L6,-68" fill={C.white} />
        <rect x={-23} y={-27} width={46} height={4} rx={2} fill={C.white} opacity={0.35} />
        <line x1={12} y1={-62} x2={P[1][0]} y2={P[1][1]} stroke={dress} strokeWidth={7.5} strokeLinecap="round" />
        <circle cx={P[1][0]} cy={P[1][1]} r={4} fill={skin} />
        <circle cx={0} cy={-82} r={16.5} fill={skin} />
        <path d="M-17,-81 A17,17 0 0 1 17,-81 Q14,-92 3,-92 Q-6,-99 -13,-91 Q-17,-87 -17,-81 Z" fill={hair} />
        <circle cx={13} cy={-97} r={6} fill={hair} />
        <Face cy={-80} w={5.5} />
        {glasses && (
          <g stroke={C.line} strokeWidth={1.3} fill="none">
            <circle cx={-5.5} cy={-80} r={4.2} />
            <circle cx={5.5} cy={-80} r={4.2} />
            <line x1={-1.3} y1={-80} x2={1.3} y2={-80} />
          </g>
        )}
        {children}
      </g>
    </G>
  );
}

// ---------- Phụ huynh (cao ~104) ----------
export function Parent({ x = 0, y = 0, s = 1, dad = false, shirt = C.leafD, pants = C.line, skin = C.skin2, hair = C.hair, pose = 'down', flip = false }) {
  const P = { down: [[-20, -32], [20, -32]], wave: [[-20, -32], [25, -88]], hold: [[-9, -46], [9, -46]], hand: [[-20, -32], [26, -40]] }[pose] || [[-20, -32], [20, -32]];
  return (
    <G x={x} y={y} s={s}>
      <g transform={flip ? 'scale(-1 1)' : undefined}>
        <rect x={-9} y={-34} width={8} height={32} rx={3.5} fill={dad ? pants : skin} />
        <rect x={1} y={-34} width={8} height={32} rx={3.5} fill={dad ? pants : skin} />
        <ellipse cx={-5} cy={-2.5} rx={6} ry={3} fill={C.line} />
        <ellipse cx={5} cy={-2.5} rx={6} ry={3} fill={C.line} />
        {!dad && <rect x={-19} y={-100} width={38} height={44} rx={15} fill={hair} />}
        <line x1={-13} y1={-62} x2={P[0][0]} y2={P[0][1]} stroke={shirt} strokeWidth={8} strokeLinecap="round" />
        <circle cx={P[0][0]} cy={P[0][1]} r={4} fill={skin} />
        {dad ? (
          <rect x={-15} y={-68} width={30} height={38} rx={10} fill={shirt} />
        ) : (
          <path d="M-12,-68 L12,-68 L18,-30 L-18,-30 Z" fill={shirt} stroke={shirt} strokeWidth={5} strokeLinejoin="round" />
        )}
        <line x1={13} y1={-62} x2={P[1][0]} y2={P[1][1]} stroke={shirt} strokeWidth={8} strokeLinecap="round" />
        <circle cx={P[1][0]} cy={P[1][1]} r={4} fill={skin} />
        <circle cx={0} cy={-82} r={16} fill={skin} />
        {dad ? (
          <path d="M-17,-80 Q-18.5,-100 0,-100 Q18.5,-100 17,-80 Q13,-90 0,-91 Q-13,-90 -17,-80 Z" fill={hair} />
        ) : (
          <path d="M-16.5,-80 A16.5,16.5 0 0 1 16.5,-80 Q10,-90 -2,-90 Q-12,-92 -16.5,-80 Z" fill={hair} />
        )}
        <Face cy={-80} w={5.5} />
      </g>
    </G>
  );
}

// ---------- Con vật ngồi (cao ~44) ----------
export function Bunny({ x = 0, y = 0, s = 1, color = C.white }) {
  return (
    <G x={x} y={y} s={s}>
      <ellipse cx={-5} cy={-46} rx={4.5} ry={12} fill={color} stroke={C.greyD} strokeWidth={1} />
      <ellipse cx={5} cy={-46} rx={4.5} ry={12} fill={color} stroke={C.greyD} strokeWidth={1} />
      <ellipse cx={-5} cy={-45} rx={2} ry={8} fill={C.pink} />
      <ellipse cx={5} cy={-45} rx={2} ry={8} fill={C.pink} />
      <ellipse cx={0} cy={-12} rx={13} ry={12} fill={color} stroke={C.greyD} strokeWidth={1} />
      <circle cx={0} cy={-28} r={11} fill={color} stroke={C.greyD} strokeWidth={1} />
      <ellipse cx={-3.5} cy={-29} rx={1.4} ry={1.7} fill={C.line} />
      <ellipse cx={3.5} cy={-29} rx={1.4} ry={1.7} fill={C.line} />
      <ellipse cx={0} cy={-25} rx={1.6} ry={1.1} fill={C.pinkD} />
      <ellipse cx={-7} cy={-25} rx={2} ry={1.4} fill={C.pinkD} opacity={0.4} />
      <ellipse cx={7} cy={-25} rx={2} ry={1.4} fill={C.pinkD} opacity={0.4} />
      <ellipse cx={-6} cy={-1.5} rx={5} ry={2.5} fill={color} stroke={C.greyD} strokeWidth={1} />
      <ellipse cx={6} cy={-1.5} rx={5} ry={2.5} fill={color} stroke={C.greyD} strokeWidth={1} />
    </G>
  );
}

export function Bear({ x = 0, y = 0, s = 1, color = C.brown }) {
  return (
    <G x={x} y={y} s={s}>
      <circle cx={-9} cy={-38} r={5} fill={color} />
      <circle cx={9} cy={-38} r={5} fill={color} />
      <circle cx={-9} cy={-38} r={2.5} fill={C.brownL} />
      <circle cx={9} cy={-38} r={2.5} fill={C.brownL} />
      <ellipse cx={0} cy={-12} rx={14} ry={13} fill={color} />
      <ellipse cx={0} cy={-11} rx={8} ry={8} fill={C.brownL} />
      <circle cx={0} cy={-29} r={12} fill={color} />
      <ellipse cx={0} cy={-25} rx={5.5} ry={4} fill={C.brownL} />
      <ellipse cx={0} cy={-26.5} rx={2} ry={1.4} fill={C.line} />
      <ellipse cx={-4.5} cy={-31} rx={1.5} ry={1.8} fill={C.line} />
      <ellipse cx={4.5} cy={-31} rx={1.5} ry={1.8} fill={C.line} />
      <ellipse cx={-6} cy={-1.5} rx={5.5} ry={3} fill={color} />
      <ellipse cx={6} cy={-1.5} rx={5.5} ry={3} fill={color} />
    </G>
  );
}

export function Cat({ x = 0, y = 0, s = 1, color = C.peachD }) {
  return (
    <G x={x} y={y} s={s}>
      <path d="M12,-6 Q26,-10 22,-26" stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" />
      <ellipse cx={0} cy={-11} rx={12} ry={11} fill={color} />
      <path d="M-10,-30 L-9,-43 L-2,-35 Z M10,-30 L9,-43 L2,-35 Z" fill={color} stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <circle cx={0} cy={-27} r={11} fill={color} />
      <ellipse cx={-4} cy={-28} rx={1.4} ry={2} fill={C.line} />
      <ellipse cx={4} cy={-28} rx={1.4} ry={2} fill={C.line} />
      <path d="M-1.4,-24 L1.4,-24 L0,-22.5 Z" fill={C.pinkD} />
      <g stroke={C.line} strokeWidth={0.8} strokeLinecap="round" opacity={0.6}>
        <line x1={-6} y1={-23} x2={-14} y2={-24} />
        <line x1={-6} y1={-21.5} x2={-14} y2={-20} />
        <line x1={6} y1={-23} x2={14} y2={-24} />
        <line x1={6} y1={-21.5} x2={14} y2={-20} />
      </g>
      <path d="M-5,-15 Q0,-11 5,-15" stroke={C.white} strokeWidth={2} fill="none" opacity={0.6} />
    </G>
  );
}

// ---------- Đồ vật trang trí ----------
export const Star = ({ x, y, r = 6, fill = C.yellowD, rot = 0 }) => {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rad = i % 2 ? r * 0.48 : r;
    pts.push(`${(Math.cos(a) * rad).toFixed(2)},${(Math.sin(a) * rad).toFixed(2)}`);
  }
  return <polygon points={pts.join(' ')} transform={`translate(${x} ${y}) rotate(${rot})`} fill={fill} stroke={fill} strokeWidth={r * 0.25} strokeLinejoin="round" />;
};

export const Sparkle = ({ x, y, r = 5, fill = C.yellowD }) => (
  <path transform={`translate(${x} ${y})`} d={`M0,${-r} Q${r * 0.18},${-r * 0.18} ${r},0 Q${r * 0.18},${r * 0.18} 0,${r} Q${-r * 0.18},${r * 0.18} ${-r},0 Q${-r * 0.18},${-r * 0.18} 0,${-r} Z`} fill={fill} />
);

export const Cloud = ({ x, y, s = 1, fill = C.white }) => (
  <G x={x} y={y} s={s}>
    <circle cx={-14} cy={0} r={10} fill={fill} />
    <circle cx={0} cy={-6} r={14} fill={fill} />
    <circle cx={15} cy={0} r={10} fill={fill} />
    <rect x={-24} y={0} width={49} height={10} rx={5} fill={fill} />
  </G>
);

export const Sun = ({ x, y, r = 14 }) => (
  <G x={x} y={y}>
    {Array.from({ length: 8 }).map((_, i) => (
      <line key={i} x1={0} y1={-r - 4} x2={0} y2={-r - 9} stroke={C.yellowD} strokeWidth={3} strokeLinecap="round" transform={`rotate(${i * 45})`} />
    ))}
    <circle r={r} fill={C.yellowD} />
    <circle cx={-4} cy={-2} r={1.4} fill={C.line} />
    <circle cx={4} cy={-2} r={1.4} fill={C.line} />
    <path d="M-3.5,3 Q0,6 3.5,3" stroke={C.line} strokeWidth={1.4} fill="none" strokeLinecap="round" />
  </G>
);

export const Rainbow = ({ x, y, r = 40, w = 7 }) => (
  <G x={x} y={y}>
    {[C.peachD, C.yellowD, C.leafD, C.sky, C.purple].map((c, i) => (
      <path key={c} d={`M${-(r - i * w)},0 A${r - i * w},${r - i * w} 0 0 1 ${r - i * w},0`} stroke={c} strokeWidth={w} fill="none" strokeLinecap="round" />
    ))}
  </G>
);

export const Flower = ({ x, y, s = 1, petal = C.pinkD, center = C.yellowD, stem = true }) => (
  <G x={x} y={y} s={s}>
    {stem && <line x1={0} y1={0} x2={0} y2={18} stroke={C.green} strokeWidth={2.5} strokeLinecap="round" />}
    {stem && <ellipse cx={5} cy={12} rx={5} ry={2.5} fill={C.leafD} transform="rotate(-30 5 12)" />}
    {[0, 72, 144, 216, 288].map((a) => (
      <ellipse key={a} cx={0} cy={-6} rx={4} ry={6} fill={petal} transform={`rotate(${a})`} />
    ))}
    <circle r={4} fill={center} />
  </G>
);

export const Heart = ({ x, y, s = 1, fill = C.pinkD }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M0,6 C-10,-2 -8,-10 -3,-10 C-1,-10 0,-8 0,-7 C0,-8 1,-10 3,-10 C8,-10 10,-2 0,6 Z" fill={fill} />
);

export const Grass = ({ y, w = 320, fill = C.leaf, dark = C.leafD }) => (
  <g>
    <path d={`M0,${y} Q${w * 0.25},${y - 10} ${w * 0.5},${y} T${w},${y} L${w},${y + 60} L0,${y + 60} Z`} fill={fill} />
    {Array.from({ length: Math.round(w / 40) }).map((_, i) => (
      <path key={i} d={`M${20 + i * 40},${y + 8} l3,-7 l3,7`} stroke={dark} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ))}
  </g>
);

export const Book = ({ x, y, s = 1, cover = C.skyD, open = false, r = 0 }) =>
  open ? (
    <G x={x} y={y} s={s} r={r}>
      <path d="M0,0 Q-10,-5 -22,-3 L-22,-26 Q-10,-28 0,-23 Z" fill={C.white} stroke={cover} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M0,0 Q10,-5 22,-3 L22,-26 Q10,-28 0,-23 Z" fill={C.white} stroke={cover} strokeWidth={2.5} strokeLinejoin="round" />
      <g stroke={C.greyD} strokeWidth={1.2} strokeLinecap="round">
        <line x1={-17} y1={-20} x2={-5} y2={-18} />
        <line x1={-17} y1={-14} x2={-5} y2={-12} />
        <line x1={5} y1={-18} x2={17} y2={-20} />
        <line x1={5} y1={-12} x2={17} y2={-14} />
      </g>
    </G>
  ) : (
    <G x={x} y={y} s={s} r={r}>
      <rect x={-14} y={-10} width={28} height={10} rx={2} fill={cover} />
      <rect x={-12} y={-8} width={25} height={6} rx={1} fill={C.white} />
      <rect x={-14} y={-10} width={5} height={10} rx={1.5} fill={C.line} opacity={0.15} />
    </G>
  );

export const Pencil = ({ x, y, s = 1, r = 0, body = C.yellowD }) => (
  <G x={x} y={y} s={s} r={r}>
    <rect x={-4} y={-30} width={8} height={26} rx={1.5} fill={body} />
    <rect x={-4} y={-34} width={8} height={5} rx={1.5} fill={C.pinkD} />
    <rect x={-4} y={-30} width={8} height={2.5} fill={C.greyD} />
    <path d="M-4,-4 L4,-4 L0,4 Z" fill={C.brownL} />
    <path d="M-1.4,1.2 L1.4,1.2 L0,4 Z" fill={C.line} />
  </G>
);

export const Balloon = ({ x, y, fill = C.pinkD, s = 1 }) => (
  <G x={x} y={y} s={s}>
    <path d="M0,14 Q-3,26 2,38" stroke={C.greyD} strokeWidth={1.2} fill="none" />
    <ellipse cx={0} cy={0} rx={10} ry={12.5} fill={fill} />
    <path d="M-2,12 L2,12 L0,15 Z" fill={fill} />
    <ellipse cx={-3.5} cy={-5} rx={2.5} ry={4} fill={C.white} opacity={0.5} />
  </G>
);

export const Bunting = ({ x1, x2, y, colors = [C.peachD, C.yellowD, C.leafD, C.sky, C.pinkD] }) => {
  const n = Math.max(3, Math.round((x2 - x1) / 18));
  const step = (x2 - x1) / n;
  return (
    <g>
      <path d={`M${x1},${y} Q${(x1 + x2) / 2},${y + 10} ${x2},${y}`} stroke={C.greyD} strokeWidth={1.2} fill="none" />
      {Array.from({ length: n }).map((_, i) => {
        const cx = x1 + step * (i + 0.5);
        const t = (i + 0.5) / n;
        const cy = y + 2 * t * (1 - t) * 10;
        return <path key={i} d={`M${cx - 6},${cy} L${cx + 6},${cy} L${cx},${cy + 11} Z`} fill={colors[i % colors.length]} />;
      })}
    </g>
  );
};

export const Tree = ({ x, y, s = 1, fruit = false }) => (
  <G x={x} y={y} s={s}>
    <rect x={-4} y={-30} width={8} height={30} rx={3} fill={C.brown} />
    <circle cx={0} cy={-42} r={18} fill={C.leafD} />
    <circle cx={-13} cy={-34} r={11} fill={C.leafD} />
    <circle cx={13} cy={-34} r={11} fill={C.leafD} />
    <circle cx={-5} cy={-48} r={6} fill={C.leaf} opacity={0.6} />
    {fruit && (
      <>
        <circle cx={-8} cy={-38} r={3} fill={C.red} />
        <circle cx={8} cy={-44} r={3} fill={C.red} />
        <circle cx={10} cy={-32} r={3} fill={C.red} />
      </>
    )}
  </G>
);

export const School = ({ x, y, s = 1 }) => (
  <G x={x} y={y} s={s}>
    <rect x={-60} y={-48} width={120} height={48} rx={4} fill={C.cream} stroke={C.peachD} strokeWidth={2} />
    <path d="M-68,-46 L0,-82 L68,-46 Z" fill={C.peachD} stroke={C.peachD} strokeWidth={4} strokeLinejoin="round" />
    <circle cx={0} cy={-58} r={9} fill={C.white} stroke={C.yellowD} strokeWidth={2.5} />
    <path d="M0,-58 L0,-63 M0,-58 L4,-56" stroke={C.line} strokeWidth={1.6} strokeLinecap="round" />
    <rect x={-12} y={-30} width={24} height={30} rx={11} fill={C.skyD} />
    <circle cx={6} cy={-14} r={1.6} fill={C.yellowD} />
    {[-46, -30, 22, 38].map((wx) => (
      <g key={wx}>
        <rect x={wx} y={-38} width={12} height={12} rx={2} fill={C.skyL} stroke={C.sky} strokeWidth={1.5} />
        <line x1={wx + 6} y1={-38} x2={wx + 6} y2={-26} stroke={C.sky} strokeWidth={1} />
      </g>
    ))}
    <line x1={52} y1={-82} x2={52} y2={-108} stroke={C.greyD} strokeWidth={2} />
    <path d="M52,-108 L68,-103 L52,-98 Z" fill={C.red} />
    <Star x={60} y={-103} r={2} fill={C.yellowD} />
  </G>
);

export const House = ({ x, y, s = 1, wall = C.yellow, roof = C.skyD }) => (
  <G x={x} y={y} s={s}>
    <rect x={-26} y={-34} width={52} height={34} rx={3} fill={wall} />
    <path d="M-32,-32 L0,-58 L32,-32 Z" fill={roof} stroke={roof} strokeWidth={4} strokeLinejoin="round" />
    <rect x={-7} y={-20} width={14} height={20} rx={6} fill={C.peachD} />
    <rect x={-21} y={-26} width={10} height={9} rx={2} fill={C.skyL} />
    <rect x={11} y={-26} width={10} height={9} rx={2} fill={C.skyL} />
    <Heart x={0} y={-40} s={0.6} fill={C.pinkD} />
  </G>
);

export const Calendar = ({ x, y, s = 1, day = '' }) => (
  <G x={x} y={y} s={s}>
    <rect x={-24} y={-48} width={48} height={48} rx={7} fill={C.white} stroke={C.greyD} strokeWidth={1.5} />
    <rect x={-24} y={-48} width={48} height={14} rx={7} fill={C.peachD} />
    <rect x={-24} y={-40} width={48} height={6} fill={C.peachD} />
    <rect x={-14} y={-53} width={4} height={9} rx={2} fill={C.line} />
    <rect x={10} y={-53} width={4} height={9} rx={2} fill={C.line} />
    {day ? (
      <text x={0} y={-11} textAnchor="middle" fontSize={20} fontWeight={700} fill={C.skyD} fontFamily="'Be Vietnam Pro', system-ui, sans-serif">{day}</text>
    ) : (
      [0, 1, 2].map((rr) => [0, 1, 2, 3].map((cc) => <circle key={`${rr}${cc}`} cx={-15 + cc * 10} cy={-24 + rr * 8} r={2.2} fill={rr === 1 && cc === 2 ? C.pinkD : C.greyD} />))
    )}
  </G>
);

export const Envelope = ({ x, y, s = 1, fill = C.yellow }) => (
  <G x={x} y={y} s={s}>
    <rect x={-22} y={-30} width={44} height={30} rx={4} fill={fill} stroke={C.yellowD} strokeWidth={1.5} />
    <path d="M-22,-28 L0,-12 L22,-28" stroke={C.yellowD} strokeWidth={2} fill="none" strokeLinejoin="round" />
    <Heart x={0} y={-12} s={0.7} fill={C.pinkD} />
  </G>
);

export const Bubble = ({ x, y, s = 1, fill = C.white, dots = true, tail = 'left' }) => (
  <G x={x} y={y} s={s}>
    <rect x={-22} y={-18} width={44} height={28} rx={12} fill={fill} stroke={C.sky} strokeWidth={1.5} />
    <path d={tail === 'left' ? 'M-12,9 L-16,18 L-4,10' : 'M12,9 L16,18 L4,10'} fill={fill} stroke={C.sky} strokeWidth={1.5} strokeLinejoin="round" />
    {dots && [-9, 0, 9].map((dx) => <circle key={dx} cx={dx} cy={-4} r={2.6} fill={C.skyD} />)}
  </G>
);

export const Megaphone = ({ x, y, s = 1, r = 0 }) => (
  <G x={x} y={y} s={s} r={r}>
    <rect x={-22} y={-8} width={10} height={16} rx={3} fill={C.skyD} />
    <path d="M-12,-8 L14,-20 L14,20 L-12,8 Z" fill={C.peachD} stroke={C.peachD} strokeWidth={3} strokeLinejoin="round" />
    <ellipse cx={14} cy={0} rx={4} ry={20} fill={C.yellowD} />
    <rect x={-10} y={8} width={6} height={12} rx={2} fill={C.skyD} />
    <path d="M24,-14 Q30,-7 30,0 M24,14 Q30,7 30,0 M22,0 L32,0" stroke={C.yellowD} strokeWidth={2.4} fill="none" strokeLinecap="round" />
  </G>
);

export const Camera = ({ x, y, s = 1 }) => (
  <G x={x} y={y} s={s}>
    <rect x={-22} y={-26} width={44} height={30} rx={7} fill={C.skyD} />
    <rect x={-10} y={-31} width={16} height={7} rx={2} fill={C.skyD} />
    <circle cx={2} cy={-11} r={10} fill={C.white} />
    <circle cx={2} cy={-11} r={6.5} fill={C.line} />
    <circle cx={4} cy={-13} r={2} fill={C.white} />
    <circle cx={-15} cy={-20} r={2.5} fill={C.yellowD} />
  </G>
);

export const Board = ({ x, y, s = 1, w = 64, h = 44 }) => (
  <G x={x} y={y} s={s}>
    <rect x={-w / 2 - 3} y={-h - 3} width={w + 6} height={h + 6} rx={5} fill={C.wood} />
    <rect x={-w / 2} y={-h} width={w} height={h} rx={3} fill={C.leaf} />
    <rect x={-w / 2 + 6} y={-h + 6} width={18} height={14} rx={2} fill={C.white} transform={`rotate(-4 ${-w / 2 + 15} ${-h + 13})`} />
    <rect x={2} y={-h + 7} width={22} height={16} rx={2} fill={C.yellow} transform={`rotate(5 13 ${-h + 15})`} />
    <rect x={-w / 2 + 10} y={-h + 25} width={26} height={12} rx={2} fill={C.peach} />
    <circle cx={-w / 2 + 15} cy={-h + 6} r={2} fill={C.red} />
    <circle cx={13} cy={-h + 7} r={2} fill={C.skyD} />
  </G>
);

export const Notebook = ({ x, y, s = 1, cover = C.leafD }) => (
  <G x={x} y={y} s={s}>
    <rect x={-22} y={-56} width={44} height={56} rx={5} fill={cover} />
    <rect x={-16} y={-52} width={36} height={48} rx={3} fill={C.white} />
    {[-44, -36, -28, -20, -12].map((ly) => <line key={ly} x1={-11} y1={ly} x2={15} y2={ly} stroke={C.sky} strokeWidth={1.4} strokeLinecap="round" />)}
    {[-50, -38, -26, -14].map((ry) => <circle key={ry} cx={-19} cy={ry} r={2.2} fill={C.greyD} />)}
  </G>
);

export const Lantern = ({ x, y, s = 1, fill = C.red }) => (
  <G x={x} y={y} s={s}>
    <line x1={0} y1={-34} x2={0} y2={-22} stroke={C.line} strokeWidth={1.2} />
    <Star x={0} y={-8} r={14} fill={fill} />
    <Star x={0} y={-8} r={6} fill={C.yellowD} />
    <path d="M-3,6 L0,16 L3,6" stroke={C.yellowD} strokeWidth={1.5} fill="none" />
  </G>
);

export const Moon = ({ x, y, r = 16 }) => (
  <G x={x} y={y}>
    <circle r={r} fill={C.yellow} />
    <circle cx={-5} cy={-4} r={3} fill={C.yellowD} opacity={0.5} />
    <circle cx={5} cy={5} r={2} fill={C.yellowD} opacity={0.5} />
  </G>
);

export const Blocks = ({ x, y, s = 1 }) => (
  <G x={x} y={y} s={s}>
    <rect x={-24} y={-16} width={16} height={16} rx={2} fill={C.peachD} />
    <rect x={-6} y={-16} width={16} height={16} rx={2} fill={C.skyD} />
    <rect x={12} y={-16} width={16} height={16} rx={2} fill={C.leafD} />
    <rect x={-15} y={-32} width={16} height={16} rx={2} fill={C.yellowD} />
    <rect x={3} y={-32} width={16} height={16} rx={2} fill={C.purple} />
    <path d="M-6,-32 L4,-48 L14,-32 Z" fill={C.pinkD} />
    <text x={-16} y={-4} fontSize={9} fontWeight={700} fill={C.white} textAnchor="middle" fontFamily="system-ui, sans-serif">A</text>
    <text x={2} y={-4} fontSize={9} fontWeight={700} fill={C.white} textAnchor="middle" fontFamily="system-ui, sans-serif">B</text>
    <text x={20} y={-4} fontSize={9} fontWeight={700} fill={C.white} textAnchor="middle" fontFamily="system-ui, sans-serif">C</text>
  </G>
);

export const Magnifier = ({ x, y, s = 1, r = -30 }) => (
  <G x={x} y={y} s={s} r={r}>
    <rect x={-3} y={10} width={6} height={20} rx={3} fill={C.peachD} />
    <circle r={12} fill={C.skyL} stroke={C.line} strokeWidth={3} />
    <path d="M-6,-4 A7,7 0 0 1 2,-8" stroke={C.white} strokeWidth={2.5} fill="none" strokeLinecap="round" />
  </G>
);

export const Rocket = ({ x, y, s = 1, r = 20 }) => (
  <G x={x} y={y} s={s} r={r}>
    <path d="M0,-30 Q12,-16 9,6 L-9,6 Q-12,-16 0,-30 Z" fill={C.white} stroke={C.greyD} strokeWidth={1.5} />
    <circle cx={0} cy={-10} r={4.5} fill={C.sky} stroke={C.skyD} strokeWidth={1.5} />
    <path d="M-9,0 L-16,10 L-9,8 Z M9,0 L16,10 L9,8 Z" fill={C.peachD} />
    <path d="M-5,7 Q0,22 5,7 Z" fill={C.yellowD} />
  </G>
);

export const Gear = ({ x, y, r = 12, fill = C.greyD }) => (
  <G x={x} y={y}>
    {Array.from({ length: 8 }).map((_, i) => (
      <rect key={i} x={-3} y={-r - 4} width={6} height={8} rx={1.5} fill={fill} transform={`rotate(${i * 45})`} />
    ))}
    <circle r={r} fill={fill} />
    <circle r={r * 0.4} fill={C.white} />
  </G>
);

export const Table = ({ x, y, w = 90, top = C.wood }) => (
  <G x={x} y={y}>
    <rect x={-w / 2} y={-30} width={w} height={7} rx={3} fill={top} />
    <rect x={-w / 2 + 6} y={-24} width={5} height={24} rx={2} fill={C.brown} />
    <rect x={w / 2 - 11} y={-24} width={5} height={24} rx={2} fill={C.brown} />
  </G>
);

export const Sink = ({ x, y, s = 1 }) => (
  <G x={x} y={y} s={s}>
    <rect x={-6} y={-40} width={12} height={40} rx={3} fill={C.greyD} />
    <path d="M-28,-48 L28,-48 Q26,-34 0,-34 Q-26,-34 -28,-48 Z" fill={C.white} stroke={C.greyD} strokeWidth={2} />
    <path d="M10,-48 L10,-62 Q10,-66 4,-66 L-2,-66" stroke={C.greyD} strokeWidth={4} fill="none" strokeLinecap="round" />
    <path d="M-2,-63 Q-4,-56 -2,-50" stroke={C.sky} strokeWidth={3} fill="none" strokeLinecap="round" />
  </G>
);

export const Bubbles = ({ x, y }) => (
  <G x={x} y={y}>
    {[[0, 0, 5], [10, -8, 3.5], [-9, -10, 4], [4, -18, 2.5], [-14, 2, 2.5], [14, 4, 3]].map(([bx, by, br], i) => (
      <circle key={i} cx={bx} cy={by} r={br} fill={C.skyL} stroke={C.sky} strokeWidth={1.2} />
    ))}
  </G>
);

export const Plate = ({ x, y, s = 1 }) => (
  <G x={x} y={y} s={s}>
    <ellipse cx={0} cy={0} rx={30} ry={10} fill={C.white} stroke={C.greyD} strokeWidth={1.5} />
    <ellipse cx={0} cy={-1} rx={22} ry={6.5} fill={C.cream} />
    <circle cx={-10} cy={-6} r={6} fill={C.red} />
    <path d="M-10,-12 q2,-3 4,-2" stroke={C.green} strokeWidth={1.5} fill="none" />
    <ellipse cx={3} cy={-5} rx={7} ry={4} fill={C.yellowD} />
    <circle cx={13} cy={-6} r={4} fill={C.leafD} />
    <circle cx={16} cy={-9} r={3.5} fill={C.green} />
  </G>
);

export const Backpack = ({ x, y, s = 1, fill = C.peachD }) => (
  <G x={x} y={y} s={s}>
    <path d="M-8,-30 Q0,-40 8,-30" stroke={C.line} strokeWidth={2.5} fill="none" />
    <rect x={-13} y={-30} width={26} height={30} rx={8} fill={fill} />
    <rect x={-9} y={-14} width={18} height={11} rx={4} fill={C.yellow} />
    <line x1={-4} y1={-14} x2={4} y2={-14} stroke={fill} strokeWidth={2} />
  </G>
);

export const Easel = ({ x, y, s = 1 }) => (
  <G x={x} y={y} s={s}>
    <line x1={-18} y1={0} x2={-8} y2={-60} stroke={C.brown} strokeWidth={3.5} strokeLinecap="round" />
    <line x1={18} y1={0} x2={8} y2={-60} stroke={C.brown} strokeWidth={3.5} strokeLinecap="round" />
    <rect x={-24} y={-58} width={48} height={38} rx={3} fill={C.white} stroke={C.wood} strokeWidth={3} />
    <circle cx={-10} cy={-44} r={6} fill={C.yellowD} />
    <path d="M-20,-24 Q-8,-36 2,-28 T22,-30 L22,-22 L-22,-22 Z" fill={C.leafD} />
    <Flower x={10} y={-36} s={0.45} petal={C.pinkD} stem={false} />
  </G>
);

export const Slide = ({ x, y, s = 1 }) => (
  <G x={x} y={y} s={s}>
    <line x1={-30} y1={0} x2={-30} y2={-56} stroke={C.skyD} strokeWidth={4} strokeLinecap="round" />
    <line x1={-14} y1={0} x2={-14} y2={-56} stroke={C.skyD} strokeWidth={4} strokeLinecap="round" />
    {[-12, -24, -36, -48].map((ly) => <line key={ly} x1={-30} y1={ly} x2={-14} y2={ly} stroke={C.skyD} strokeWidth={3} />)}
    <path d="M-14,-56 Q10,-50 18,-12 Q22,0 34,0" stroke={C.yellowD} strokeWidth={9} fill="none" strokeLinecap="round" />
  </G>
);

export const Ball = ({ x, y, r = 8 }) => (
  <G x={x} y={y}>
    <circle r={r} fill={C.peachD} />
    <path d={`M${-r},0 Q0,${-r * 0.6} ${r},0`} stroke={C.white} strokeWidth={2} fill="none" />
    <path d={`M0,${-r} Q${r * 0.5},0 0,${r}`} stroke={C.yellow} strokeWidth={2} fill="none" />
  </G>
);

export const WateringCan = ({ x, y, s = 1 }) => (
  <G x={x} y={y} s={s}>
    <rect x={-12} y={-18} width={24} height={18} rx={4} fill={C.skyD} />
    <path d="M12,-12 L26,-24" stroke={C.skyD} strokeWidth={4} strokeLinecap="round" />
    <path d="M-6,-18 Q0,-28 6,-18" stroke={C.skyD} strokeWidth={3} fill="none" />
    <circle cx={30} cy={-18} r={1.5} fill={C.sky} />
    <circle cx={32} cy={-13} r={1.5} fill={C.sky} />
    <circle cx={28} cy={-11} r={1.5} fill={C.sky} />
  </G>
);

export const Sprout = ({ x, y, s = 1 }) => (
  <G x={x} y={y} s={s}>
    <path d="M-12,0 L12,0 L9,-12 L-9,-12 Z" fill={C.peachD} />
    <line x1={0} y1={-12} x2={0} y2={-26} stroke={C.green} strokeWidth={2.5} />
    <ellipse cx={-6} cy={-26} rx={7} ry={4} fill={C.leafD} transform="rotate(-25 -6 -26)" />
    <ellipse cx={6} cy={-28} rx={7} ry={4} fill={C.leafD} transform="rotate(25 6 -28)" />
  </G>
);

export const Apricot = ({ x, y, s = 1 }) => (
  <G x={x} y={y} s={s}>
    <path d="M0,0 Q-6,-20 -2,-40 M-3,-24 Q-14,-30 -18,-40 M-1,-32 Q8,-40 14,-50" stroke={C.brown} strokeWidth={2.5} fill="none" strokeLinecap="round" />
    {[[-2, -40], [-18, -40], [14, -50], [-10, -32], [6, -44]].map(([fx, fy], i) => (
      <Flower key={i} x={fx} y={fy} s={0.5} petal={C.yellowD} center={C.peachD} stem={false} />
    ))}
  </G>
);
