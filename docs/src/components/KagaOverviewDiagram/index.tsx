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
 * - 上：株式会社JPYC（発行・償還）
 * - 中：JPYCをやり取りする3者とウォレット
 * - 下：運営体制（詳細は体制図 KagaRolesDiagram）
 * 手順の詳細は業務フロー図（KagaFlowDiagram）で示す
 */

const WIDTH = 900;
const HEIGHT = 362;

// 上：株式会社JPYC
const JPYC_TOP = 12;
const JPYC_H = 52;

// 中：3者のカード（白銀比）
const COL = [150, 450, 750];
const CARD_W = 200;
const CARD_H = Math.round(CARD_W / Math.SQRT2);
const CARD_TOP = 112;
const CARD_CY = CARD_TOP + CARD_H / 2;
const CARD_BOTTOM = CARD_TOP + CARD_H;

// 下：運営体制のチップ
const CHIP_W = 150;
const CHIP_H = 44;
const CHIP_TOP = 300;
const CHIP_CY = CHIP_TOP + CHIP_H / 2;

// 再委託の矢印（推進機構 → CORGEAR）。加賀市のチップを避けて右側から下ろす
const RE_X = COL[0] + CHIP_W / 2 + 14;

type Actor = {x: number; icon: IconKind; name: string; role: string; wallet: string; no?: number};

const actors: Actor[] = [
  {x: COL[0], icon: 'org', name: '加賀国家戦略特区推進機構', role: '実施主体', wallet: '法人ウォレット', no: 1},
  {x: COL[1], icon: 'person', name: 'e-加賀市民', role: '配布先', wallet: '市民アプリ'},
  {x: COL[2], icon: 'shop', name: '地域事業者', role: '受取側', wallet: '法人ウォレット', no: 2},
];

type Chip = {x: number; icon: IconKind; name: string; role: string};

const chips: Chip[] = [
  {x: COL[0], icon: 'cityhall', name: '加賀市', role: '委託元'},
  {x: COL[1], icon: 'org', name: 'CORGEAR', role: '運営実務'},
  {x: COL[2], icon: 'org', name: 'DSK', role: '依頼元'},
];

function WalletPill({x, y, label, no}: {x: number; y: number; label: string; no?: number}): ReactNode {
  const w = 176;
  const h = 26;
  const textW = 12 * label.length;
  const contentW = 22 + 6 + textW + (no ? 20 : 0);
  const start = x - contentW / 2;
  const noCx = start + 28 + textW + 10;
  return (
    <g>
      <rect x={x - w / 2} y={y} width={w} height={h} rx={h / 2} fill={LANE} />
      <WalletGlyph x={start} y={y + 5} />
      <text x={start + 28} y={y + 17.5} fontSize={12} fontWeight={700} fill={TEXT}>
        {label}
      </text>
      {no && (
        <g>
          <circle cx={noCx} cy={y + h / 2} r={7.5} fill="none" stroke={TEXT} strokeWidth={1.3} />
          <text x={noCx} y={y + h / 2 + 4} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={TEXT}>
            {no}
          </text>
        </g>
      )}
    </g>
  );
}

function ActorBox({a}: {a: Actor}): ReactNode {
  return (
    <g>
      <rect x={a.x - CARD_W / 2} y={CARD_TOP} width={CARD_W} height={CARD_H} rx={12} fill={SURFACE} stroke={FLOW} strokeWidth={1.6} />
      <IconTile x={a.x} cy={CARD_TOP + 26} size={32} kind={a.icon} />
      <text x={a.x} y={CARD_TOP + 64} textAnchor="middle" fontSize={14} fontWeight={700} fill={TEXT}>
        {a.name}
      </text>
      <text x={a.x} y={CARD_TOP + 82} textAnchor="middle" fontSize={11.5} fill={SUBTEXT}>
        {a.role}
      </text>
      <WalletPill x={a.x} y={CARD_TOP + 99} label={a.wallet} no={a.no} />
    </g>
  );
}

