import type {CSSProperties, ReactNode} from 'react';
import {useCallback, useEffect, useMemo, useState} from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import {useHistory, useLocation} from '@docusaurus/router';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {useStaticUrl} from '@site/src/hooks/useStaticUrl';
import {getOpenApiFile} from '@site/src/data/apiCategories';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useApiCatalog} from '@site/src/hooks/useApiCatalog';
import {useApiRefLayout} from '@site/src/hooks/useApiRefLayout';
import ApiSidebar from './Sidebar';
import ApiEndpointDetail from './EndpointDetail';
import ApiCodePanel from './CodePanel';
import styles from './styles.module.css';

function ExplorerInner(): ReactNode {
  const history = useHistory();
  const location = useLocation();
  const {i18n} = useDocusaurusContext();
  const {catalog, endpoints, status, error} = useApiCatalog();
  const [search, setSearch] = useState('');
  const [variantIdx, setVariantIdx] = useState(0);
  const openapiFile = getOpenApiFile(i18n.currentLocale);
  const openapiUrl = useStaticUrl(`/openapi/${openapiFile}`);
  const {layoutStyle, resetSidebarWidth, resetPanelWidth, onResizeSidebar, onResizePanel} =
    useApiRefLayout();

  const hashId = location.hash.replace(/^#/, '');

  const selectedEndpoint = useMemo(() => {
    if (!endpoints.length) return null;
    const fromHash = hashId ? endpoints.find(ep => ep.id === hashId) : null;
    return fromHash ?? endpoints[0];
  }, [endpoints, hashId]);

  const selectEndpoint = useCallback(
    (id: string) => {
      setVariantIdx(0);
      history.replace({
        pathname: location.pathname,
        search: location.search,
        hash: id,
      });
    },
    [history, location.pathname, location.search],
  );

  useEffect(() => {
    setVariantIdx(0);
  }, [selectedEndpoint?.id]);

  useEffect(() => {
    if (status !== 'ready' || !endpoints.length) return;

    const hashValid = hashId && endpoints.some(ep => ep.id === hashId);
    if (hashValid) return;

    let cancelled = false;
    const defaultId = endpoints[0].id;
    const timer = window.setTimeout(() => {
      if (cancelled) return;
      try {
        history.replace({
          pathname: location.pathname,
          search: location.search,
          hash: defaultId,
        });
      } catch {
        /* ignore router errors during locale navigation */
      }
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [status, endpoints, hashId, history, location.pathname, location.search]);

  if (status === 'loading') {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner} />
        <Translate id="api.loading">Loading API reference…</Translate>
      </div>
    );
  }

  if (status === 'error' || !catalog) {
    return (
      <div className={styles.errorState}>
        <p>
          <Translate id="api.redocError">Unable to load API reference.</Translate>
        </p>
        {error && <p className={styles.errorDetail}>{error}</p>}
        <a className="button button--primary button--sm" href={openapiUrl} download={openapiFile}>
          <Translate id="api.downloadOpenapi">Download OpenAPI</Translate>
        </a>
      </div>
    );
  }

  return (
    <div className={styles.explorer} style={layoutStyle as CSSProperties}>

      <div className={styles.layout}>
        <ApiSidebar
          catalog={catalog}
          endpoints={endpoints}
          selectedId={selectedEndpoint?.id ?? null}
          onSelect={selectEndpoint}
          search={search}
          onSearchChange={setSearch}
        />
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize sidebar"
          className={clsx(styles.resizeHandle, styles.resizeHandleSidebar)}
          onPointerDown={onResizeSidebar}
          onDoubleClick={resetSidebarWidth}
        />
        <main className={styles.main}>
          <ApiEndpointDetail
            endpoint={selectedEndpoint}
            baseUrl={catalog.baseUrl}
            variantIdx={variantIdx}
            onVariantSelect={setVariantIdx}
          />
        </main>
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize code panel"
          className={clsx(styles.resizeHandle, styles.resizeHandlePanel)}
          onPointerDown={onResizePanel}
          onDoubleClick={resetPanelWidth}
        />
        <aside className={styles.rightPanel}>
          <ApiCodePanel
            endpoint={selectedEndpoint}
            baseUrl={catalog.baseUrl}
            variantIdx={variantIdx}
            onVariantChange={setVariantIdx}
          />
        </aside>
      </div>
    </div>
  );
}

export default function ApiReferenceExplorer(): ReactNode {
  return (
    <BrowserOnly fallback={<div className={styles.loadingState}>Loading…</div>}>
      {() => <ExplorerInner />}
    </BrowserOnly>
  );
}
