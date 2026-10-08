import type {ReactNode} from 'react';
import {
  ActorCard,
  ArrowMarker,
  LANE,
  OPS,
  SUBTEXT,
  SURFACE,
  TEXT,
  type IconKind,
} from '@site/src/components/KagaDiagramParts';

/*
 * 第一弾の体制図（誰が誰に委託・依頼しているか、市民アプリを誰が改修するか）
 * - 上段：運営体制（委託・再委託・依頼の関係）
 * - 下段：JPYCの発行・利用者
 * お金（円・JPYC）の流れとウォレットは業務フロー図（KagaFlowDiagram）で示す
 */

const WIDTH = 900;
const CARD_W = 170;
// カードは白銀比（横:縦 = √2:1）
const CARD_H = Math.round(CARD_W / Math.SQRT2);
const MARGIN = 12;
const STEP = (WIDTH - MARGIN * 2 - CARD_W) / 3;
const COL = [0, 1, 2, 3].map((i) => MARGIN + CARD_W / 2 + STEP * i);

// 上段
const BAND1_TOP = 8;
const ROW1_TOP = 44;
const BAND1_H = ROW1_TOP + CARD_H + 16 - BAND1_TOP;
const ROW1_CY = ROW1_TOP + CARD_H / 2;

// 下段
const BAND2_TOP = BAND1_TOP + BAND1_H + 12;
const ROW2_TOP = BAND2_TOP + 36;

// 市民アプリ（e-加賀市民の下に置くシステム）
const APP_W = CARD_W;
const APP_H = 46;
const APP_TOP = ROW2_TOP + CARD_H + 16;
const APP_CY = APP_TOP + APP_H / 2;
const BAND2_H = APP_TOP + APP_H + 14 - BAND2_TOP;
const HEIGHT = BAND2_TOP + BAND2_H + 8;

// 改修の矢印。e-加賀市民のカードを避けて、右側のすき間を通す
const MOD_START_X = COL[2] + 40;
const MOD_TURN_Y = BAND2_TOP - 6;
const MOD_X = (COL[2] + COL[3]) / 2;

type Actor = {x: number; top: number; icon: IconKind; name: string[]; role: string};

const actors: Actor[] = [
  {x: COL[0], top: ROW1_TOP, icon: 'cityhall', name: ['加賀市'], role: '委託元'},
  {x: COL[1], top: ROW1_TOP, icon: 'org', name: ['加賀国家戦略特区', '推進機構'], role: '実施主体'},
  {x: COL[2], top: ROW1_TOP, icon: 'org', name: ['CORGEAR'], role: '再委託先・運営実務'},
  {x: COL[3], top: ROW1_TOP, icon: 'org', name: ['DSK'], role: '依頼元'},
  {x: COL[0], top: ROW2_TOP, icon: 'coin', name: ['JPYC株式会社'], role: '発行体'},
  {x: COL[2], top: ROW2_TOP, icon: 'person', name: ['e-加賀市民'], role: '配布先'},
  {x: COL[3], top: ROW2_TOP, icon: 'shop', name: ['地域事業者'], role: '受取側'},
];

// 上段の関係（カード間の横矢印）。dy で上下にずらし、双方向の関係を2本で表す
const relations = [
  {from: COL[0], to: COL[1], dy: 0, label: ['運営を委託']},
  {from: COL[1], to: COL[2], dy: -10, label: ['再委託']},
  {from: COL[2], to: COL[1], dy: 10, label: ['実務提供']},
  {from: COL[3], to: COL[2], dy: -10, label: ['依頼']},
  {from: COL[2], to: COL[3], dy: 10, label: ['進捗・結果', 'の共有']},
];

