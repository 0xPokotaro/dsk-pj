import type {ReactNode} from 'react';
import {ArrowMarker, OPS, SUBTEXT, SURFACE, TEXT} from '../KagaDiagramParts';

// JPYC コントラクトの外に何が必要かを示す図
// 左に JPYC コントラクト（できること・できないこと）、右にコントラクトの外で用意するものを置き、
// 「できないこと」の行から、それを補うものへ矢印を引く

const WIDTH = 860;

// 青を基調にする。サイトの primary（緑）とは分け、テーマ別に CSS 変数で切り替える
const STYLE = `
.jpyc-outside {
  --jpyc-accent: #2563eb;
  --jpyc-soft: #eef4ff;
  --jpyc-on-accent: #ffffff;
  --jpyc-muted: #f3f4f6;
  --jpyc-muted-bar: #6b7280;
  --jpyc-ng: #dc2626;
}
[data-theme='dark'] .jpyc-outside {
  --jpyc-accent: #6ea8ff;
  --jpyc-soft: #1a2538;
  --jpyc-on-accent: #0b1220;
  --jpyc-muted: #24262b;
  --jpyc-muted-bar: #4b5058;
  --jpyc-ng: #ff7a7a;
}
`;
const ACCENT = 'var(--jpyc-accent)';
const SOFT = 'var(--jpyc-soft)';
const ON_ACCENT = 'var(--jpyc-on-accent)';
const MUTED = 'var(--jpyc-muted)';
const MUTED_BAR = 'var(--jpyc-muted-bar)';
const NG = 'var(--jpyc-ng)';

const TOP = 12;
const BAR_H = 38;
const BOX_H = 300;
const HEIGHT = TOP + BOX_H + 12;

// 左：JPYC コントラクト、右：外に用意するもの。同じ幅で左右対称に置く
const GAP = 70;
const L_X = 10;
const L_W = (WIDTH - 20 - GAP) / 2;
const R_X = L_X + L_W + GAP;
const R_W = L_W;

const ROW_H = 40;
const PAD = 16;
const LABEL_CAN = TOP + BAR_H + 26;
const ROW_CAN = [LABEL_CAN + 10, LABEL_CAN + 10 + ROW_H + 8];
const LABEL_CANNOT = ROW_CAN[1] + ROW_H + 30;
const ROW_CANNOT = [LABEL_CANNOT + 10, LABEL_CANNOT + 10 + ROW_H + 8];

function Check({x, y}: {x: number; y: number}): ReactNode {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={9} fill={SUBTEXT} />
      <path d="M-4,0 L-1,3 L4.5,-3" fill="none" stroke={SURFACE} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function Cross({x, y}: {x: number; y: number}): ReactNode {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={9} fill={NG} />
      <path d="M-3.5,-3.5 L3.5,3.5 M3.5,-3.5 L-3.5,3.5" stroke={SURFACE} strokeWidth={2} strokeLinecap="round" />
    </g>
  );
}

function Lock({x, y, color}: {x: number; y: number; color: string}): ReactNode {
  return (
    <g transform={`translate(${x}, ${y})`} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round">
      <rect x={0} y={5} width={11} height={8} rx={1.5} fill={color} stroke="none" />
      <path d="M2.5,5 V3.5 A3,3 0 0 1 8.5,3.5 V5" />
    </g>
  );
}

// 文字幅の概算。全角は1文字分、半角は約0.6文字分として数える
function textWidth(text: string, size: number): number {
  return [...text].reduce((w, ch) => w + (ch.charCodeAt(0) < 0x100 ? size * 0.6 : size), 0);
}

function Header({x, w, fill, color, title, note, lock}: {x: number; w: number; fill: string; color: string; title: string; note?: string; lock?: boolean}): ReactNode {
  const id = `jpyc-outside-clip-${x}`;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={TOP} width={w} height={BOX_H} rx={14} />
        </clipPath>
      </defs>
      <rect x={x} y={TOP} width={w} height={BAR_H} fill={fill} clipPath={`url(#${id})`} />
      <text x={x + PAD} y={TOP + 25} fontSize={15} fontWeight={700} fill={color}>
        {title}
      </text>
      {lock && note && <Lock x={x + w - PAD - textWidth(note, 12) - 18} y={TOP + 12} color={color} />}
      <text x={x + w - PAD} y={TOP + 24.5} textAnchor="end" fontSize={12} fontWeight={600} fill={color}>
        {note}
      </text>
    </g>
  );
}

function SectionLabel({x, y, text}: {x: number; y: number; text: string}): ReactNode {
  return (
    <text x={x} y={y} fontSize={12} fontWeight={700} fill={SUBTEXT}>
      {text}
    </text>
  );
}

