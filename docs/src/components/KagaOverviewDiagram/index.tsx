import type {ReactNode} from 'react';
import {
  ArrowMarker,
  FLOW,
  IconTile,
  LANE,
  OPS,
  StepNo,
  SUBTEXT,
  SURFACE,
  TEXT,
  WalletGlyph,
  YEN_STYLE,
  type IconKind,
} from '@site/src/components/KagaDiagramParts';

/*
 * 第一弾の全体像。3つの帯を上から順に読む
 * - 配布対象者になるまで：ユーザー → ウォレット登録 → 市民証かつ公的個人認証 → e-加賀市民
 * - JPYCの流れ：JPYC株式会社 → 推進機構 → e-加賀市民 → 地域事業者 → JPYC株式会社
 *   手順番号 1〜4 は業務フロー図（KagaFlowDiagram）と本文の番号に対応する
 * - 運営体制：加賀市・CORGEAR・DSK（詳細は体制図 KagaRolesDiagram）
 * 部品の約束
 * - 関係者は角丸12・FLOW枠、条件（関係者でないもの）は角丸12・OPS枠
 * - お金の矢印は太さ2（JPYCはFLOW、円は黄）、運営の矢印は太さ1.6のOPS。検討中は破線
 * - すべての要素を5本の列（COL）にそろえる
 */

const WIDTH = 960;
const BAND_X = 12;
const CARD_W = 136;
const STEP = (WIDTH - 2 * (BAND_X + 12) - CARD_W) / 4;
const COL = [0, 1, 2, 3, 4].map((i) => BAND_X + 12 + CARD_W / 2 + STEP * i);
const R = 12;

// 横長の箱（ユーザー・条件・運営体制）
const CHIP_H = 60;

// 帯1：配布対象者になるまで
const B1_TOP = 34;
const B1_CHIP_TOP = B1_TOP + 36;
const B1_CY = B1_CHIP_TOP + CHIP_H / 2;
const JOIN_Y = B1_CHIP_TOP + CHIP_H + 14;
const B1_H = JOIN_Y + 10 - B1_TOP;
// 条件の箱は名前が長いので、関係者のカードより広くする。「かつ」の両側に置く
const COND_W = 190;
const COND_DX = COND_W / 2 + 26;

// 帯2：JPYCの流れ
const B2_TOP = B1_TOP + B1_H + 12;
const CARD_TOP = B2_TOP + 40;
const CARD_H = 128;
const FOOTER_H = 30;
const CARD_BOTTOM = CARD_TOP + CARD_H;
const FLOW_Y = CARD_TOP + (CARD_H - FOOTER_H) / 2;
const B2_H = CARD_BOTTOM + 48 - B2_TOP;

// 帯3：運営体制
const B3_TOP = B2_TOP + B2_H + 12;
const RAIL_Y = B3_TOP + 24;
const B3_CHIP_TOP = B3_TOP + 40;
const B3_CY = B3_CHIP_TOP + CHIP_H / 2;
const B3_H = B3_CHIP_TOP + CHIP_H + 14 - B3_TOP;

const HEIGHT = B3_TOP + B3_H + 8;

const STYLE = `
${YEN_STYLE}
.kaga-ov-link { cursor: pointer; }
.kaga-ov-link text { fill: var(--ifm-color-primary); }
.kaga-ov-link:hover text { text-decoration: underline; }
.kaga-ov-link:focus-visible rect { stroke-width: 2.4; }
`;

// カードの記載は本文の「関係者と役割」テーブルにそろえる
// - name：関係者、role：位置づけ（案）、wallet：ウォレット（「―」の関係者は欄なし）
// - 動作（発行・配布・支払い・償還）はカードに書かず、矢印のラベルで示す
type Wallet = {label: string; no?: number};
type MoneyActor = {x: number; icon: IconKind; name: string[]; role: string; wallet?: Wallet};

