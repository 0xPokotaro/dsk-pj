import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {statusLabel} from './data';
import type {Task} from './data';
import styles from './styles.module.css';

export default function TaskModal({task, onClose}: {task: Task; onClose: () => void}): ReactNode {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <span className={styles.cardGroup}>{task.group}</span>
          <button className={styles.closeButton} onClick={onClose} aria-label="閉じる">
            ×
          </button>
        </div>
        <h3 className={styles.modalTitle}>{task.title}</h3>
        <span className={styles.badge}>{statusLabel[task.status]}</span>

        {task.question && (
          <div className={styles.modalSection}>
            <h4 className={styles.modalSectionTitle}>確認・検討事項</h4>
            <p className={styles.modalSectionText}>{task.question}</p>
          </div>
        )}

        {task.background && task.background.length > 0 && (
          <div className={styles.modalSection}>
            <h4 className={styles.modalSectionTitle}>背景・内容詳細</h4>
            <ul className={styles.modalDetails}>
              {task.background.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {task.answer && (
          <div className={styles.modalSection}>
            <h4 className={styles.modalSectionTitle}>回答</h4>
            <p className={styles.modalSectionText}>{task.answer}</p>
          </div>
        )}

        {task.link && (
          <Link to={task.link.href} className={styles.modalLink}>
            {task.link.label} →
          </Link>
        )}
      </div>
    </div>
  );
}