function ChipBox({c}: {c: Chip}): ReactNode {
  const x0 = c.x - CHIP_W / 2;
  return (
    <g>
      <rect x={x0} y={CHIP_TOP} width={CHIP_W} height={CHIP_H} rx={10} fill={SURFACE} stroke={OPS} strokeWidth={1.3} />
      <IconTile x={x0 + 24} cy={CHIP_CY} size={28} kind={c.icon} />
      <text x={x0 + 46} y={CHIP_CY - 2} fontSize={13} fontWeight={700} fill={TEXT}>
        {c.name}
      </text>
      <text x={x0 + 46} y={CHIP_CY + 14} fontSize={11} fill={SUBTEXT}>
        {c.role}
      </text>
    </g>
  );
}

function Label({x, y, lines, color = SUBTEXT, className, anchor = 'middle', bold = false}: {x: number; y: number; lines: string[]; color?: string; className?: string; anchor?: 'start' | 'middle' | 'end'; bold?: boolean}): ReactNode {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={12} fontWeight={bold ? 700 : 400} fill={className ? undefined : color} className={className}>
      {lines.map((l, i) => (
        <tspan key={l} x={x} dy={i === 0 ? 0 : 15}>
          {l}
        </tspan>
      ))}
    </text>
  );
}

export default function KagaOverviewDiagram(): ReactNode {
  const jpycBottom = JPYC_TOP + JPYC_H;
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="第一弾の全体像：推進機構が株式会社JPYCで円をJPYCに換え、e-加賀市民へ配布する。e-加賀市民は市民アプリで地域事業者へ支払い、地域事業者は受け取ったJPYCを償還して円に換える（受取後の扱いは検討中）。加賀市が推進機構へ運営を委託し、推進機構がCORGEARへ再委託、DSKがCORGEARへ依頼する。CORGEARは市民アプリを改修する"
      style={{width: '100%', maxWidth: WIDTH, height: 'auto'}}>
      <style>{YEN_STYLE}</style>
      <defs>
        <ArrowMarker id="kaga-ov-jpyc" color={FLOW} />
        <ArrowMarker id="kaga-ov-yen" className="kaga-yen-fill" />
        <ArrowMarker id="kaga-ov-ops" color={OPS} />
      </defs>

      {/* 上：株式会社JPYC */}
      <rect x={12} y={JPYC_TOP} width={WIDTH - 24} height={JPYC_H} rx={12} fill={SURFACE} stroke={FLOW} strokeWidth={1.6} />
      <IconTile x={40} cy={JPYC_TOP + JPYC_H / 2} size={32} kind="coin" />
      <text x={66} y={JPYC_TOP + 23} fontSize={14} fontWeight={700} fill={TEXT}>
        株式会社JPYC
      </text>
      <text x={66} y={JPYC_TOP + 41} fontSize={11.5} fill={SUBTEXT}>
        発行体：発行（円 → JPYC）・償還（JPYC → 円）
      </text>

      {/* 推進機構 ⇄ JPYC社：円を払い、JPYCを受け取る */}
      <line x1={COL[0] - 20} y1={CARD_TOP - 3} x2={COL[0] - 20} y2={jpycBottom + 3} className="kaga-yen-stroke" strokeWidth={2} markerEnd="url(#kaga-ov-yen)" />
      <Label x={COL[0] - 28} y={(jpycBottom + CARD_TOP) / 2 + 4} lines={['円']} anchor="end" bold className="kaga-yen-fill" />
      <line x1={COL[0] + 20} y1={jpycBottom + 3} x2={COL[0] + 20} y2={CARD_TOP - 3} stroke={FLOW} strokeWidth={2} markerEnd="url(#kaga-ov-jpyc)" />
      <Label x={COL[0] + 28} y={(jpycBottom + CARD_TOP) / 2 + 4} lines={['JPYC発行']} anchor="start" bold color={FLOW} />

      {/* 地域事業者 ⇄ JPYC社：償還（受取後の扱いは検討中） */}
      <line x1={COL[2] - 20} y1={CARD_TOP - 3} x2={COL[2] - 20} y2={jpycBottom + 3} stroke={FLOW} strokeWidth={2} strokeDasharray="5 4" markerEnd="url(#kaga-ov-jpyc)" />
      <line x1={COL[2] + 20} y1={jpycBottom + 3} x2={COL[2] + 20} y2={CARD_TOP - 3} className="kaga-yen-stroke" strokeWidth={2} strokeDasharray="5 4" markerEnd="url(#kaga-ov-yen)" />
      <Label x={COL[2] + 28} y={(jpycBottom + CARD_TOP) / 2 - 3} lines={['償還', '（検討中）']} anchor="start" />

      {/* 配布・支払い */}
      <line x1={COL[0] + CARD_W / 2 + 3} y1={CARD_CY} x2={COL[1] - CARD_W / 2 - 3} y2={CARD_CY} stroke={FLOW} strokeWidth={2} markerEnd="url(#kaga-ov-jpyc)" />
      <Label x={(COL[0] + COL[1]) / 2} y={CARD_CY - 9} lines={['配布']} bold color={FLOW} />
      <line x1={COL[1] + CARD_W / 2 + 3} y1={CARD_CY} x2={COL[2] - CARD_W / 2 - 3} y2={CARD_CY} stroke={FLOW} strokeWidth={2} markerEnd="url(#kaga-ov-jpyc)" />
      <Label x={(COL[1] + COL[2]) / 2} y={CARD_CY - 9} lines={['支払い']} bold color={FLOW} />
      <Label x={(COL[1] + COL[2]) / 2} y={CARD_CY + 19} lines={['店頭QR']} />

      {/* 下：運営体制 */}
      <line x1={COL[0]} y1={CHIP_TOP - 3} x2={COL[0]} y2={CARD_BOTTOM + 3} stroke={OPS} strokeWidth={1.6} markerEnd="url(#kaga-ov-ops)" />
      <Label x={COL[0] - 8} y={(CARD_BOTTOM + CHIP_TOP) / 2 + 4} lines={['運営を委託']} anchor="end" />
      <path
        d={`M${RE_X},${CARD_BOTTOM + 3} V${CHIP_CY} H${COL[1] - CHIP_W / 2 - 3}`}
        fill="none"
        stroke={OPS}
        strokeWidth={1.6}
        markerEnd="url(#kaga-ov-ops)"
      />
      <Label x={(RE_X + COL[1] - CHIP_W / 2) / 2} y={CHIP_CY - 7} lines={['再委託']} />
      <line x1={COL[1]} y1={CHIP_TOP - 3} x2={COL[1]} y2={CARD_BOTTOM + 3} stroke={OPS} strokeWidth={1.6} markerEnd="url(#kaga-ov-ops)" />
      <Label x={COL[1] + 8} y={(CARD_BOTTOM + CHIP_TOP) / 2 + 4} lines={['市民アプリを改修']} anchor="start" />
      <line x1={COL[2] - CHIP_W / 2 - 3} y1={CHIP_CY} x2={COL[1] + CHIP_W / 2 + 3} y2={CHIP_CY} stroke={OPS} strokeWidth={1.6} markerEnd="url(#kaga-ov-ops)" />
      <Label x={(COL[1] + COL[2]) / 2} y={CHIP_CY - 7} lines={['依頼']} />

      {/* 受取後の扱い（論点へのリンク） */}
      <a href="#issue-after-receipt">
        <Label x={COL[2] + 10} y={(CARD_BOTTOM + CHIP_TOP) / 2 + 4} lines={['受取後は3経路（論点）']} anchor="start" color={FLOW} />
      </a>

      {actors.map((a) => (
        <ActorBox key={a.name} a={a} />
      ))}
      {chips.map((c) => (
        <ChipBox key={c.name} c={c} />
      ))}
    </svg>
  );
}
