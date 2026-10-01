import type {ReactNode} from 'react';
import styles from './styles.module.css';

type Category = 'owner' | 'government' | 'platform' | 'finance' | 'regulator';

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
  label?: string;
  dashed?: boolean;
  curve?: number;
};

const WIDTH = 680;
const HEIGHT = 300;

const nodes: Node[] = [
  {id: 'osaka', label: '大阪府徴税対策課', sublabel: 'POC発注元', x: 85, y: 150, category: 'government'},
  {id: 'dsk', label: '株式会社電算システム（DSK）', sublabel: 'プロジェクトオーナー', x: 345, y: 150, category: 'owner'},
  {id: 'startale', label: 'Startale', sublabel: 'JPYSC・ミニアプリ提供', x: 595, y: 60, category: 'platform'},
  {id: 'vct', label: 'SBI VCトレード', sublabel: '円換金', x: 595, y: 150, category: 'finance'},
  {id: 'shinsei', label: '新生信託銀行', sublabel: 'JPYSC信託事業者', x: 595, y: 240, category: 'finance'},
  {id: 'fsa', label: '金融庁', sublabel: '財務局経由', x: 345, y: 270, category: 'regulator'},
];

const edges: Edge[] = [
  {from: 'osaka', to: 'dsk', label: '収納代行'},
  {from: 'dsk', to: 'startale', curve: -14},
  {from: 'startale', to: 'vct', label: '紹介'},
  {from: 'startale', to: 'shinsei', label: '紹介', curve: 14},
  {from: 'shinsei', to: 'fsa', label: '事前相談'},
  {from: 'dsk', to: 'fsa', label: '同席', dashed: true, curve: 18},
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

export default function StakeholderDiagram(): ReactNode {
  return (
    <div className={styles.card}>
      <div className={styles.wrapper}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="xMidYMid meet">
          <defs>
            <marker
              id="arrowhead"
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
              <g key={`${edge.from}-${edge.to}`}>
                <path
                  d={path}
                  className={styles.edge}
                  strokeDasharray={edge.dashed ? '5 6' : undefined}
                  markerEnd="url(#arrowhead)"
                />
                {edge.label && (
                  <g>
                    <rect
                      x={midX - edge.label.length * 6}
                      y={midY - 13}
                      width={edge.label.length * 12}
                      height={15}
                      rx={7}
                      className={styles.edgeLabelBg}
                    />
                    <text x={midX} y={midY - 2} className={styles.edgeLabel} textAnchor="middle">
                      {edge.label}
                    </text>
                  </g>
                )}
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