const actors: MoneyActor[] = [
  {x: COL[0], icon: 'coin', name: ['JPYC株式会社'], role: '発行体'},
  {x: COL[1], icon: 'org', name: ['加賀国家戦略特区', '推進機構'], role: '実施主体', wallet: {label: '法人ウォレット', no: 1}},
  {x: COL[2], icon: 'person', name: ['e-加賀市民'], role: '配布先', wallet: {label: 'Torus Wallet'}},
  {x: COL[3], icon: 'shop', name: ['地域事業者'], role: '受取側', wallet: {label: '法人ウォレット', no: 2}},
  {x: COL[4], icon: 'coin', name: ['JPYC株式会社'], role: '発行体'},
];

function Band({top, h, title}: {top: number; h: number; title: string}): ReactNode {
  return (
    <g>
      <rect x={BAND_X} y={top} width={WIDTH - BAND_X * 2} height={h} rx={R} fill={LANE} />
      <text x={BAND_X + 14} y={top + 22} fontSize={13} fontWeight={700} fill={TEXT}>
        {title}
      </text>
    </g>
  );
}

// 横長の箱（アイコン・名前・補足を横並び）。関係者は FLOW枠（sub＝位置づけ）、条件は OPS枠（sub＝何で満たすか）
function Chip({x, top, w = CARD_W, icon, name, sub = [], condition = false}: {x: number; top: number; w?: number; icon: IconKind; name: string; sub?: string[]; condition?: boolean}): ReactNode {
  const x0 = x - w / 2;
  const cy = top + CHIP_H / 2;
  const lineH = 15;
  const y0 = cy - (sub.length * lineH) / 2 + 4;
  const tx = x0 + 46;
  return (
    <g>
      <rect x={x0} y={top} width={w} height={CHIP_H} rx={R} fill={SURFACE} stroke={condition ? OPS : FLOW} strokeWidth={1.6} />
      <IconTile x={x0 + 24} cy={cy} size={28} kind={icon} />
      <text x={tx} y={y0} fontSize={13} fontWeight={700} fill={TEXT}>
        {name}
      </text>
      {sub.map((l, i) => (
        <text key={l} x={tx} y={y0 + lineH * (i + 1)} fontSize={11.5} fill={SUBTEXT}>
          {l}
        </text>
      ))}
    </g>
  );
}

// 半角は全角の半分の幅として見積もる
const textWidth = (s: string, size: number) => [...s].reduce((w, c) => w + (c.charCodeAt(0) < 0x100 ? size * 0.55 : size), 0);

function WalletFooter({x, wallet}: {x: number; wallet: Wallet}): ReactNode {
  const x0 = x - CARD_W / 2;
  const y = CARD_BOTTOM - FOOTER_H;
  const d = `M${x0},${y} H${x0 + CARD_W} V${CARD_BOTTOM - R} Q${x0 + CARD_W},${CARD_BOTTOM} ${x0 + CARD_W - R},${CARD_BOTTOM} H${x0 + R} Q${x0},${CARD_BOTTOM} ${x0},${CARD_BOTTOM - R} Z`;
  const cy = y + FOOTER_H / 2;
  const textW = textWidth(wallet.label, 11);
  const noR = 7.5;
  const contentW = 22 + 7 + textW + (wallet.no ? noR * 2 + 4 : 0);
  const start = x - contentW / 2;
  const noCx = start + 29 + textW + 4 + noR;
  return (
    <g>
      <path d={d} fill={LANE} />
      <line x1={x0} y1={y} x2={x0 + CARD_W} y2={y} stroke={FLOW} strokeWidth={1} strokeOpacity={0.35} />
      <WalletGlyph x={start} y={cy - 8} />
      <text x={start + 29} y={cy + 4} fontSize={11} fontWeight={700} fill={TEXT}>
        {wallet.label}
      </text>
      {wallet.no && (
        <g>
          <circle cx={noCx} cy={cy} r={noR} fill="none" stroke={TEXT} strokeWidth={1.3} />
          <text x={noCx} y={cy + 3.5} textAnchor="middle" fontSize={10} fontWeight={700} fill={TEXT}>
            {wallet.no}
          </text>
        </g>
      )}
    </g>
  );
}

