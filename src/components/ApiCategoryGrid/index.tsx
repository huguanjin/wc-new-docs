import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import {API_CATEGORIES} from '@site/src/data/apiCategories';
import styles from './styles.module.css';

type Props = {
  compact?: boolean;
};

export default function ApiCategoryGrid({compact = false}: Props): ReactNode {
  return (
    <div className={clsx(styles.grid, compact && styles.gridCompact)}>
      {API_CATEGORIES.map(cat => (
        <Link key={cat.slug} to={`/docs/api/${cat.slug}`} className={styles.card}>
          <div className={styles.cardGlow} style={{'--cat-color': cat.color} as React.CSSProperties} />
          <div className={styles.cardIcon} style={{background: `${cat.color}18`, color: cat.color}}>
            {cat.icon}
          </div>
          <div className={styles.cardBody}>
            <h3 className={styles.cardTitle}>
              <Translate id={cat.translateId}>{cat.defaultLabel}</Translate>
            </h3>
            <p className={styles.cardDesc}>
              <Translate id={`${cat.translateId}.desc`}>{cat.defaultDesc}</Translate>
            </p>
            <span className={styles.cardBadge}>
              {cat.endpoints}{' '}
              <Translate id="api.badge.apis">APIs</Translate>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
