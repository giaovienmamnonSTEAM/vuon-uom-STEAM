/* ============ SVG FLOWER (S-T-E-A-M petals) ============ */
export function flowerSVG(size){
  const colors = ['#3E7CA6','#7A5FA3','#E07A3F','#C85482','#3F9469'];
  let petals = '';
  const cx=50, cy=50, r=22;
  for(let i=0;i<5;i++){
    const angle = (i/5)*2*Math.PI - Math.PI/2;
    const px = cx + Math.cos(angle)*r;
    const py = cy + Math.sin(angle)*r;
    petals += `<ellipse cx="${px}" cy="${py}" rx="15" ry="22" fill="${colors[i]}" opacity="0.92" transform="rotate(${(angle*180/Math.PI)+90} ${px} ${py})"/>`;
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    ${petals}
    <circle cx="50" cy="50" r="14" fill="#FBF6EC" stroke="#2E2A24" stroke-width="1.5"/>
    <text x="50" y="55" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="13" fill="#2E2A24">S</text>
  </svg>`;
}
