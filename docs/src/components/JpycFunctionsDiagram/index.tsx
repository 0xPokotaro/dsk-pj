import type {ReactNode} from 'react';
import {ArrowMarker, OPS, SUBTEXT, SURFACE, TEXT} from '../KagaDiagramParts';

// 利用先制御に必要な機能を軸に、それぞれを何が担うかを示す図
// 上段：左に必要な機能、右に担い手（JPYC コントラクト／利用先制御の仕組み）。2つずつまとめて矢印でつなぐ
// 下段：④「配布分を区別する」の補足。④の行から線を引き、ユーザーの残高が2種類あり、JPYC コントラクトは合計しか記録しないことを示す

const WIDTH = 860;

// 青は「別に用意する」側（③④とその担い手）だけに使い、JPYC コントラクト側は灰色にする。
// サイトの primary（緑）とは分け、テーマ別に CSS 変数で切り替える
const STYLE = `
.jpyc-outside {
  --jpyc-accent: #2563eb;
  --jpyc-soft: #eef4ff;
  --jpyc-on-accent: #ffffff;
  --jpyc-muted: #f3f4f6;
  --jpyc-muted-bar: #6b7280;
  --jpyc-line: #d4d8de;
}
[data-theme='dark'] .jpyc-outside {
  --jpyc-accent: #6ea8ff;
  --jpyc-soft: #1a2538;
  --jpyc-on-accent: #0b1220;
  --jpyc-muted: #24262b;
  --jpyc-muted-bar: #6b7078;
  --jpyc-line: #3a3e46;
}
`;
const ACCENT = 'var(--jpyc-accent)';
const SOFT = 'var(--jpyc-soft)';
const ON_ACCENT = 'var(--jpyc-on-accent)';
const MUTED = 'var(--jpyc-muted)';
const MUTED_BAR = 'var(--jpyc-muted-bar)';
const LINE = 'var(--jpyc-line)';

const TOP = 8;
const BAR_H = 32;
const PAD = 16;

// 上段：左に必要な機能、右に担い手。間の余白で矢印をまとめる
const L_X = 10;
const L_W = 440;
const R_X = 570;
const R_W = WIDTH - 10 - R_X;
const JOIN_X = L_X + L_W + 40;

// 機能の行。JPYC でできる2つと、できない2つの間を少し空ける
const ROW_H = 34;
const ROW_GAP = 6;
const GROUP_GAP = 14;
const ROW_Y0 = TOP + BAR_H + 10;
const ROWS_CAN = [ROW_Y0, ROW_Y0 + ROW_H + ROW_GAP];
const ROWS_CANNOT = [ROWS_CAN[1] + ROW_H + GROUP_GAP, ROWS_CAN[1] + ROW_H + GROUP_GAP + ROW_H + ROW_GAP];
const BOX_H = ROWS_CANNOT[1] + ROW_H + 10 - TOP;

// 下段：④の補足の枠。補足なので灰色で控えめにする。番号の丸は上の行の丸と同じ x に置いて線でつなぐ
const NO_X = L_X + PAD + 22;
const PANEL_X = L_X;
const PANEL_W = WIDTH - 20;
const PANEL_Y = TOP + BOX_H + 24;
const PANEL_HEAD_CY = PANEL_Y + 20;

// 枠の中は2行で比べる。上：JPYC コントラクトは合計だけ、下：利用先制御の仕組みは配布分とそれ以外に分けて記録する
const CMP_LABEL_X = L_X + PAD;
const CMP_X = L_X + PAD + 120;
const CMP_W = PANEL_X + PANEL_W - PAD - CMP_X;
const CMP_H = 24;
const CMP_Y = [PANEL_Y + 38, PANEL_Y + 38 + CMP_H + 8];
const DIST_W = Math.round(CMP_W * 0.6);
const PANEL_H = CMP_Y[1] + CMP_H + 14 - PANEL_Y;
const HEIGHT = PANEL_Y + PANEL_H + 8;

