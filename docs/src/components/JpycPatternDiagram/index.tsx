import type {ReactNode} from 'react';
import {Icon, ArrowMarker, FLOW, LANE, OPS, StepNo, SUBTEXT, SURFACE, TEXT} from '../KagaDiagramParts';
import type {IconKind} from '../KagaDiagramParts';

// JPYC利用先制御の各パターンの流れ図
export type Pattern = 'smart-account' | 'deposit' | 'wrapper' | 'nft';

const WIDTH = 860;
const HEIGHT = 300;
const NODE_W = 130;
const NODE_H = 64;
const REJECT = '#e5484d';
const SOURCE = ['加賀国家', '戦略特区', '推進機構'];

function Node({x, cy, kind, label, dashed = false}: {x: number; cy: number; kind: IconKind; label: string | string[]; dashed?: boolean}): ReactNode {
  const lines = Array.isArray(label) ? label : [label];
  const size = lines.length > 2 ? 12 : lines.length > 1 ? 13 : 14;
  const lineH = size * 1.25;
  const y0 = cy + 5 - ((lines.length - 1) * lineH) / 2;
  return (
    <g>
      <rect
        x={x - NODE_W / 2}
        y={cy - NODE_H / 2}
        width={NODE_W}
        height={NODE_H}
        rx={10}
        fill={SURFACE}
        stroke={dashed ? OPS : FLOW}
        strokeWidth={1.6}
        strokeDasharray={dashed ? '5 4' : undefined}
      />
      <g transform={`translate(${x - NODE_W / 2 + 26}, ${cy}) scale(0.85)`}>
        <Icon kind={kind} color={dashed ? SUBTEXT : TEXT} />
      </g>
      <text x={x - NODE_W / 2 + 50} y={y0} fontSize={size} fontWeight={700} fill={dashed ? SUBTEXT : TEXT}>
        {lines.map((l, i) => (
          <tspan key={l} x={x - NODE_W / 2 + 50} dy={i === 0 ? 0 : lineH}>
            {l}
          </tspan>
        ))}
      </text>
    </g>
  );
}

function Box({x, cy, w, h, title, chips}: {x: number; cy: number; w: number; h: number; title: string; chips: string[]}): ReactNode {
  const top = cy - h / 2;
  return (
    <g>
      <rect x={x - w / 2} y={top} width={w} height={h} rx={12} fill={LANE} stroke={FLOW} strokeWidth={1.8} />
      <text x={x} y={top + 24} textAnchor="middle" fontSize={14} fontWeight={700} fill={TEXT}>
        {title}
      </text>
      {chips.map((c, i) => (
        <g key={c}>
          <rect x={x - w / 2 + 14} y={top + 38 + i * 38} width={w - 28} height={30} rx={7} fill={SURFACE} stroke={FLOW} strokeWidth={1.2} />
          <text x={x} y={top + 58 + i * 38} textAnchor="middle" fontSize={12.5} fill={TEXT}>
            {c}
          </text>
        </g>
      ))}
    </g>
  );
}

type ArrowSpec = {
  id: string;
  points: [number, number][];
  label: string;
  lx: number;
  ly: number;
  anchor?: 'middle' | 'start';
  no?: number;
  dashed?: boolean;
  reject?: boolean;
};

function Arrow({a}: {a: ArrowSpec}): ReactNode {
  const color = a.reject ? REJECT : OPS;
  const w = a.label.length * 12.5 + (a.no ? 26 : 0);
  const start = a.anchor === 'start' ? a.lx : a.lx - w / 2;
  return (
    <g>
      <polyline
        points={a.points.map((p) => p.join(',')).join(' ')}
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeDasharray={a.dashed || a.reject ? '5 4' : undefined}
        markerEnd={`url(#${a.id}-${a.reject ? 'x' : 'n'})`}
      />
      {a.no && <StepNo x={start + 10} y={a.ly - 4} n={a.no} />}
      <text x={start + (a.no ? 26 : 0)} y={a.ly} fontSize={13} fontWeight={600} fill={a.reject ? REJECT : TEXT}>
        {a.label}
      </text>
    </g>
  );
}

function Frame({id, label, children, arrows}: {id: string; label: string; children: ReactNode; arrows: ArrowSpec[]}): ReactNode {
  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={label} style={{width: '100%', maxWidth: WIDTH, height: 'auto'}}>
      <defs>
        <ArrowMarker id={`${id}-n`} color={OPS} />
        <ArrowMarker id={`${id}-x`} color={REJECT} />
      </defs>
      {children}
      {arrows.map((a) => (
        <Arrow key={a.label} a={{...a, id}} />
      ))}
    </svg>
  );
}

