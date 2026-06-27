import type {ReactNode} from 'react';
import Translate from '@docusaurus/Translate';
import {API_STATS} from '@site/src/data/apiCategories';
import styles from './styles.module.css';

export default function HomepageStats(): ReactNode {
  return (
    <section className={styles.stats}>
      <div className="container">
        <div className={styles.row}>
          <div className={styles.item}>
            <div className={styles.number}>{API_STATS.endpoints}+</div>
            <div className={styles.label}>
              <Translate id="homepage.stat.endpoints">API Endpoints</Translate>
            </div>
          </div>
          <div className={styles.divider} />
          <div className={styles.item}>
            <div className={styles.number}>{API_STATS.categories}</div>
            <div className={styles.label}>
              <Translate id="homepage.stat.categories">Categories</Translate>
            </div>
          </div>
          <div className={styles.divider} />
          <div className={styles.item}>
            <div className={styles.number}>{API_STATS.providers}+</div>
            <div className={styles.label}>
              <Translate id="homepage.stat.providers">AI Providers</Translate>
            </div>
          </div>
          <div className={styles.divider} />
          <div className={styles.item}>
            <div className={styles.number}>7</div>
            <div className={styles.label}>
              <Translate id="homepage.stat.languages">Languages</Translate>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