function MoneyCard({a}: {a: MoneyActor}): ReactNode {
  const x0 = a.x - CARD_W / 2;
  // ウォレット欄がないカードは、中身を残りの高さの中央に寄せる
  const dy = a.wallet ? 0 : FOOTER_H / 2;
  const nameY = CARD_TOP + 58 + dy;
  return (
    <g>
      <rect x={x0} y={CARD_TOP} width={CARD_W} height={CARD_H} rx={R} fill={SURFACE} />
      <IconTile x={a.x} cy={CARD_TOP + 24 + dy} size={28} kind={a.icon} />
      <text x={a.x} y={nameY} textAnchor="middle" fontSize={13} fontWeight={700} fill={TEXT}>
        {a.name.map((l, i) => (
          <tspan key={l} x={a.x} dy={i === 0 ? 0 : 15}>
            {l}
          </tspan>
        ))}
      </text>
      <text x={a.x} y={nameY + (a.name.length - 1) * 15 + 17} textAnchor="middle" fontSize={11.5} fill={SUBTEXT}>
        {a.role}
      </text>
      {a.wallet && <WalletFooter x={a.x} wallet={a.wallet} />}
      <rect x={x0} y={CARD_TOP} width={CARD_W} height={CARD_H} rx={R} fill="none" stroke={FLOW} strokeWidth={1.6} />
    </g>
  );
}

// カード間の矢印（横）。from → to の向きに引く
function HArrow({from, to, y, kind, dashed}: {from: number; to: number; y: number; kind: 'jpyc' | 'yen' | 'ops'; dashed?: boolean}): ReactNode {
  const dir = Math.sign(to - from);
  const props =
    kind === 'yen'
      ? {className: 'kaga-yen-stroke', strokeWidth: 2}
      : {stroke: kind === 'jpyc' ? FLOW : OPS, strokeWidth: kind === 'jpyc' ? 2 : 1.6};
  return (
    <line
      x1={from + dir * (CARD_W / 2 + 3)}
      y1={y}
      x2={to - dir * (CARD_W / 2 + 4)}
      y2={y}
      {...props}
      strokeDasharray={dashed ? '5 3.5' : undefined}
      markerEnd={`url(#kaga-ov-${kind})`}
    />
  );
}

function Label({x, y, text, kind, anchor = 'middle'}: {x: number; y: number; text: string; kind: 'jpyc' | 'yen' | 'ops' | 'plain'; anchor?: 'start' | 'middle' | 'end'}): ReactNode {
  const money = kind === 'jpyc' || kind === 'yen';
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={12}
      fontWeight={money || kind === 'plain' ? 700 : 400}
      fill={kind === 'jpyc' ? FLOW : kind === 'ops' ? SUBTEXT : kind === 'plain' ? TEXT : undefined}
      className={kind === 'yen' ? 'kaga-yen-fill' : undefined}>
      {text}
    </text>
  );
}

function LegendLine({x, y, kind, dashed, label}: {x: number; y: number; kind: 'jpyc' | 'yen' | 'ops'; dashed?: boolean; label: string}): ReactNode {
  return (
    <g>
      <line
        x1={x}
        y1={y}
        x2={x + 22}
        y2={y}
        stroke={kind === 'yen' ? undefined : kind === 'jpyc' ? FLOW : OPS}
        className={kind === 'yen' ? 'kaga-yen-stroke' : undefined}
        strokeWidth={kind === 'ops' ? 1.6 : 2.2}
        strokeDasharray={dashed ? '5 3.5' : undefined}
      />
      <text x={x + 28} y={y + 4} fontSize={12} fill={SUBTEXT}>
        {label}
      </text>
    </g>
  );
}

const gap = (i: number) => (COL[i] + COL[i + 1]) / 2;