// own は「別に用意する」機能。青で示し、JPYC コントラクトでできる機能は灰色にする
function FunctionRow({y, no, title, sub, own}: {y: number; no: number; title: string; sub: string; own?: boolean}): ReactNode {
  const x = L_X + PAD;
  const cy = y + ROW_H / 2;
  return (
    <g>
      <rect x={x} y={y} width={L_W - PAD * 2} height={ROW_H} rx={7} fill={SURFACE} stroke={own ? ACCENT : LINE} strokeWidth={own ? 1.4 : 1.2} />
      <circle cx={x + 22} cy={cy} r={9.5} fill={own ? ACCENT : MUTED_BAR} />
      <text x={x + 22} y={cy + 4} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={own ? ON_ACCENT : '#ffffff'}>
        {no}
      </text>
      <text x={x + 40} y={cy + 4.5} fontSize={13.5} fontWeight={700} fill={TEXT}>
        {title}
        <tspan dx={10} fontSize={12} fontWeight={400} fill={SUBTEXT}>
          {sub}
        </tspan>
      </text>
    </g>
  );
}

function OwnerCard({rows, fill, stroke, strokeWidth, subColor, title, sub}: {rows: number[]; fill: string; stroke: string; strokeWidth: number; subColor: string; title: string; sub: string}): ReactNode {
  const y = rows[0];
  const h = rows[1] + ROW_H - rows[0];
  const cx = R_X + R_W / 2;
  return (
    <g>
      <rect x={R_X} y={y} width={R_W} height={h} rx={12} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      <text x={cx} y={y + h / 2 - 3} textAnchor="middle" fontSize={14} fontWeight={700} fill={TEXT}>
        {title}
      </text>
      <text x={cx} y={y + h / 2 + 16} textAnchor="middle" fontSize={12} fontWeight={600} fill={subColor}>
        {sub}
      </text>
    </g>
  );
}

// 2つの機能の行から出た線を1本にまとめ、担い手のカードへ矢印を引く
function Connector({rows, color, dashed, marker}: {rows: number[]; color: string; dashed?: boolean; marker: string}): ReactNode {
  const x1 = L_X + L_W - PAD;
  const [y1, y2] = rows.map((y) => y + ROW_H / 2);
  const mid = (y1 + y2) / 2;
  return (
    <g fill="none" stroke={color} strokeWidth={dashed ? 1.4 : 2} strokeDasharray={dashed ? '5 4' : undefined}>
      <path d={`M${x1},${y1} H${JOIN_X} V${y2} H${x1}`} strokeLinejoin="round" />
      <line x1={JOIN_X} y1={mid} x2={R_X - 2} y2={mid} markerEnd={`url(#${marker})`} />
    </g>
  );
}

function CompareLabel({y, text}: {y: number; text: string}): ReactNode {
  return (
    <text x={CMP_LABEL_X} y={y + CMP_H / 2 + 4} fontSize={11.5} fontWeight={600} fill={SUBTEXT}>
      {text}
    </text>
  );
}

function BalanceNote(): ReactNode {
  const [y1, y2] = CMP_Y;
  const distEnd = CMP_X + DIST_W;
  const restCx = (distEnd + 4 + CMP_X + CMP_W) / 2;
  return (
    <g>
      {/* ④の行から補足の枠へ */}
      <line x1={NO_X} y1={ROWS_CANNOT[1] + ROW_H} x2={NO_X} y2={PANEL_HEAD_CY - 9} stroke={OPS} strokeWidth={1.2} strokeDasharray="4 3" />

      <rect x={PANEL_X} y={PANEL_Y} width={PANEL_W} height={PANEL_H} rx={12} fill={MUTED} />
      <circle cx={NO_X} cy={PANEL_HEAD_CY} r={9} fill={MUTED_BAR} />
      <text x={NO_X} y={PANEL_HEAD_CY + 3.5} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="#ffffff">
        4
      </text>
      <text x={NO_X + 16} y={PANEL_HEAD_CY + 4} fontSize={12} fontWeight={700} fill={SUBTEXT}>
        「配布分を区別する」とは
        <tspan dx={10} fontWeight={400}>
          ユーザーの残高の記録のしかた
        </tspan>
      </text>

      {/* JPYC コントラクト：合計だけ */}
      <CompareLabel y={y1} text="JPYC コントラクト" />
      <rect x={CMP_X} y={y1} width={CMP_W} height={CMP_H} rx={5} fill={SURFACE} stroke={LINE} strokeWidth={1} />
      <text x={CMP_X + CMP_W / 2} y={y1 + CMP_H / 2 + 4} textAnchor="middle" fontSize={11.5} fill={SUBTEXT}>
        合計だけ（配布分とそれ以外を区別できない）
      </text>

      {/* 利用先制御の仕組み：配布分とそれ以外に分ける */}
      <CompareLabel y={y2} text="利用先制御の仕組み" />
      <rect x={CMP_X} y={y2} width={DIST_W} height={CMP_H} rx={5} fill={SOFT} stroke={ACCENT} strokeWidth={1} />
      <text x={CMP_X + DIST_W / 2} y={y2 + CMP_H / 2 + 4} textAnchor="middle" fontSize={11.5} fontWeight={600} fill={TEXT}>
        配布分の JPYC
      </text>
      <rect x={distEnd + 4} y={y2} width={CMP_W - DIST_W - 4} height={CMP_H} rx={5} fill={SURFACE} stroke={LINE} strokeWidth={1} />
      <text x={restCx} y={y2 + CMP_H / 2 + 4} textAnchor="middle" fontSize={11.5} fill={SUBTEXT}>
        それ以外の JPYC
      </text>
    </g>
  );
}

