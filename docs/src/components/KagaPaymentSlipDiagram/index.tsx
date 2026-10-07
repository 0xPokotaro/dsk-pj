import type {ReactNode} from 'react';

type Box = {x: number; label: string; sublabel: string};

const WIDTH = 860;
const HEIGHT = 230;
const BOX_W = 180;
const BOX_H = 64;
const CY = 70;
const LOOP_Y = 180;

const boxes: Box[] = [
  {x: 100, label: '加賀市', sublabel: '加盟店'},
  {x: 430, label: 'e-加賀市民', sublabel: '市民アプリでJPYC償還も可'},
  {x: 760, label: 'DSK', sublabel: '日本円・収納データを受領'},
];

const stroke = 'var(--ifm-color-emphasis-700)';

const arrows = [
  {x1: 100 + BOX_W / 2, x2: 430 - BOX_W / 2, label: '払込票を送付'},
  {x1: 430 + BOX_W / 2, x2: 760 - BOX_W / 2, label: 'JPYCで支払い', sub: 'バーコードを読み取り'},
];

export default function KagaPaymentSlipDiagram(): ReactNode {
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="第二弾の払込票のステーブルコイン払いの流れ"
      style={{width: '100%', maxWidth: WIDTH, height: 'auto'}}>
      <defs>
        <marker id="slip-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={stroke} />
        </marker>
      </defs>
      {arrows.map((a) => (
        <g key={a.label}>
          <line x1={a.x1} y1={CY} x2={a.x2} y2={CY} stroke={stroke} strokeWidth={1.5} markerEnd="url(#slip-arrow)" />
          <text x={(a.x1 + a.x2) / 2} y={CY - 8} textAnchor="middle" fontSize={11} fill="var(--ifm-font-color-base)">
            {a.label}
          </text>
          {a.sub && (
            <text x={(a.x1 + a.x2) / 2} y={CY + 16} textAnchor="middle" fontSize={9.5} fill={stroke}>
              {a.sub}
            </text>
          )}
        </g>
      ))}
      <path
        d={`M760,${CY + BOX_H / 2} V${LOOP_Y} H100 V${CY + BOX_H / 2 + 2}`}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        markerEnd="url(#slip-arrow)"
      />
      <text x={430} y={LOOP_Y - 8} textAnchor="middle" fontSize={11} fill="var(--ifm-font-color-base)">
        日本円の送金・収納データの送信
      </text>
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
          <text x={b.x} y={CY - 4} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--ifm-font-color-base)">
            {b.label}
          </text>
          <text x={b.x} y={CY + 14} textAnchor="middle" fontSize={9.5} fill={stroke}>
            {b.sublabel}
          </text>
        </g>
      ))}
    </svg>
  );
}