function AppCard({x}: {x: number}): ReactNode {
  const x0 = x - APP_W / 2;
  const iconX = x0 + 10;
  return (
    <g>
      <rect x={x0} y={APP_TOP} width={APP_W} height={APP_H} rx={10} fill={SURFACE} stroke={SUBTEXT} strokeWidth={1.5} />
      {/* ブラウザアイコン */}
      <rect x={iconX} y={APP_CY - 8} width={18} height={16} rx={2.5} fill="none" stroke={TEXT} strokeWidth={1.6} />
      <line x1={iconX} y1={APP_CY - 3.5} x2={iconX + 18} y2={APP_CY - 3.5} stroke={TEXT} strokeWidth={1.6} />
      <text x={iconX + 25} y={APP_CY - 2} fontSize={13} fontWeight={700} fill={TEXT}>
        市民アプリ
      </text>
      <text x={iconX + 25} y={APP_CY + 14} fontSize={11} fill={SUBTEXT}>
        既存のWebアプリ
      </text>
    </g>
  );
}

export default function KagaRolesDiagram(): ReactNode {
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="第一弾の体制図：加賀市（委託元）が推進機構（実施主体）へ運営を委託し、推進機構がCORGEAR（再委託先・運営実務）へ再委託してCORGEARが実務を提供する。DSK（依頼元）がCORGEARへ依頼し、CORGEARが進捗・結果を共有する。CORGEARはe-加賀市民（配布先）の市民アプリ（既存のWebアプリ）を改修する。JPYC株式会社は発行体、地域事業者は受取側"
      style={{width: '100%', maxWidth: WIDTH, height: 'auto'}}>
      <defs>
        <ArrowMarker id="kaga-roles-arrow" color={OPS} />
      </defs>

      <rect x={8} y={BAND1_TOP} width={WIDTH - 16} height={BAND1_H} rx={12} fill={LANE} />
      <text x={22} y={BAND1_TOP + 24} fontSize={13.5} fontWeight={700} fill={TEXT}>
        運営体制
      </text>
      <rect x={8} y={BAND2_TOP} width={WIDTH - 16} height={BAND2_H} rx={12} fill={LANE} />
      <text x={22} y={BAND2_TOP + 24} fontSize={13.5} fontWeight={700} fill={TEXT}>
        JPYCの発行・利用
      </text>

      {relations.map((r) => {
        const dir = Math.sign(r.to - r.from);
        const x1 = r.from + dir * (CARD_W / 2 + 3);
        const x2 = r.to - dir * (CARD_W / 2 + 3);
        const y = ROW1_CY + r.dy;
        const cx = (x1 + x2) / 2;
        return (
          <g key={r.label.join('')}>
            <line x1={x1} y1={y} x2={x2} y2={y} stroke={OPS} strokeWidth={1.6} markerEnd="url(#kaga-roles-arrow)" />
            <text x={cx} y={r.dy > 0 ? y + 17 : y - 8 - (r.label.length - 1) * 15} textAnchor="middle" fontSize={11.5} fill={SUBTEXT}>
              {r.label.map((l, i) => (
                <tspan key={l} x={cx} dy={i === 0 ? 0 : 15}>
                  {l}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}

      {/* 改修：CORGEAR → e-加賀市民の市民アプリ（e-加賀市民のカードの右を回る） */}
      <path
        d={`M${MOD_START_X},${ROW1_TOP + CARD_H} V${MOD_TURN_Y} H${MOD_X} V${APP_CY} H${COL[2] + APP_W / 2 + 3}`}
        fill="none"
        stroke={OPS}
        strokeWidth={1.6}
        markerEnd="url(#kaga-roles-arrow)"
      />
      <text x={(MOD_START_X + MOD_X) / 2} y={MOD_TURN_Y + 17} textAnchor="middle" fontSize={12} fill={SUBTEXT}>
        改修
      </text>

      {actors.map((a) => (
        <ActorCard key={a.name.join('')} x={a.x} top={a.top} w={CARD_W} h={CARD_H} kind={a.icon} name={a.name} role={a.role} />
      ))}

      <AppCard x={COL[2]} />
    </svg>
  );
}
