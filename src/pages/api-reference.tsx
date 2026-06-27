import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Translate, {translate} from '@docusaurus/Translate';
import ApiReferenceExplorer from '@site/src/components/ApiReference';
import styles from './api-reference.module.css';

export default function ApiReference(): ReactNode {
  const pageTitle = translate({id: 'api.title', message: 'API Reference'});
  const metaDescription = translate({
    id: 'api.metaDescription',
    message:
      'Interactive API reference — 49 endpoints for OpenAI, Claude, Gemini, Midjourney, Suno, and more.',
  });

  return (
    <Layout title={pageTitle} description={metaDescription} noFooter wrapperClassName={styles.layoutRoot}>
      <ApiReferenceExplorer />
    </Layout>
  );
}
