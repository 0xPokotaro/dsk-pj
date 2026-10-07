import type {ReactNode} from 'react';
import {
  IconTile,
  ArrowMarker,
  CorporateWalletCard,
  FLOW,
  Name,
  OPS,
  StepNo,
  SURFACE,
  TEXT,
  WebAppWalletCard,
  YEN_STYLE,
  type IconKind,
} from '@site/src/components/KagaDiagramParts';

/*
 * 第一弾の業務フロー図。JPYCはウォレット間を移動する。
 * 番号は本文の業務フロー（1〜4）に対応する
 */

const WIDTH = 680;
const HEIGHT = 254;
const COL = [60, 246, 432, 618];
const ICON_R = 22;
const ICON_CY = 34;
const NAME_Y = 78;
const CARD_W = 104;
const CARD_H = 64;
const CARD_TOP = 114;
const CY = CARD_TOP + CARD_H / 2;

type Actor = {x: number; icon: IconKind; name: string[]};
const actors: Actor[] = [
  {x: COL[0], icon: 'coin', name: ['株式会社JPYC']},
  {x: COL[1], icon: 'org', name: ['加賀国家戦略特区', '推進機構']},
  {x: COL[2], icon: 'person', name: ['e-加賀市民']},
  {x: COL[3], icon: 'shop', name: ['地域事業者']},
];

const right = (x: number) => x + CARD_W / 2;
const left = (x: number) => x - CARD_W / 2;
const gapCenter = (i: number) => (COL[i] + COL[i + 1]) / 2;

export default function KagaFlowDiagram(): ReactNode {
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="第一弾の業務フロー：1 推進機構が円を払いJPYCを法人ウォレットで受け取る、2 e-加賀市民のTorus Walletへ配布、3 地域事業者の法人ウォレットへ支払い、4 受取後の対応は検討中"
      style={{width: '100%', maxWidth: WIDTH, height: 'auto'}}>
      <style>{YEN_STYLE}</style>
      <defs>
        <ArrowMarker id="kaga-flow-jpyc" color={FLOW} />
        <ArrowMarker id="kaga-flow-yen" className="kaga-yen-fill" />
        <ArrowMarker id="kaga-flow-ops" color={OPS} />
      </defs>

      {actors.map((a) => (
        <g key={a.name.join('')}>
          <IconTile x={a.x} cy={ICON_CY} size={ICON_R * 2} kind={a.icon} />
          <Name x={a.x} y={NAME_Y} lines={a.name} size={14} />
        </g>
      ))}

      {/* カード */}
      <rect x={left(COL[0])} y={CARD_TOP} width={CARD_W} height={CARD_H} rx={10} fill={SURFACE} stroke={OPS} strokeWidth={1.5} />
      <text x={COL[0]} y={CY + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={TEXT}>
        JPYCを発行
      </text>
      <CorporateWalletCard x={COL[1]} top={CARD_TOP} w={CARD_W} h={CARD_H} stacked />
      <WebAppWalletCard x={COL[2]} top={CARD_TOP} w={CARD_W} h={CARD_H} size={12.5} stacked />
      <CorporateWalletCard x={COL[3]} top={CARD_TOP} w={CARD_W} h={CARD_H} stacked />

      {/* 1 円 → JPYC */}
      <StepNo x={gapCenter(0)} y={CY - 40} n={1} />
      <text x={gapCenter(0)} y={CY - 16} textAnchor="middle" fontSize={12.5} fontWeight={700} className="kaga-yen-fill">
        円
      </text>
      <line x1={left(COL[1])} y1={CY - 7} x2={right(COL[0])} y2={CY - 7} className="kaga-yen-stroke" strokeWidth={2} markerEnd="url(#kaga-flow-yen)" />
      <line x1={right(COL[0])} y1={CY + 7} x2={left(COL[1])} y2={CY + 7} stroke={FLOW} strokeWidth={2} markerEnd="url(#kaga-flow-jpyc)" />
      <text x={gapCenter(0)} y={CY + 25} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={FLOW}>
        JPYC
      </text>

      {/* 2 配布・3 支払い */}
      {[
        {i: 1, n: 2, label: '配布'},
        {i: 2, n: 3, label: '支払い'},
      ].map((s) => (
        <g key={s.n}>
          <StepNo x={gapCenter(s.i)} y={CY - 40} n={s.n} />
          <text x={gapCenter(s.i)} y={CY - 12} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={TEXT}>
            {s.label}
          </text>
          <line x1={right(COL[s.i])} y1={CY} x2={left(COL[s.i + 1])} y2={CY} stroke={FLOW} strokeWidth={2} markerEnd="url(#kaga-flow-jpyc)" />
        </g>
      ))}

      {/* 4 受取後の対応（論点） */}
      <line x1={COL[3]} y1={CARD_TOP + CARD_H} x2={COL[3]} y2={206} stroke={OPS} strokeWidth={1.5} strokeDasharray="4 4" markerEnd="url(#kaga-flow-ops)" />
      <a href="#issue-after-receipt">
        <rect x={508} y={208} width={164} height={36} rx={8} fill={SURFACE} stroke={OPS} strokeWidth={1.3} strokeDasharray="4 4" />
        <StepNo x={526} y={226} n={4} />
        <text x={542} y={230.5} fontSize={12} fill={TEXT}>
          受取後の対応は検討中
        </text>
      </a>
    </svg>
  );
}
