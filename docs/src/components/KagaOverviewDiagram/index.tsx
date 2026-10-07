import type {ReactNode} from 'react';
import {
  ArrowMarker,
  FLOW,
  IconTile,
  LANE,
  OPS,
  SUBTEXT,
  SURFACE,
  TEXT,
  WalletGlyph,
  YEN_STYLE,
  type IconKind,
} from '@site/src/components/KagaDiagramParts';

/*
 * 第一弾の全体像（円 → JPYC → 配布 → 支払い → 円転 の最小ループと、それを支える体制）
 * - 凡例
 * - 中央の列：ユーザー → e-加賀市民でウォレット連携 → 市民証かつJPKI → JPYC配布対象者
 * - 列の左右：株式会社JPYC（発行・償還）。列を横切らない
 * - 下：運営体制（詳細は体制図 KagaRolesDiagram）
 * 手順の詳細は業務フロー図（KagaFlowDiagram）で示す
 */

const WIDTH = 900;

const COL = [172, 450, 728];
const CARD_W = 180;
const CARD_H = 142;
const CARD_TOP = 362;
const CARD_BOTTOM = CARD_TOP + CARD_H;
const FOOTER_H = 32;
const CARD_R = 12;

/** ユーザーから配布対象者まで。JPYCの帯はこの列の外に置く。 */
const PATH_X = 280;
const PATH_W = 360;
const PATH_TOP = 38;
const PATH_CX = 450;

const USER_TOP = 48;
const USER_H = 38;
const COND_TOP = 204;
const COND_H = 48;

const JPYC_TOP = 264;
const JPYC_H = 50;
const JPYC_BOTTOM = JPYC_TOP + JPYC_H;
const JPYC_LEFT_W = PATH_X - 24;
const JPYC_RIGHT_X = PATH_X + PATH_W + 8;

const CHIP_W = 176;
const CHIP_H = 60;
const BAND_TOP = 558;
const CHIP_TOP = 590;
const BAND_H = CHIP_TOP + CHIP_H + 14 - BAND_TOP;
const HEIGHT = BAND_TOP + BAND_H + 10;

const RAIL_Y = CARD_BOTTOM + 28;

const STYLE = `
${YEN_STYLE}
.kaga-ov-link { cursor: pointer; }
.kaga-ov-link text { fill: var(--ifm-color-primary); }
.kaga-ov-link:hover text { text-decoration: underline; }
.kaga-ov-link:focus-visible rect { stroke-width: 2.4; }
`;

type MoneyActor = {
  x: number;
  icon: IconKind;
  name: string[];
  role: string;
  wallet: string;
  walletNote?: string;
  no?: number;
};

const actors: MoneyActor[] = [
  {
    x: COL[0],
    icon: 'org',
    name: ['一般社団法人', '加賀国家戦略特区推進機構'],
    role: '実施主体',
    wallet: '法人ウォレット',
    no: 1,
  },
  {
    x: COL[1],
    icon: 'person',
    name: ['e-加賀市民'],
    role: 'JPYC配布対象者',
    wallet: '連携したウォレット',
    walletNote: 'e-加賀市民で連携',
  },
  {
    x: COL[2],
    icon: 'shop',
    name: ['地域事業者'],
    role: '受取側',
    wallet: '法人ウォレット',
    no: 2,
  },
];

type OpsChip = {x: number; icon: IconKind; name: string; role: string; note?: string};

const chips: OpsChip[] = [
  {x: COL[0], icon: 'cityhall', name: '加賀市', role: '委託元'},
  {x: COL[1], icon: 'org', name: 'CORGEAR', role: '運営実務', note: 'ウォレット未定'},
  {x: COL[2], icon: 'org', name: 'DSK', role: '依頼元'},
];

function LegendItem({x, y, color, className, dashed, label}: {x: number; y: number; color?: string; className?: string; dashed?: boolean; label: string}): ReactNode {
  return (
    <g>
      <line
        x1={x}
        y1={y}
        x2={x + 22}
        y2={y}
        stroke={className ? undefined : color}
        className={className}
        strokeWidth={2.4}
        strokeDasharray={dashed ? '5 3.5' : undefined}
        strokeLinecap="butt"
      />
      <text x={x + 28} y={y + 4} fontSize={12} fill={SUBTEXT}>
        {label}
      </text>
    </g>
  );
}