function LedgerRow({y, text, ng}: {y: number; text: string; ng?: boolean}): ReactNode {
  return (
    <g>
      <rect x={L_X + PAD} y={y} width={L_W - PAD * 2} height={ROW_H} rx={8} fill={SURFACE} stroke={ng ? NG : 'none'} strokeWidth={1.2} strokeDasharray={ng ? '4 3' : undefined} />
      {ng ? <Cross x={L_X + PAD + 22} y={y + ROW_H / 2} /> : <Check x={L_X + PAD + 22} y={y + ROW_H / 2} />}
      <text x={L_X + PAD + 42} y={y + ROW_H / 2 + 5} fontSize={13.5} fontWeight={700} fill={ng ? NG : TEXT}>
        {text}
      </text>
    </g>
  );
}

function NeedCard({y, title, sub}: {y: number; title: string; sub: string}): ReactNode {
  return (
    <g>
      <rect x={R_X + PAD} y={y} width={R_W - PAD * 2} height={ROW_H} rx={8} fill={SURFACE} stroke={ACCENT} strokeWidth={1.6} />
      <text x={R_X + PAD + 14} y={y + ROW_H / 2 + 5} fontSize={14} fontWeight={700} fill={TEXT}>
        {title}
        <tspan dx={12} fontSize={12} fontWeight={400} fill={SUBTEXT}>
          {sub}
        </tspan>
      </text>
    </g>
  );
}

export default function JpycFunctionsDiagram(): ReactNode {
  const arrowX1 = L_X + L_W - PAD;
  const arrowX2 = R_X + PAD;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      className="jpyc-outside"
      aria-label="JPYC コントラクトは送金と残高の記録はできるが、送金先の限定と配布分の区別はできない。そのため、利用先の制御と配布分の管理を、利用先制御の仕組みとして別に用意する"
      style={{width: '100%', maxWidth: WIDTH, height: 'auto'}}>
      <style>{STYLE}</style>
      <defs>
        <ArrowMarker id="jpyc-outside-arrow" color={ACCENT} />
        <ArrowMarker id="jpyc-outside-arrow-muted" color={OPS} />
      </defs>

      {/* 左：JPYC コントラクト */}
      <rect x={L_X} y={TOP} width={L_W} height={BOX_H} rx={14} fill={MUTED} stroke={MUTED_BAR} strokeWidth={1.4} />
      <Header x={L_X} w={L_W} fill={MUTED_BAR} color="#ffffff" title="JPYC コントラクト" note="発行元（JPYC社）が管理" lock />

      <SectionLabel x={L_X + PAD} y={LABEL_CAN} text="できること" />
      <LedgerRow y={ROW_CAN[0]} text="送金・引き落とし" />
      <LedgerRow y={ROW_CAN[1]} text="残高の記録（合計額のみ）" />

      <SectionLabel x={L_X + PAD} y={LABEL_CANNOT} text="できないこと" />
      <LedgerRow y={ROW_CANNOT[0]} text="送金先を限定する" ng />
      <LedgerRow y={ROW_CANNOT[1]} text="配布分を区別する" ng />

      {/* 右：外に用意するもの */}
      <rect x={R_X} y={TOP} width={R_W} height={BOX_H} rx={14} fill={SOFT} stroke={ACCENT} strokeWidth={1.8} />
      <Header x={R_X} w={R_W} fill={ACCENT} color={ON_ACCENT} title="利用先制御の仕組み" />

      <SectionLabel x={R_X + PAD} y={LABEL_CAN} text="そのまま使う" />
      <rect
        x={R_X + PAD}
        y={ROW_CAN[0]}
        width={R_W - PAD * 2}
        height={ROW_CAN[1] + ROW_H - ROW_CAN[0]}
        rx={8}
        fill="none"
        stroke={OPS}
        strokeWidth={1.2}
        strokeDasharray="5 4"
      />
      <text x={R_X + R_W / 2} y={(ROW_CAN[0] + ROW_CAN[1] + ROW_H) / 2 + 5} textAnchor="middle" fontSize={13} fill={SUBTEXT}>
        JPYC コントラクトの機能を使う
      </text>

      <SectionLabel x={R_X + PAD} y={LABEL_CANNOT} text="外で補う" />
      <NeedCard y={ROW_CANNOT[0]} title="利用先の制御" sub="地域事業者にだけ送れる" />
      <NeedCard y={ROW_CANNOT[1]} title="配布分の管理" sub="配布分の残りを記録" />

      {/* できること → そのまま使う */}
      {ROW_CAN.map((y) => (
        <line
          key={y}
          x1={arrowX1}
          y1={y + ROW_H / 2}
          x2={arrowX2 - 2}
          y2={y + ROW_H / 2}
          stroke={OPS}
          strokeWidth={1.4}
          strokeDasharray="5 4"
          markerEnd="url(#jpyc-outside-arrow-muted)"
        />
      ))}

      {/* できないこと → 外で補うもの */}
      {ROW_CANNOT.map((y) => (
        <line
          key={y}
          x1={arrowX1}
          y1={y + ROW_H / 2}
          x2={arrowX2 - 2}
          y2={y + ROW_H / 2}
          stroke={ACCENT}
          strokeWidth={2}
          markerEnd="url(#jpyc-outside-arrow)"
        />
      ))}
    </svg>
  );
}
