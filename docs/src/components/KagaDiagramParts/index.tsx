import type {ReactNode} from 'react';

// 加賀市の図解（関係者図・業務フロー図）で共通に使う部品

export const FLOW = 'var(--ifm-color-primary)';
export const OPS = 'var(--ifm-color-emphasis-600)';
export const TEXT = 'var(--ifm-font-color-base)';
export const SUBTEXT = 'var(--ifm-color-emphasis-700)';
export const SURFACE = 'var(--ifm-background-surface-color)';
export const LANE = 'var(--ifm-color-emphasis-100)';

// 円の流れの色（テーマ別）。<style>{YEN_STYLE}</style> として図に埋め込み、kaga-yen-* クラスで使う
export const YEN_STYLE = `
.kaga-yen-stroke { stroke: #d97706; }
.kaga-yen-fill { fill: #d97706; }
[data-theme='dark'] .kaga-yen-stroke { stroke: #f2b84b; }
[data-theme='dark'] .kaga-yen-fill { fill: #f2b84b; }
`;

export type IconKind = 'person' | 'org' | 'shop' | 'coin' | 'cityhall';

export function Icon({kind, color = TEXT}: {kind: IconKind; color?: string}): ReactNode {
  switch (kind) {
    case 'person':
      return (
        <g fill={color}>
          <circle cx={0} cy={-6} r={5.5} />
          <path d="M-10,11 C-10,2 -5,0.5 0,0.5 C5,0.5 10,2 10,11 Z" />
        </g>
      );
    case 'org':
      return (
        <g fill="none" stroke={color} strokeWidth={1.6}>
          <rect x={-9} y={-11} width={18} height={22} rx={1.5} />
          <g fill={color} stroke="none">
            <rect x={-5.5} y={-7} width={4} height={3.5} />
            <rect x={1.5} y={-7} width={4} height={3.5} />
            <rect x={-5.5} y={-1} width={4} height={3.5} />
            <rect x={1.5} y={-1} width={4} height={3.5} />
            <rect x={-2} y={5} width={4} height={6} />
          </g>
        </g>
      );
    case 'shop':
      return (
        <g stroke={color} strokeWidth={1.6} strokeLinejoin="round">
          <path d="M-12,-5 L-9,-12 L9,-12 L12,-5 Z" fill={color} />
          <rect x={-10} y={-5} width={20} height={16} fill="none" />
          <rect x={-3} y={3} width={6} height={8} fill={color} stroke="none" />
        </g>
      );
    case 'coin':
      return (
        <g>
          <circle cx={0} cy={0} r={12} fill="none" stroke={color} strokeWidth={1.8} />
          <text x={0} y={5} textAnchor="middle" fontSize={14} fontWeight={700} fill={color}>
            ¥
          </text>
        </g>
      );
    case 'cityhall':
      return (
        <g stroke={color} strokeWidth={1.6} strokeLinejoin="round">
          <path d="M-12,-5 L0,-12 L12,-5 Z" fill={color} />
          <line x1={-8} y1={-3} x2={-8} y2={7} />
          <line x1={-3} y1={-3} x2={-3} y2={7} />
          <line x1={3} y1={-3} x2={3} y2={7} />
          <line x1={8} y1={-3} x2={8} y2={7} />
          <rect x={-12} y={8} width={24} height={3} fill={color} />
        </g>
      );
  }
}

// 角丸の四角に入れたアイコン（関係者）。size は一辺の長さ
export function IconTile({x, cy, size, kind}: {x: number; cy: number; size: number; kind: IconKind}): ReactNode {
  return (
    <g>
      <rect x={x - size / 2} y={cy - size / 2} width={size} height={size} rx={size * 0.22} fill={LANE} />
      <g transform={`translate(${x}, ${cy}) scale(${size / 40})`}>
        <Icon kind={kind} />
      </g>
    </g>
  );
}

// 関係者カード（アイコン・名前・位置づけを縦に並べる）
export function ActorCard({x, top, w, h, kind, name, role, nameSize = 13.5}: {x: number; top: number; w: number; h: number; kind: IconKind; name: string[]; role?: string; nameSize?: number}): ReactNode {
  // 中身（アイコン〜位置づけ）は高さ110を基準に組み、カードの高さに応じて縦中央に寄せる
  const offset = (h - 110) / 2;
  const nameY = top + offset + 66;
  const lineH = nameSize * 1.2;
  return (
    <g>
      <rect x={x - w / 2} y={top} width={w} height={h} rx={12} fill={SURFACE} stroke={FLOW} strokeWidth={1.6} />
      <IconTile x={x} cy={top + offset + 28} size={34} kind={kind} />
      <Name x={x} y={nameY} lines={name} size={nameSize} />
      {role && (
        <text x={x} y={nameY + (name.length - 1) * lineH + 19} textAnchor="middle" fontSize={role.length > 7 ? 11 : 11.5} fill={SUBTEXT}>
          {role}
        </text>
      )}
    </g>
  );
}