function WalletFooter({x, label, no}: {x: number; label: string; no?: number}): ReactNode {
  const x0 = x - CARD_W / 2;
  const y = CARD_BOTTOM - FOOTER_H;
  const r = CARD_R;
  const d = `M${x0},${y} H${x0 + CARD_W} V${y + FOOTER_H - r} Q${x0 + CARD_W},${y + FOOTER_H} ${x0 + CARD_W - r},${y + FOOTER_H} H${x0 + r} Q${x0},${y + FOOTER_H} ${x0},${y + FOOTER_H - r} Z`;
  const textW = 12 * label.length;
  const noR = 8;
  const contentW = 22 + 8 + textW + (no ? noR * 2 + 6 : 0);
  const start = x - contentW / 2;
  const cy = y + FOOTER_H / 2 + 1;
  const noCx = start + 30 + textW + 6 + noR;
  return (
    <g>
      <path d={d} fill={LANE} />
      <line x1={x0} y1={y} x2={x0 + CARD_W} y2={y} stroke={FLOW} strokeWidth={1} strokeOpacity={0.35} />
      <WalletGlyph x={start} y={cy - 8} />
      <text x={start + 30} y={cy + 4} fontSize={12} fontWeight={700} fill={TEXT}>
        {label}
      </text>
      {no && (
        <g>
          <circle cx={noCx} cy={cy} r={noR} fill="none" stroke={TEXT} strokeWidth={1.3} />
          <text x={noCx} y={cy + 3.5} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={TEXT}>
            {no}
          </text>
        </g>
      )}
    </g>
  );
}

function MoneyCard({a}: {a: MoneyActor}): ReactNode {
  const x0 = a.x - CARD_W / 2;
  const nameY = CARD_TOP + 56;
  const roleY = nameY + (a.name.length - 1) * 16 + 18;
  return (
    <g>
      <rect x={x0} y={CARD_TOP} width={CARD_W} height={CARD_H} rx={CARD_R} fill={SURFACE} />
      <IconTile x={a.x} cy={CARD_TOP + 22} size={30} kind={a.icon} />
      <text x={a.x} y={nameY} textAnchor="middle" fontSize={a.name.some((l) => l.length > 8) ? 12 : 14} fontWeight={700} fill={TEXT}>
        {a.name.map((l, i) => (
          <tspan key={l} x={a.x} dy={i === 0 ? 0 : 15}>
            {l}
          </tspan>
        ))}
      </text>
      <text x={a.x} y={roleY} textAnchor="middle" fontSize={11.5} fill={SUBTEXT}>
        {a.role}
      </text>
      {a.walletNote && (
        <text x={a.x} y={roleY + 20} textAnchor="middle" fontSize={10} fill={SUBTEXT}>
          （{a.walletNote}）
        </text>
      )}
      <WalletFooter x={a.x} label={a.wallet} no={a.no} />
      <rect x={x0} y={CARD_TOP} width={CARD_W} height={CARD_H} rx={CARD_R} fill="none" stroke={FLOW} strokeWidth={1.6} />
    </g>
  );
}

function OpsChipBox({c}: {c: OpsChip}): ReactNode {
  const x0 = c.x - CHIP_W / 2;
  const cy = CHIP_TOP + CHIP_H / 2 + (c.note ? 1 : 0);
  return (
    <g>
      <rect x={x0} y={CHIP_TOP} width={CHIP_W} height={CHIP_H} rx={10} fill={SURFACE} stroke={OPS} strokeWidth={1.4} />
      <IconTile x={x0 + 26} cy={CHIP_TOP + CHIP_H / 2} size={30} kind={c.icon} />
      <text x={x0 + 48} y={c.note ? cy - 14 : cy - 6} fontSize={13} fontWeight={700} fill={TEXT}>
        {c.name}
      </text>
      <text x={x0 + 48} y={c.note ? cy + 2 : cy + 12} fontSize={11.5} fill={SUBTEXT}>
        {c.role}
      </text>
      {c.note && (
        <text x={x0 + 48} y={cy + 18} fontSize={11} fontWeight={700} fill={FLOW}>
          {c.note}
        </text>
      )}
    </g>
  );
}

