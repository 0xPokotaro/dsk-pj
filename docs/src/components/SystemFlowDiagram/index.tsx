import type {ReactNode} from 'react';
import styles from './styles.module.css';

type Category = 'government' | 'citizen' | 'platform' | 'owner' | 'finance';

type Node = {
  id: string;
  label: string;
  sublabel?: string;
  x: number;
  y: number;
  category: Category;
};

type Edge = {
  from: string;
  to: string;
  label: string;
  dashed?: boolean;
  curve?: number;
};

const WIDTH = 950;
const HEIGHT = 300;

const nodes: Node[] = [
  {id: 'osaka', label: '大阪府徴税対策課', sublabel: '料金通知・入金受領', x: 90, y: 55, category: 'government'},
  {id: 'citizen', label: '納税者', sublabel: '払込票を受け取り、ミニアプリで支払う', x: 80, y: 245, category: 'citizen'},
  {id: 'app', label: 'Startale App（ミニアプリ）', sublabel: 'ウォレットでJPYSCを保有、バーコード読取りで支払い', x: 360, y: 245, category: 'platform'},
  {id: 'dsk', label: 'DSK', sublabel: '収納代行・⑤代理受領、収納データ生成', x: 640, y: 150, category: 'owner'},
  {id: 'vct', label: 'SBI VCトレード', sublabel: 'JPYSCの販売・出庫、JPYSCの売却', x: 900, y: 150, category: 'finance'},
];

const edges: Edge[] = [
  {from: 'osaka', to: 'citizen', label: '①料金通知'},
  {from: 'citizen', to: 'app', label: '読み取り'},
  {from: 'vct', to: 'app', label: '②③事前準備：口座開設・JPYSC購入・出庫', dashed: true, curve: -90},
  {from: 'app', to: 'dsk', label: '④JPYSCで支払い'},
  {from: 'dsk', to: 'vct', label: '⑥円転'},
  {from: 'dsk', to: 'osaka', label: '⑦公金払込＋消込データ連携', curve: -40},
];

function findNode(id: string): Node {
  const node = nodes.find((n) => n.id === id);
  if (!node) {
    throw new Error(`Unknown node: ${id}`);
  }
  return node;
}

function edgePath(edge: Edge): {path: string; midX: number; midY: number} {
  const from = findNode(edge.from);
  const to = findNode(edge.to);
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.hypot(dx, dy) || 1;
  const nx = -dy / dist;
  const ny = dx / dist;
  const curve = edge.curve ?? 0;
  const ctrlX = (from.x + to.x) / 2 + nx * curve;
  const ctrlY = (from.y + to.y) / 2 + ny * curve;
  return {
    path: `M ${from.x} ${from.y} Q ${ctrlX} ${ctrlY} ${to.x} ${to.y}`,
    midX: ctrlX,
    midY: ctrlY,
  };
}

export default function SystemFlowDiagram(): ReactNode {
  return (
    <div className={styles.card}>
      <div className={styles.wrapper}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="xMidYMid meet">
          <defs>
            <marker
              id="system-flow-arrowhead"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" className={styles.arrowhead} />
            </marker>
          </defs>
          {edges.map((edge) => {
            const {path, midX, midY} = edgePath(edge);
            return (
              <g key={`${edge.from}-${edge.to}-${edge.label}`}>
                <path
                  d={path}
                  className={styles.edge}
                  strokeDasharray={edge.dashed ? '5 6' : undefined}
                  markerEnd="url(#system-flow-arrowhead)"
                />
                <rect
                  x={midX - edge.label.length * 6}
                  y={midY - 13}
                  width={edge.label.length * 12}
                  height={16}
                  rx={8}
                  className={styles.edgeLabelBg}
                />
                <text x={midX} y={midY - 1} className={styles.edgeLabel} textAnchor="middle">
                  {edge.label}
                </text>
              </g>
            );
          })}
        </svg>
        {nodes.map((node) => (
          <div
            key={node.id}
            className={`${styles.node} ${styles[`category-${node.category}`]}`}
            style={{
              left: `${(node.x / WIDTH) * 100}%`,
              top: `${(node.y / HEIGHT) * 100}%`,
            }}>
            <div className={styles.nodeLabel}>{node.label}</div>
            {node.sublabel && <div className={styles.nodeSublabel}>{node.sublabel}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
