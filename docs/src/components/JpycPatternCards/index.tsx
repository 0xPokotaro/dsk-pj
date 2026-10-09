import type {ReactNode} from 'react';
import styles from './styles.module.css';

// 制御パターンの一覧。表の代わりに、パターンごとのカードで「仕組み・配布・決済」を並べる

type Pattern = {
  no: number;
  name: string;
  mechanism: string[];
  distribution: string;
  payment: string;
};

const patterns: Pattern[] = [
  {
    no: 1,
    name: 'スマートアカウント',
    mechanism: ['スマートアカウントが、配布分の残高を記録する', '配布分の範囲では、地域事業者以外への送金を拒否する'],
    distribution: 'ユーザーのスマートアカウントに、JPYC を配布する',
    payment: 'スマートアカウントから、地域事業者に JPYC を送金する',
  },
  {
    no: 2,
    name: 'デポジット',
    mechanism: ['コントラクトが、配布分だけを預かる', '地域事業者以外への払い出しを拒否する'],
    distribution: 'コントラクトに JPYC を預け、ユーザーの残高として付与する',
    payment: '預けた残高から、地域事業者に支払う',
  },
  {
    no: 3,
    name: 'ラッパートークン',
    mechanism: ['配布分だけを、用途制限付きのトークンにする', 'トークンは、地域事業者以外に送れない'],
    distribution: 'JPYC を用途制限付きのトークンに交換し、配布する',
    payment: 'トークンを地域事業者に送る。地域事業者が JPYC に換金する',
  },
  {
    no: 4,
    name: 'NFTクーポン',
    mechanism: ['配布分を、NFT クーポンに置き換える', '地域事業者以外は、NFT を JPYC に換金できない'],
    distribution: 'JPYC の代わりに、NFT クーポンを配布する',
    payment: 'NFT を地域事業者に渡す。地域事業者が JPYC に換金する',
  },
];

function Card({p}: {p: Pattern}): ReactNode {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <span className={styles.no}>{p.no}</span>
        <h4 className={styles.name}>{p.name}</h4>
      </header>
      <div className={styles.body}>
        <section className={styles.mechanism}>
          <div className={styles.label}>仕組み</div>
          <ul className={styles.list}>
            {p.mechanism.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </section>
        <div className={styles.flow}>
          <section className={styles.step}>
            <div className={styles.label}>配布</div>
            <p className={styles.text}>{p.distribution}</p>
          </section>
          <div className={styles.arrow} aria-hidden="true">
            →
          </div>
          <section className={styles.step}>
            <div className={styles.label}>決済</div>
            <p className={styles.text}>{p.payment}</p>
          </section>
        </div>
      </div>
    </article>
  );
}

export default function JpycPatternCards(): ReactNode {
  return (
    <div className={styles.grid}>
      {patterns.map((p) => (
        <Card key={p.no} p={p} />
      ))}
    </div>
  );
}