function FlowLabel({x, y, lines, color, className, anchor = 'middle'}: {x: number; y: number; lines: string[]; color?: string; className?: string; anchor?: 'start' | 'middle' | 'end'}): ReactNode {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={12} fontWeight={700} fill={className ? undefined : color} className={className}>
      {lines.map((l, i) => (
        <tspan key={l} x={x} dy={i === 0 ? 0 : 15}>
          {l}
        </tspan>
      ))}
    </text>
  );
}

export default function KagaOverviewDiagram(): ReactNode {
  const exchangeMid = (JPYC_BOTTOM + CARD_TOP) / 2 + 4;
  const chipCy = CHIP_TOP + CHIP_H / 2;
  const gapMid = CARD_BOTTOM + 16;
  return (
    <div style={{overflowX: 'auto', maxWidth: '100%'}}>
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="第一弾の全体像：ユーザーがe-加賀市民でウォレットを連携する。そのウォレットでe-加賀市民証を保有し、かつJPKI確認をした人がe-加賀市民（JPYC配布対象者）になる。推進機構が株式会社JPYCで円をJPYCに換え、e-加賀市民へ配布する。e-加賀市民は連携したウォレットで地域事業者へ支払い、地域事業者は受け取ったJPYCを償還して円に換える。受取後の扱いは検討中。加賀市が推進機構へ運営を委託し、推進機構がCORGEARへ再委託、DSKがCORGEARへ依頼する。CORGEARは市民アプリを改修する"
      style={{width: '100%', minWidth: 720, maxWidth: WIDTH, height: 'auto', display: 'block'}}>
      <style>{STYLE}</style>
      <defs>
        <ArrowMarker id="kaga-ov-jpyc" color={FLOW} />
        <ArrowMarker id="kaga-ov-yen" className="kaga-yen-fill" />
        <ArrowMarker id="kaga-ov-ops" color={OPS} />
      </defs>

      <LegendItem x={16} y={16} color={FLOW} label="JPYCの流れ" />
      <LegendItem x={148} y={16} className="kaga-yen-stroke" label="円の流れ" />
      <LegendItem x={268} y={16} color={OPS} label="運営・委託" />
      <LegendItem x={396} y={16} color={FLOW} dashed label="検討中" />

      {/* 発行・償還は中央の列の左右。列を横切らない */}
      <rect x={16} y={JPYC_TOP} width={JPYC_LEFT_W} height={JPYC_H} rx={12} fill={SURFACE} stroke={FLOW} strokeWidth={1.8} />
      <IconTile x={42} cy={JPYC_TOP + JPYC_H / 2} size={28} kind="coin" />
      <text x={62} y={JPYC_TOP + 21} fontSize={14} fontWeight={700} fill={TEXT}>
        株式会社JPYC
      </text>
      <text x={62} y={JPYC_TOP + 38} fontSize={12} fill={SUBTEXT}>
        発行（円 → JPYC）
      </text>
      <rect x={JPYC_RIGHT_X} y={JPYC_TOP} width={WIDTH - 16 - JPYC_RIGHT_X} height={JPYC_H} rx={12} fill={SURFACE} stroke={FLOW} strokeWidth={1.8} />
      <IconTile x={JPYC_RIGHT_X + 26} cy={JPYC_TOP + JPYC_H / 2} size={28} kind="coin" />
      <text x={JPYC_RIGHT_X + 46} y={JPYC_TOP + 21} fontSize={14} fontWeight={700} fill={TEXT}>
        株式会社JPYC
      </text>
      <text x={JPYC_RIGHT_X + 46} y={JPYC_TOP + 38} fontSize={12} fill={SUBTEXT}>
        償還（JPYC → 円）
      </text>

      {/* ユーザーから配布対象者まで、下へ一本 */}
      <rect x={PATH_X} y={PATH_TOP} width={PATH_W} height={CARD_TOP + 12 - PATH_TOP} rx={12} fill={LANE} />
      <rect x={PATH_CX - 84} y={USER_TOP} width={168} height={USER_H} rx={USER_H / 2} fill={SURFACE} stroke={OPS} strokeWidth={1.6} />
      <IconTile x={PATH_CX - 52} cy={USER_TOP + USER_H / 2} size={22} kind="person" />
      <text x={PATH_CX - 34} y={USER_TOP + USER_H / 2 + 4} fontSize={14} fontWeight={700} fill={TEXT}>
        ユーザー
      </text>
      <line x1={PATH_CX} y1={USER_TOP + USER_H + 4} x2={PATH_CX} y2={COND_TOP - 4} stroke={OPS} strokeWidth={2} markerEnd="url(#kaga-ov-ops)" />
      <text x={PATH_CX + 14} y={(USER_TOP + USER_H + COND_TOP) / 2} fontSize={12} fontWeight={700} fill={TEXT}>
        e-加賀市民で
      </text>
      <text x={PATH_CX + 14} y={(USER_TOP + USER_H + COND_TOP) / 2 + 16} fontSize={12} fontWeight={700} fill={TEXT}>
        ウォレットを連携
      </text>
      <rect x={288} y={COND_TOP} width={136} height={COND_H} rx={10} fill={SURFACE} stroke={OPS} strokeWidth={1.6} />
      <text x={356} y={COND_TOP + 29} textAnchor="middle" fontSize={12} fontWeight={700} fill={TEXT}>
        e-加賀市民証を保有
      </text>
      <text x={PATH_CX} y={COND_TOP + 29} textAnchor="middle" fontSize={12} fontWeight={700} fill={SUBTEXT}>
        かつ
      </text>
      <rect x={474} y={COND_TOP} width={108} height={COND_H} rx={10} fill={SURFACE} stroke={OPS} strokeWidth={1.6} />
      <text x={528} y={COND_TOP + 29} textAnchor="middle" fontSize={12} fontWeight={700} fill={TEXT}>
        JPKI確認
      </text>
      <line x1={PATH_CX} y1={COND_TOP + COND_H + 4} x2={PATH_CX} y2={CARD_TOP - 4} stroke={OPS} strokeWidth={2.2} markerEnd="url(#kaga-ov-ops)" />
      <text x={PATH_CX + 14} y={(COND_TOP + COND_H + CARD_TOP) / 2 + 4} fontSize={13} fontWeight={700} fill={TEXT}>
        対象になる
      </text>

      {/* 推進機構 ⇄ JPYC：円を払い、JPYCを受け取る */}
      <line x1={COL[0] - 18} y1={CARD_TOP - 4} x2={COL[0] - 18} y2={JPYC_BOTTOM + 4} className="kaga-yen-stroke" strokeWidth={2} markerEnd="url(#kaga-ov-yen)" />
      <FlowLabel x={COL[0] - 26} y={exchangeMid} lines={['円']} anchor="end" className="kaga-yen-fill" />
      <line x1={COL[0] + 18} y1={JPYC_BOTTOM + 4} x2={COL[0] + 18} y2={CARD_TOP - 4} stroke={FLOW} strokeWidth={2} markerEnd="url(#kaga-ov-jpyc)" />
      <FlowLabel x={COL[0] + 26} y={exchangeMid} lines={['JPYC発行']} anchor="start" color={FLOW} />

      {/* 地域事業者 ⇄ JPYC：償還（受取後の扱いは検討中） */}
      <line
        x1={COL[2] - 18}
        y1={CARD_TOP - 4}
        x2={COL[2] - 18}
        y2={JPYC_BOTTOM + 4}
        stroke={FLOW}
        strokeWidth={2}
        strokeDasharray="5 3.5"
        markerEnd="url(#kaga-ov-jpyc)"
      />
      <line
        x1={COL[2] + 18}
        y1={JPYC_BOTTOM + 4}
        x2={COL[2] + 18}
        y2={CARD_TOP - 4}
        className="kaga-yen-stroke"
        strokeWidth={2}
        strokeDasharray="5 3.5"
        markerEnd="url(#kaga-ov-yen)"
      />
      <FlowLabel x={COL[2] - 26} y={exchangeMid - 6} lines={['償還', '検討中']} anchor="end" color={FLOW} />
      <FlowLabel x={COL[2] + 26} y={exchangeMid} lines={['円']} anchor="start" className="kaga-yen-fill" />

      {/* 配布・支払い */}
      <line x1={COL[0] + CARD_W / 2 + 4} y1={CARD_TOP + 78} x2={COL[1] - CARD_W / 2 - 4} y2={CARD_TOP + 78} stroke={FLOW} strokeWidth={2} markerEnd="url(#kaga-ov-jpyc)" />
      <FlowLabel x={(COL[0] + COL[1]) / 2} y={CARD_TOP + 70} lines={['配布']} color={FLOW} />
      <line x1={COL[1] + CARD_W / 2 + 4} y1={CARD_TOP + 78} x2={COL[2] - CARD_W / 2 - 4} y2={CARD_TOP + 78} stroke={FLOW} strokeWidth={2} markerEnd="url(#kaga-ov-jpyc)" />
      <FlowLabel x={(COL[1] + COL[2]) / 2} y={CARD_TOP + 70} lines={['支払い']} color={FLOW} />
      <text x={(COL[1] + COL[2]) / 2} y={CARD_TOP + 96} textAnchor="middle" fontSize={11.5} fill={SUBTEXT}>
        店頭QR
      </text>

      {/* 運営体制 */}
      <rect x={16} y={BAND_TOP} width={WIDTH - 32} height={BAND_H} rx={12} fill={LANE} />
      <text x={32} y={BAND_TOP + 22} fontSize={13} fontWeight={700} fill={TEXT}>
        運営体制
      </text>

      <line x1={COL[0]} y1={CHIP_TOP - 3} x2={COL[0]} y2={CARD_BOTTOM + 3} stroke={OPS} strokeWidth={1.6} markerEnd="url(#kaga-ov-ops)" />
      <text x={COL[0] - 10} y={gapMid} textAnchor="end" fontSize={12} fill={SUBTEXT}>
        運営を委託
      </text>
      <path
        d={`M${COL[0] + 72},${CARD_BOTTOM} V${RAIL_Y} H${COL[1] - 46} V${CHIP_TOP - 3}`}
        fill="none"
        stroke={OPS}
        strokeWidth={1.6}
        markerEnd="url(#kaga-ov-ops)"
      />
      <text x={(COL[0] + 72 + COL[1] - 46) / 2} y={RAIL_Y - 8} textAnchor="middle" fontSize={12} fill={SUBTEXT}>
        再委託
      </text>
      <line x1={COL[1]} y1={CHIP_TOP - 3} x2={COL[1]} y2={CARD_BOTTOM + 3} stroke={OPS} strokeWidth={1.6} markerEnd="url(#kaga-ov-ops)" />
      <text x={COL[1] + 10} y={gapMid} fontSize={12} fill={SUBTEXT}>
        市民アプリを改修
      </text>
      <line x1={COL[2] - CHIP_W / 2 - 3} y1={chipCy} x2={COL[1] + CHIP_W / 2 + 3} y2={chipCy} stroke={OPS} strokeWidth={1.6} markerEnd="url(#kaga-ov-ops)" />
      <text x={(COL[1] + COL[2]) / 2} y={chipCy - 8} textAnchor="middle" fontSize={12} fill={SUBTEXT}>
        依頼
      </text>

      <a href="#issue-after-receipt" className="kaga-ov-link">
        <rect x={COL[2] - 86} y={CARD_BOTTOM + 10} width={172} height={26} rx={13} fill={SURFACE} stroke={FLOW} strokeWidth={1.3} strokeDasharray="4 3" />
        <text x={COL[2]} y={CARD_BOTTOM + 27} textAnchor="middle" fontSize={12} fontWeight={700}>
          受取後は3経路（論点）
        </text>
      </a>

      {actors.map((a) => (
        <MoneyCard key={a.name.join('')} a={a} />
      ))}
      {chips.map((c) => (
        <OpsChipBox key={c.name} c={c} />
      ))}
    </svg>
    </div>
  );
}
