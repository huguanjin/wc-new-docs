import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepageStats from '@site/src/components/HomepageStats';
import ApiCategoryGrid from '@site/src/components/ApiCategoryGrid';
import Heading from '@theme/Heading';
import Translate, {translate} from '@docusaurus/Translate';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <img src="/img/logo.png" alt="Webchannel" className={styles.heroLogo} />
        <Heading as="h1" className="hero__title">
          <Translate id="site.title">Webchannel</Translate>
        </Heading>
        <p className="hero__subtitle">
          <Translate id="homepage.tagline">{siteConfig.tagline}</Translate>
        </p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs/getting-started/installation">
            <Translate id="homepage.getStarted">Get Started</Translate>
          </Link>
          <Link className="button button--secondary button--lg" to="/api-reference">
            <Translate id="homepage.apiReference">API Reference</Translate>
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            href="https://github.com/QuantumNous/new-api">
            GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}

function ApiPreviewSection() {
  return (
    <section className={styles.apiSection}>
      <div className="container">
        <div className={styles.apiSectionHeader}>
          <Heading as="h2" className={styles.apiSectionTitle}>
            <Translate id="homepage.apiSection.title">Explore 135+ API Endpoints</Translate>
          </Heading>
          <p className={styles.apiSectionDesc}>
            <Translate id="homepage.apiSection.desc">
              OpenAI, Claude, Gemini, Midjourney, Suno, and more — all through one unified gateway.
            </Translate>
          </p>
          <Link to="/api-reference" className={styles.apiSectionLink}>
            <Translate id="homepage.apiSection.link">View full API reference →</Translate>
          </Link>
        </div>
        <ApiCategoryGrid compact />
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const metaDescription = translate({
    id: 'homepage.metaDescription',
    message:
      'Official documentation for Webchannel — unified LLM gateway supporting OpenAI, Claude, Gemini and 40+ AI providers.',
  });
  return (
    <Layout title="Webchannel" description={metaDescription}>
      <HomepageHeader />
      <HomepageStats />
      <main>
        <HomepageFeatures />
        <ApiPreviewSection />
      </main>
    </Layout>
  );
}
