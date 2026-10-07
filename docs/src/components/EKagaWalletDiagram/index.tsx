import type {ReactNode} from 'react';

type Box = {x: number; label: string; sublabel: string};

const WIDTH = 860;
const HEIGHT = 140;
const BOX_W = 200;
const BOX_H = 72;
const CY = 70;

const boxes: Box[] = [
  {x: 120, label: 'NFT販売サイト', sublabel: 'nft.kaga-e-residency.jp'},
  {x: 430, label: 'Torus Wallet', sublabel: 'Googleまたはメールで作成'},
  {x: 740, label: 'Polygon', sublabel: 'Kaga-e-Residency_2026（ERC-721）'},
];

const links = [
  {from: 120 + BOX_W / 2, to: 430 - BOX_W / 2},
  {from: 430 + BOX_W / 2, to: 740 - BOX_W / 2},
];

export default function EKagaWalletDiagram(): ReactNode {
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="NFT販売サイト、Torus Wallet、Polygonの接続関係"
      style={{width: '100%', maxWidth: WIDTH, height: 'auto'}}>
      <defs>
        <marker id="ekaga-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--ifm-color-emphasis-700)" />
        </marker>
        <marker id="ekaga-arrow-start" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M10,0 L0,5 L10,10 z" fill="var(--ifm-color-emphasis-700)" />
        </marker>
      </defs>
      {links.map((l) => (
        <g key={l.from}>
          <line
            x1={l.from}
            y1={CY}
            x2={l.to}
            y2={CY}
            stroke="var(--ifm-color-emphasis-700)"
            strokeWidth={1.5}
            markerEnd="url(#ekaga-arrow)"
            markerStart="url(#ekaga-arrow-start)"
          />
          <text x={(l.from + l.to) / 2} y={CY - 8} textAnchor="middle" fontSize={11} fill="var(--ifm-font-color-base)">
            接続
          </text>
        </g>
      ))}
      {boxes.map((b) => (
        <g key={b.label}>
          <rect
            x={b.x - BOX_W / 2}
            y={CY - BOX_H / 2}
            width={BOX_W}
            height={BOX_H}
            rx={8}
            fill="var(--ifm-background-surface-color)"
            stroke="var(--ifm-color-primary)"
            strokeWidth={1.5}
          />
          <text x={b.x} y={CY - 4} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--ifm-font-color-base)">
            {b.label}
          </text>
          <text x={b.x} y={CY + 15} textAnchor="middle" fontSize={9.5} fill="var(--ifm-color-emphasis-700)">
            {b.sublabel}
          </text>
        </g>
      ))}
    </svg>
  );
}