export default function JpycFunctionsDiagram(): ReactNode {
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      className="jpyc-outside"
      aria-label="利用先制御に必要な機能は、送金、残高の記録、送金先の限定、配布分の区別の4つ。送金と残高の記録は JPYC コントラクトでできるので、そのまま使う。送金先の限定と配布分の区別は JPYC コントラクトではできないので、利用先制御の仕組みとして別に用意する。ユーザーの残高は配布分とそれ以外の2種類があり、JPYC コントラクトは合計だけを記録するため、配布分は利用先制御の仕組みで記録する"
      style={{width: '100%', maxWidth: WIDTH, height: 'auto'}}>
      <style>{STYLE}</style>
      <defs>
        <ArrowMarker id="jpyc-outside-arrow" color={ACCENT} />
        <ArrowMarker id="jpyc-outside-arrow-muted" color={OPS} />
        <clipPath id="jpyc-outside-clip">
          <rect x={L_X} y={TOP} width={L_W} height={BOX_H} rx={14} />
        </clipPath>
      </defs>

      {/* 左：利用先制御に必要な機能（軸） */}
      {/* メインなので、青の見出し帯と枠で補足より目立たせる */}
      <rect x={L_X} y={TOP} width={L_W} height={BOX_H} rx={14} fill={SOFT} stroke={ACCENT} strokeWidth={1.8} />
      <rect x={L_X} y={TOP} width={L_W} height={BAR_H} fill={ACCENT} clipPath="url(#jpyc-outside-clip)" />
      <text x={L_X + PAD} y={TOP + 21} fontSize={14} fontWeight={700} fill={ON_ACCENT}>
        利用先制御に必要な機能
      </text>

      <FunctionRow y={ROWS_CAN[0]} no={1} title="送金" sub="transfer" />
      <FunctionRow y={ROWS_CAN[1]} no={2} title="残高の記録" sub="合計額のみ（balanceOf）" />
      <FunctionRow y={ROWS_CANNOT[0]} no={3} title="送金先を限定する" sub="地域事業者にだけ送れる" own />
      <FunctionRow y={ROWS_CANNOT[1]} no={4} title="配布分を区別する" sub="配布分の残りを記録" own />

      {/* 機能 → 担い手 */}
      <Connector rows={ROWS_CAN} color={OPS} dashed marker="jpyc-outside-arrow-muted" />
      <Connector rows={ROWS_CANNOT} color={ACCENT} marker="jpyc-outside-arrow" />

      {/* 右：担い手 */}
      <OwnerCard rows={ROWS_CAN} fill={MUTED} stroke={LINE} strokeWidth={1.2} subColor={SUBTEXT} title="JPYC コントラクト" sub="JPYC でできるので、そのまま使う" />
      <OwnerCard rows={ROWS_CANNOT} fill={SOFT} stroke={ACCENT} strokeWidth={1.6} subColor={ACCENT} title="利用先制御の仕組み" sub="JPYC でできないので、別に用意する" />

      {/* 下段：④の補足（残高の2種類） */}
      <BalanceNote />
    </svg>
  );
}
