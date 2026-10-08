import type {ReactNode} from 'react';
import {ArrowMarker, FLOW, IconTile, LANE, OPS, SUBTEXT, SURFACE, TEXT, WalletGlyph} from '@site/src/components/KagaDiagramParts';

/*
 * NFT販売サイトの新規作成・ログインと、使われるウォレットの対応
 * - 上の帯：新規作成（アカウントも MetaMask も持っていない）。Google アカウントかメールアドレスで作成し、Torus Wallet が作られる
 * - 下の帯：ログイン（アカウントまたは MetaMask を持っている）。Google・メールは作成済みの Torus Wallet、MetaMask は既存のウォレットを使う
 * 部品の約束は全体像（KagaOverviewDiagram）と同じ
 */

const WIDTH = 900;
const R = 12;

const USER_X = 78;
const USER_W = 120;
const USER_H = 56;
// 分岐の縦線は帯の外（左の余白）に置き、帯の見出しと重ねない
const RAIL_X = 164;

const LANE_X = 190;
const LANE_W = WIDTH - LANE_X - 12;

const METHOD_X = 345;
const METHOD_W = 200;
const WALLET_X = 660;
const WALLET_W = 220;
const CARD_H = 56;

const LANE1_TOP = 8;
const ROW1_CY = 78;
const LANE1_H = ROW1_CY + CARD_H / 2 + 14 - LANE1_TOP;

const LANE2_TOP = LANE1_TOP + LANE1_H + 12;
const ROW2_CY = LANE2_TOP + 70;
const ROW3_CY = ROW2_CY + 70;
const LANE2_H = ROW3_CY + CARD_H / 2 + 14 - LANE2_TOP;

const HEIGHT = LANE2_TOP + LANE2_H + 8;
// ユーザーからの線は2つの帯のすき間を通す
const USER_CY = LANE1_TOP + LANE1_H + 6;

function Lane({top, h, title, cond}: {top: number; h: number; title: string; cond: string}): ReactNode {
  return (
    <g>
      <rect x={LANE_X} y={top} width={LANE_W} height={h} rx={R} fill={LANE} />
      <text x={LANE_X + 14} y={top + 22} fontSize={13} fontWeight={700} fill={TEXT}>
        {title}
        <tspan fontWeight={400} fill={SUBTEXT}>
          {'　'}
          {cond}
        </tspan>
      </text>
    </g>
  );
}

// 入口（Google アカウント・メールアドレス・MetaMask）。条件の箱と同じ OPS 枠
function MethodCard({cy, lines}: {cy: number; lines: string[]}): ReactNode {
  const y0 = cy - ((lines.length - 1) * 16) / 2 + 4.5;
  return (
    <g>
      <rect x={METHOD_X - METHOD_W / 2} y={cy - CARD_H / 2} width={METHOD_W} height={CARD_H} rx={R} fill={SURFACE} stroke={OPS} strokeWidth={1.6} />
      <text x={METHOD_X} y={y0} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={TEXT}>
        {lines.map((l, i) => (
          <tspan key={l} x={METHOD_X} dy={i === 0 ? 0 : 16}>
            {l}
          </tspan>
        ))}
      </text>
    </g>
  );
}

// 使われるウォレット。関係者カードと同じ FLOW 枠
function WalletCard({cy, name, sub}: {cy: number; name: string; sub: string}): ReactNode {
  const x0 = WALLET_X - WALLET_W / 2;
  return (
    <g>
      <rect x={x0} y={cy - CARD_H / 2} width={WALLET_W} height={CARD_H} rx={R} fill={SURFACE} stroke={FLOW} strokeWidth={1.6} />
      <WalletGlyph x={x0 + 16} y={cy - 8} />
      <text x={x0 + 48} y={cy - 2} fontSize={13} fontWeight={700} fill={TEXT}>
        {name}
      </text>
      <text x={x0 + 48} y={cy + 14} fontSize={11.5} fill={SUBTEXT}>
        {sub}
      </text>
    </g>
  );
}

function Step({cy, label}: {cy: number; label: string}): ReactNode {
  const x1 = METHOD_X + METHOD_W / 2 + 3;
  const x2 = WALLET_X - WALLET_W / 2 - 4;
  return (
    <g>
      <line x1={x1} y1={cy} x2={x2} y2={cy} stroke={OPS} strokeWidth={1.6} markerEnd="url(#ekaga-signin-arrow)" />
      <text x={(x1 + x2) / 2} y={cy - 8} textAnchor="middle" fontSize={12} fill={SUBTEXT}>
        {label}
      </text>
    </g>
  );
}

export default function EKagaSignInDiagram(): ReactNode {
  return (
    <div style={{overflowX: 'auto', maxWidth: '100%'}}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="NFT販売サイトの新規作成とログイン。アカウントもMetaMaskも持っていない場合は新規作成で、GoogleアカウントまたはメールアドレスでアカウントをつくるとTorus Walletが新しく作成される。アカウントまたはMetaMaskを持っている場合はログインで、Googleアカウントまたはメールアドレスなら作成済みのTorus Walletを、MetaMaskなら既存のウォレットを使う"
        style={{width: '100%', minWidth: 680, maxWidth: WIDTH, height: 'auto', display: 'block'}}>
        <defs>
          <ArrowMarker id="ekaga-signin-arrow" color={OPS} />
        </defs>

        <Lane top={LANE1_TOP} h={LANE1_H} title="新規作成" cond="アカウントも MetaMask も持っていない" />
        <Lane top={LANE2_TOP} h={LANE2_H} title="ログイン" cond="アカウントまたは MetaMask を持っている" />

        {/* ユーザー → 各入口 */}
        <rect x={USER_X - USER_W / 2} y={USER_CY - USER_H / 2} width={USER_W} height={USER_H} rx={R} fill={SURFACE} stroke={FLOW} strokeWidth={1.6} />
        <IconTile x={USER_X - USER_W / 2 + 24} cy={USER_CY} size={28} kind="person" />
        <text x={USER_X - USER_W / 2 + 46} y={USER_CY + 4.5} fontSize={13} fontWeight={700} fill={TEXT}>
          ユーザー
        </text>
        <path
          d={`M${USER_X + USER_W / 2},${USER_CY} H${RAIL_X} M${RAIL_X},${ROW1_CY} V${ROW3_CY}`}
          fill="none"
          stroke={OPS}
          strokeWidth={1.6}
        />
        {[ROW1_CY, ROW2_CY, ROW3_CY].map((cy) => (
          <line key={cy} x1={RAIL_X} y1={cy} x2={METHOD_X - METHOD_W / 2 - 4} y2={cy} stroke={OPS} strokeWidth={1.6} markerEnd="url(#ekaga-signin-arrow)" />
        ))}

        {/* 新規作成 */}
        <MethodCard cy={ROW1_CY} lines={['Google アカウント', 'または メールアドレス']} />
        <Step cy={ROW1_CY} label="アカウントを作成" />
        <WalletCard cy={ROW1_CY} name="Torus Wallet" sub="新しく作成される" />

        {/* ログイン */}
        <MethodCard cy={ROW2_CY} lines={['Google アカウント', 'または メールアドレス']} />
        <Step cy={ROW2_CY} label="ログイン" />
        <WalletCard cy={ROW2_CY} name="Torus Wallet" sub="作成済みのものを使う" />

        <MethodCard cy={ROW3_CY} lines={['MetaMask']} />
        <Step cy={ROW3_CY} label="ログイン" />
        <WalletCard cy={ROW3_CY} name="MetaMask" sub="既存のウォレットを使う" />
      </svg>
    </div>
  );
}