// 複数行の名前（中央揃え）
export function Name({x, y, lines, size = 15}: {x: number; y: number; lines: string[]; size?: number}): ReactNode {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize={size} fontWeight={700} fill={TEXT}>
      {lines.map((l, i) => (
        <tspan key={l} x={x} dy={i === 0 ? 0 : size * 1.2}>
          {l}
        </tspan>
      ))}
    </text>
  );
}

export function WalletGlyph({x, y, color = FLOW}: {x: number; y: number; color?: string}): ReactNode {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={0} y={0} width={22} height={16} rx={3} fill="none" stroke={color} strokeWidth={1.7} />
      <rect x={13} y={5} width={9} height={6} rx={1.5} fill={color} />
    </g>
  );
}

// 法人ウォレット（アイコンと文字を横並び。stacked は縦積み）
// no を指定すると、名前の後ろに丸数字（①②など）を図形で描く。フォントの丸数字は小さく表示されるため
export function CorporateWalletCard({x, top, w, h, size = 13, stacked = false, label = '法人ウォレット', no}: {x: number; top: number; w: number; h: number; size?: number; stacked?: boolean; label?: string; no?: number}): ReactNode {
  const x0 = x - w / 2;
  const cy = top + h / 2;
  if (stacked) {
    return (
      <g>
        <rect x={x0} y={top} width={w} height={h} rx={10} fill={SURFACE} stroke={FLOW} strokeWidth={1.8} />
        <WalletGlyph x={x - 11} y={top + 12} />
        <text x={x} y={top + h - 14} textAnchor="middle" fontSize={size} fontWeight={700} fill={TEXT}>
          {label}
        </text>
      </g>
    );
  }
  const NO_R = 8;
  const labelW = size * label.length;
  const contentW = 22 + 8 + labelW + (no ? NO_R * 2 + 4 : 0);
  const start = x - contentW / 2;
  const noCx = start + 30 + labelW + 4 + NO_R;
  return (
    <g>
      <rect x={x0} y={top} width={w} height={h} rx={10} fill={SURFACE} stroke={FLOW} strokeWidth={1.8} />
      <WalletGlyph x={start} y={cy - 8} />
      <text x={start + 30} y={cy + size * 0.36} fontSize={size} fontWeight={700} fill={TEXT}>
        {label}
      </text>
      {no && (
        <g>
          <circle cx={noCx} cy={cy} r={NO_R} fill="none" stroke={TEXT} strokeWidth={1.4} />
          <text x={noCx} y={cy + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEXT}>
            {no}
          </text>
        </g>
      )}
    </g>
  );
}

// e-加賀市民の市民アプリ（既存のWebアプリ。ウォレットはNFT販売サイトで作るTorus Wallet）。上部の帯で法人ウォレットと区別する
export function WebAppWalletCard({x, top, w, h, size = 13, stacked = false}: {x: number; top: number; w: number; h: number; size?: number; stacked?: boolean}): ReactNode {
  const x0 = x - w / 2;
  const BAR_H = 20;
  const bodyCy = top + BAR_H + (h - BAR_H) / 2;
  const contentW = 22 + 8 + size * 6.2;
  const start = x - contentW / 2;
  return (
    <g>
      <rect x={x0} y={top} width={w} height={h} rx={10} fill={SURFACE} stroke={FLOW} strokeWidth={1.8} />
      <path
        d={`M${x0},${top + BAR_H} L${x0},${top + 10} Q${x0},${top} ${x0 + 10},${top} L${x0 + w - 10},${top} Q${x0 + w},${top} ${x0 + w},${top + 10} L${x0 + w},${top + BAR_H} Z`}
        fill={FLOW}
      />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={x0 + 11 + i * 7} cy={top + BAR_H / 2} r={2} fill={SURFACE} />
      ))}
      <text x={x + 10} y={top + 14.5} textAnchor="middle" fontSize={12} fontWeight={700} fill={SURFACE}>
        市民アプリ
      </text>
      {stacked ? (
        <>
          <WalletGlyph x={x - 11} y={top + BAR_H + 6} />
          <text x={x} y={top + h - 10} textAnchor="middle" fontSize={size} fontWeight={700} fill={TEXT}>
            Torus Wallet
          </text>
        </>
      ) : (
        <>
          <WalletGlyph x={start} y={bodyCy - 8} />
          <text x={start + 30} y={bodyCy + size * 0.36} fontSize={size} fontWeight={700} fill={TEXT}>
            Torus Wallet
          </text>
        </>
      )}
    </g>
  );
}

export function StepNo({x, y, n}: {x: number; y: number; n: number}): ReactNode {
  return (
    <g>
      <circle cx={x} cy={y} r={10} fill={FLOW} />
      <text x={x} y={y + 4.5} textAnchor="middle" fontSize={13} fontWeight={700} fill={SURFACE}>
        {n}
      </text>
    </g>
  );
}

export function ArrowMarker({id, color, className}: {id: string; color?: string; className?: string}): ReactNode {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill={color} className={className} />
    </marker>
  );
}