// 事業者 → コントラクト → 地域事業者、ユーザーが上から指示する形（スマートアカウント・デポジット共通）
function ContractFlow({id, label, boxTitle, chips, distribute, instruct, pay}: {id: string; label: string; boxTitle: string; chips: string[]; distribute: string; instruct: string; pay: string}): ReactNode {
  const arrows: ArrowSpec[] = [
    {id, points: [[155, 170], [310, 170]], label: distribute, lx: 232, ly: 160, no: 1},
    {id, points: [[430, 70], [430, 100]], label: instruct, lx: 445, ly: 90, anchor: 'start', no: 2},
    {id, points: [[550, 130], [705, 130]], label: pay, lx: 627, ly: 120, no: 3},
    {id, points: [[550, 225], [705, 225]], label: '拒否', lx: 627, ly: 215, reject: true},
  ];
  return (
    <Frame id={id} label={label} arrows={arrows}>
      <Node x={90} cy={170} kind="cityhall" label={SOURCE} />
      <Node x={430} cy={40} kind="person" label="ユーザー" />
      <Box x={430} cy={170} w={240} h={140} title={boxTitle} chips={chips} />
      <Node x={770} cy={120} kind="shop" label="地域事業者" />
      <Node x={770} cy={230} kind="shop" label={['地域事業者', '以外']} dashed />
    </Frame>
  );
}

function Wrapper(): ReactNode {
  const id = 'jpyc-wrapper';
  const arrows: ArrowSpec[] = [
    {id, points: [[155, 80], [320, 80]], label: 'JPYC を預ける', lx: 237, ly: 70, no: 1},
    {id, points: [[540, 80], [705, 80]], label: 'トークンを配布', lx: 622, ly: 70, no: 2},
    {id, points: [[770, 112], [770, 245], [495, 245]], label: 'トークンを送る', lx: 640, ly: 235, no: 3},
    {id, points: [[430, 213], [430, 140]], label: 'JPYC に換金', lx: 445, ly: 182, anchor: 'start', no: 4},
  ];
  return (
    <Frame id={id} label="ラッパートークンの流れ" arrows={arrows}>
      <Node x={90} cy={80} kind="cityhall" label={SOURCE} />
      <Box x={430} cy={80} w={220} h={120} title="ラッパーコントラクト" chips={['JPYC を保管', '用途制限付きトークンを発行']} />
      <Node x={770} cy={80} kind="person" label="ユーザー" />
      <Node x={430} cy={245} kind="shop" label="地域事業者" />
      <text x={640} y={272} textAnchor="middle" fontSize={12} fontWeight={600} fill={REJECT}>
        地域事業者以外へは送れない
      </text>
    </Frame>
  );
}

function Nft(): ReactNode {
  const id = 'jpyc-nft';
  const arrows: ArrowSpec[] = [
    {id, points: [[155, 70], [365, 70]], label: 'NFT を配布', lx: 260, ly: 60, no: 1},
    {id, points: [[495, 70], [705, 70]], label: 'NFT を渡す', lx: 600, ly: 60, no: 2},
    {id, points: [[745, 102], [745, 222], [555, 222]], label: '換金を依頼', lx: 650, ly: 212, no: 3},
    {id, points: [[555, 258], [795, 258], [795, 102]], label: 'JPYC を支払う', lx: 675, ly: 248, no: 4},
    {id, points: [[90, 102], [90, 235], [305, 235]], label: 'JPYC を用意', lx: 198, ly: 225, dashed: true},
  ];
  return (
    <Frame id={id} label="NFTクーポンの流れ" arrows={arrows}>
      <Node x={90} cy={70} kind="cityhall" label={SOURCE} />
      <Node x={430} cy={70} kind="person" label="ユーザー" />
      <Node x={770} cy={70} kind="shop" label="地域事業者" />
      <Box x={430} cy={235} w={250} h={80} title="換金用のコントラクト" chips={['地域事業者だけが換金できる']} />
    </Frame>
  );
}

export default function JpycPatternDiagram({pattern}: {pattern: Pattern}): ReactNode {
  switch (pattern) {
    case 'smart-account':
      return (
        <ContractFlow
          id="jpyc-sa"
          label="スマートアカウントの流れ"
          boxTitle="スマートアカウント"
          chips={['配布分の残高を記録', '送金先を確認']}
          distribute="JPYC を配布"
          instruct="送金を指示"
          pay="送金"
        />
      );
    case 'deposit':
      return (
        <ContractFlow
          id="jpyc-dp"
          label="デポジットの流れ"
          boxTitle="デポジットコントラクト"
          chips={['ユーザーの残高を記録', '払い出し先を確認']}
          distribute="JPYC を預ける"
          instruct="支払いを指示"
          pay="払い出し"
        />
      );
    case 'wrapper':
      return <Wrapper />;
    case 'nft':
      return <Nft />;
  }
}
