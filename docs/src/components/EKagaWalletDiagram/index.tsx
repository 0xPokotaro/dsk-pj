import type {ReactNode} from 'react';
import {ArrowMarker, OPS, SUBTEXT, SURFACE, TEXT, WalletGlyph} from '@site/src/components/KagaDiagramParts';

/*
 * NFT販売サイトで使える2つのウォレットの作り方と、使える場所
 * - 上の帯：Torus Wallet（Web3Auth）。NFT販売サイトで作成する。サイトごとにアドレスが変わるため、他のサイトでは同じウォレットを使えない
 * - 下の帯：MetaMask。サイトの外で作成し、NFT販売サイトに接続してログインする。どのサイトでも同じアドレスで使える
 * 左から「作成のしかた → ウォレット → 使える場所」の順に並べる。配色は青を基調にする
 */

const WIDTH = 900;
const R = 12;

// 青を基調にし、使えない場所だけ赤で示す。テーマ別に CSS 変数で切り替える
const STYLE = `
.ekaga-wallet {
  --ekaga-accent: #2563eb;
  --ekaga-soft: #eef4ff;
  --ekaga-ng: #dc2626;
}
[data-theme='dark'] .ekaga-wallet {
  --ekaga-accent: #6ea8ff;
  --ekaga-soft: #1a2538;
  --ekaga-ng: #ff7a7a;
}
`;
const ACCENT = 'var(--ekaga-accent)';
const SOFT = 'var(--ekaga-soft)';
const NG = 'var(--ekaga-ng)';

const LANE_X = 8;
const LANE_W = WIDTH - LANE_X * 2;

// 列：作成のしかた／ウォレット／使える場所
const HOW_X = 28;
const HOW_W = 220;
const WALLET_X = 360;
const WALLET_W = 230;
const PLACE_X = 646;
const PLACE_W = WIDTH - 24 - PLACE_X;
const CARD_H = 72;
const CHIP_H = 31;

const HEAD_Y = 18;
const LANE_H = 108;
const LANE_TOPS = [32, 32 + LANE_H + 14];
const HEIGHT = LANE_TOPS[1] + LANE_H + 8;

type Place = {label: string; ok: boolean};
type Row = {how: string; howSub: string; step: string; wallet: string; walletSub: string; places: Place[]};

const ROWS: Row[] = [
  {
    how: 'NFT販売サイトで作成',
    howSub: 'Google・メールアドレス',
    step: '作成',
    wallet: 'Torus Wallet',
    walletSub: 'このサイト専用のアドレス',
    places: [
      {label: 'NFT販売サイト', ok: true},
      {label: '他のサイト', ok: false},
    ],
  },
  {
    how: 'MetaMask で作成',
    howSub: 'サイトの外で作る',
    step: '接続',
    wallet: 'MetaMask',
    walletSub: 'どのサイトでも同じアドレス',
    places: [
      {label: 'NFT販売サイト', ok: true},
      {label: '他のサイト', ok: true},
    ],
  },
];

function ColumnHead({x, w, text}: {x: number; w: number; text: string}): ReactNode {
  return (
    <text x={x + w / 2} y={HEAD_Y} textAnchor="middle" fontSize={11.5} fontWeight={600} fill={SUBTEXT}>
      {text}
    </text>
  );
}

// 作成のしかた。灰色の枠で控えめにする
function HowCard({cy, title, sub}: {cy: number; title: string; sub: string}): ReactNode {
  const cx = HOW_X + HOW_W / 2;
  return (
    <g>
      <rect x={HOW_X} y={cy - CARD_H / 2} width={HOW_W} height={CARD_H} rx={R} fill={SURFACE} stroke={OPS} strokeWidth={1.6} />
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize={13.5} fontWeight={700} fill={TEXT}>
        {title}
      </text>
      <text x={cx} y={cy + 17} textAnchor="middle" fontSize={11.5} fill={SUBTEXT}>
        {sub}
      </text>
    </g>
  );
}

// ウォレット。青枠で目立たせる
function WalletCard({cy, name, sub}: {cy: number; name: string; sub: string}): ReactNode {
  return (
    <g>
      <rect x={WALLET_X} y={cy - CARD_H / 2} width={WALLET_W} height={CARD_H} rx={R} fill={SURFACE} stroke={ACCENT} strokeWidth={1.6} />
      <WalletGlyph x={WALLET_X + 16} y={cy - 8} color={ACCENT} />
      <text x={WALLET_X + 50} y={cy - 4} fontSize={13.5} fontWeight={700} fill={TEXT}>
        {name}
      </text>
      <text x={WALLET_X + 50} y={cy + 17} fontSize={11.5} fill={SUBTEXT}>
        {sub}
      </text>
    </g>
  );
}