export default function KagaOverviewDiagram(): ReactNode {
  const condL = COL[2] - COND_DX;
  const condR = COL[2] + COND_DX;
  return (
    <div style={{overflowX: 'auto', maxWidth: '100%'}}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="第一弾の全体像。JPYC配布対象者になるまで：ユーザーがe-加賀市民にウォレットを登録し、登録したウォレットでのe-加賀市民証の保有、かつマイナンバーカードでの公的個人認証（JPKI）でe-加賀市民（JPYC配布対象者）になる。円とJPYCの流れ：1 推進機構（実施主体・法人ウォレット①）がJPYC株式会社（発行体）へ円を払いJPYCを受け取る、2 e-加賀市民（配布先・Torus Wallet）へ配布、3 e-加賀市民が店頭QRで地域事業者（受取側・法人ウォレット②）へ支払い、地域事業者がe-加賀市民へ役務を提供、4 地域事業者がJPYCを償還して円を受け取る（受取後の対応は検討中）。運営体制：加賀市（委託元）が推進機構へ運営を委託し、推進機構がCORGEAR（再委託先・運営実務）へ再委託、DSK（依頼元）がCORGEARへ実証を依頼する。CORGEARは市民アプリを改修する"
        style={{width: '100%', minWidth: 720, maxWidth: WIDTH, height: 'auto', display: 'block'}}>
        <style>{STYLE}</style>
        <defs>
          <ArrowMarker id="kaga-ov-jpyc" color={FLOW} />
          <ArrowMarker id="kaga-ov-yen" className="kaga-yen-fill" />
          <ArrowMarker id="kaga-ov-ops" color={OPS} />
        </defs>

        {/* 凡例 */}
        <LegendLine x={16} y={16} kind="jpyc" label="JPYCの流れ" />
        <LegendLine x={140} y={16} kind="yen" label="円の流れ" />
        <LegendLine x={252} y={16} kind="ops" label="運営・手続き・役務" />
        <LegendLine x={410} y={16} kind="jpyc" dashed label="検討中" />
        <g transform="translate(506, 0)">
          <StepNo x={10} y={16} n={1} />
          <text x={30} y={20} textAnchor="middle" fontSize={12} fill={SUBTEXT}>
            〜
          </text>
          <StepNo x={50} y={16} n={4} />
          <text x={66} y={20} fontSize={12} fill={SUBTEXT}>
            業務フローの手順番号
          </text>
        </g>

        <Band top={B1_TOP} h={B1_H} title="JPYC配布対象者になるまで" />
        <Band top={B2_TOP} h={B2_H} title="円とJPYCの流れ" />
        <Band top={B3_TOP} h={B3_H} title="運営体制" />

        {/* 帯1：ユーザー → 市民証かつ公的個人認証 → e-加賀市民 */}
        <Chip x={COL[0]} top={B1_CHIP_TOP} icon="person" name="ユーザー" sub={['住民・関係人口']} />
        <line x1={COL[0] + CARD_W / 2 + 3} y1={B1_CY} x2={condL - COND_W / 2 - 4} y2={B1_CY} stroke={OPS} strokeWidth={1.6} markerEnd="url(#kaga-ov-ops)" />
        <Label x={(COL[0] + CARD_W / 2 + condL - COND_W / 2) / 2} y={B1_CY - 24} text="e-加賀市民に" kind="plain" />
        <Label x={(COL[0] + CARD_W / 2 + condL - COND_W / 2) / 2} y={B1_CY - 9} text="ウォレットを登録" kind="plain" />
        <Chip x={condL} top={B1_CHIP_TOP} w={COND_W} icon="cert" name="e-加賀市民証の保有" sub={['登録したウォレットで']} condition />
        <Label x={COL[2]} y={B1_CY + 4} text="かつ" kind="ops" />
        <Chip x={condR} top={B1_CHIP_TOP} w={COND_W} icon="idcard" name="公的個人認証（JPKI）" sub={['マイナンバーカードで']} condition />
        <path
          d={`M${condL},${B1_CHIP_TOP + CHIP_H} V${JOIN_Y} H${condR} V${B1_CHIP_TOP + CHIP_H} M${COL[2]},${JOIN_Y} V${CARD_TOP - 4}`}
          fill="none"
          stroke={OPS}
          strokeWidth={1.6}
          markerEnd="url(#kaga-ov-ops)"
        />
        <Label x={COL[2] + 10} y={B2_TOP + 22} text="配布対象者になる" kind="plain" anchor="start" />

        {/* 帯2：お金の流れ。番号は業務フローの手順 */}
        <StepNo x={gap(0)} y={FLOW_Y - 40} n={1} />
        <Label x={gap(0)} y={FLOW_Y - 17} text="発行" kind="jpyc" />
        <HArrow from={COL[1]} to={COL[0]} y={FLOW_Y - 7} kind="yen" />
        <HArrow from={COL[0]} to={COL[1]} y={FLOW_Y + 7} kind="jpyc" />
        <text x={gap(0)} y={FLOW_Y + 29} textAnchor="middle" fontSize={10} fill={SUBTEXT}>
          円→JPYC
        </text>

        <StepNo x={gap(1)} y={FLOW_Y - 40} n={2} />
        <Label x={gap(1)} y={FLOW_Y - 10} text="配布" kind="jpyc" />
        <HArrow from={COL[1]} to={COL[2]} y={FLOW_Y} kind="jpyc" />

        <StepNo x={gap(2)} y={FLOW_Y - 40} n={3} />
        <Label x={gap(2)} y={FLOW_Y - 17} text="支払い" kind="jpyc" />
        <HArrow from={COL[2]} to={COL[3]} y={FLOW_Y - 7} kind="jpyc" />
        <HArrow from={COL[3]} to={COL[2]} y={FLOW_Y + 7} kind="ops" />
        <Label x={gap(2)} y={FLOW_Y + 29} text="役務提供" kind="ops" />

        <StepNo x={gap(3)} y={FLOW_Y - 40} n={4} />
        <Label x={gap(3)} y={FLOW_Y - 17} text="償還" kind="jpyc" />
        <HArrow from={COL[3]} to={COL[4]} y={FLOW_Y - 7} kind="jpyc" dashed />
        <HArrow from={COL[4]} to={COL[3]} y={FLOW_Y + 7} kind="yen" dashed />
        <text x={gap(3)} y={FLOW_Y + 29} textAnchor="middle" fontSize={10} fill={SUBTEXT}>
          JPYC→円
        </text>

        <a href="#issue-after-receipt" className="kaga-ov-link">
          <rect x={COL[3] - CARD_W / 2} y={CARD_BOTTOM + 10} width={CARD_W} height={26} rx={13} fill={SURFACE} stroke={FLOW} strokeWidth={1.3} strokeDasharray="4 3" />
          <text x={COL[3]} y={CARD_BOTTOM + 27} textAnchor="middle" fontSize={11.5} fontWeight={700}>
            受取後の対応は検討中
          </text>
        </a>

        {/* 帯3：運営体制 */}
        <line x1={COL[1]} y1={B3_CHIP_TOP - 3} x2={COL[1]} y2={CARD_BOTTOM + 4} stroke={OPS} strokeWidth={1.6} markerEnd="url(#kaga-ov-ops)" />
        <Label x={COL[1] - 10} y={CARD_BOTTOM + 26} text="運営を委託" kind="ops" anchor="end" />
        <path
          d={`M${COL[1] + 44},${CARD_BOTTOM} V${RAIL_Y} H${COL[2] - 44} V${B3_CHIP_TOP - 3}`}
          fill="none"
          stroke={OPS}
          strokeWidth={1.6}
          markerEnd="url(#kaga-ov-ops)"
        />
        <Label x={gap(1)} y={RAIL_Y - 7} text="再委託" kind="ops" />
        <line x1={COL[2]} y1={B3_CHIP_TOP - 3} x2={COL[2]} y2={CARD_BOTTOM + 4} stroke={OPS} strokeWidth={1.6} markerEnd="url(#kaga-ov-ops)" />
        <Label x={COL[2] + 10} y={CARD_BOTTOM + 26} text="市民アプリを改修" kind="ops" anchor="start" />
        <HArrow from={COL[3]} to={COL[2]} y={B3_CY} kind="ops" />
        <Label x={gap(2)} y={B3_CY - 21} text="実証を" kind="ops" />
        <Label x={gap(2)} y={B3_CY - 7} text="依頼" kind="ops" />

        <Chip x={COL[1]} top={B3_CHIP_TOP} icon="cityhall" name="加賀市" sub={['委託元']} />
        <Chip x={COL[2]} top={B3_CHIP_TOP} icon="org" name="CORGEAR" sub={['再委託先', '運営実務']} />
        <Chip x={COL[3]} top={B3_CHIP_TOP} icon="org" name="DSK" sub={['依頼元']} />

        {actors.map((a) => (
          <MoneyCard key={a.x} a={a} />
        ))}
      </svg>
    </div>
  );
}