// 使える場所。使えるものは青、使えないものは赤で示す
function PlaceChip({y, label, ok}: {y: number; label: string; ok: boolean}): ReactNode {
  const color = ok ? ACCENT : NG;
  const cx = PLACE_X + 18;
  const cy = y + CHIP_H / 2;
  return (
    <g>
      <rect x={PLACE_X} y={y} width={PLACE_W} height={CHIP_H} rx={CHIP_H / 2} fill={SURFACE} stroke={color} strokeWidth={1.3} />
      <circle cx={cx} cy={cy} r={8} fill={color} />
      {ok ? (
        <path d={`M${cx - 3.5},${cy} L${cx - 1},${cy + 2.8} L${cx + 4},${cy - 3}`} fill="none" stroke={SURFACE} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d={`M${cx - 3},${cy - 3} L${cx + 3},${cy + 3} M${cx + 3},${cy - 3} L${cx - 3},${cy + 3}`} stroke={SURFACE} strokeWidth={1.8} strokeLinecap="round" />
      )}
      <text x={cx + 16} y={cy + 4.5} fontSize={12.5} fontWeight={600} fill={ok ? TEXT : NG}>
        {label}
      </text>
    </g>
  );
}

function Arrow({x1, x2, cy, label}: {x1: number; x2: number; cy: number; label?: string}): ReactNode {
  return (
    <g>
      <line x1={x1 + 3} y1={cy} x2={x2 - 4} y2={cy} stroke={OPS} strokeWidth={1.6} markerEnd="url(#ekaga-wallet-arrow)" />
      {label && (
        <text x={(x1 + x2) / 2} y={cy - 8} textAnchor="middle" fontSize={11.5} fill={SUBTEXT}>
          {label}
        </text>
      )}
    </g>
  );
}

function WalletLane({top, row}: {top: number; row: Row}): ReactNode {
  const cy = top + LANE_H / 2;
  const chipYs = [cy - CARD_H / 2, cy + CARD_H / 2 - CHIP_H];
  return (
    <g>
      <rect x={LANE_X} y={top} width={LANE_W} height={LANE_H} rx={R} fill={SOFT} />
      <HowCard cy={cy} title={row.how} sub={row.howSub} />
      <Arrow x1={HOW_X + HOW_W} x2={WALLET_X} cy={cy} label={row.step} />
      <WalletCard cy={cy} name={row.wallet} sub={row.walletSub} />
      <Arrow x1={WALLET_X + WALLET_W} x2={PLACE_X} cy={cy} />
      {row.places.map((p, i) => (
        <PlaceChip key={p.label} y={chipYs[i]} label={p.label} ok={p.ok} />
      ))}
    </g>
  );
}

export default function EKagaWalletDiagram(): ReactNode {
  return (
    <div style={{overflowX: 'auto', maxWidth: '100%'}}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        className="ekaga-wallet"
        aria-label="NFT販売サイトで使えるウォレットは2種類。Torus Wallet は NFT販売サイトで Google アカウントまたはメールアドレスから作成される。サイトごとにアドレスが変わるため、NFT販売サイトでは使えるが、他のサイトでは同じウォレットを使えない。MetaMask はブラウザ拡張やスマホアプリで作成し、NFT販売サイトに接続してログインする。どのサイトでも同じアドレスで使えるため、NFT販売サイトでも他のサイトでも使える"
        style={{width: '100%', minWidth: 680, maxWidth: WIDTH, height: 'auto', display: 'block'}}>
        <style>{STYLE}</style>
        <defs>
          <ArrowMarker id="ekaga-wallet-arrow" color={OPS} />
        </defs>

        <ColumnHead x={HOW_X} w={HOW_W} text="作成のしかた" />
        <ColumnHead x={WALLET_X} w={WALLET_W} text="ウォレット" />
        <ColumnHead x={PLACE_X} w={PLACE_W} text="使える場所" />

        {ROWS.map((row, i) => (
          <WalletLane key={row.wallet} top={LANE_TOPS[i]} row={row} />
        ))}
      </svg>
    </div>
  );
}
