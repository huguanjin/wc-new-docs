import type {ReactNode} from 'react';
import {useEffect, useRef, useState} from 'react';
import Translate from '@docusaurus/Translate';
import {useStaticUrl} from '@site/src/hooks/useStaticUrl';
import styles from './styles.module.css';

type RedocGlobal = {
  init: (url: string, opts: object, el: HTMLElement) => Promise<void> | void;
};

declare global {
  interface Window {
    Redoc?: RedocGlobal;
  }
}

const REDOC_SCRIPT_ID = 'redoc-standalone-script';
let redocScriptPromise: Promise<void> | null = null;

function loadRedocScript(src: string): Promise<void> {
  if (window.Redoc) return Promise.resolve();
  if (redocScriptPromise) return redocScriptPromise;

  redocScriptPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(REDOC_SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      if (window.Redoc) {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve(), {once: true});
      existing.addEventListener('error', () => reject(new Error('Redoc script failed to load')), {once: true});
      return;
    }

    const script = document.createElement('script');
    script.id = REDOC_SCRIPT_ID;
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Redoc script failed to load'));
    document.body.appendChild(script);
  });

  return redocScriptPromise;
}

type Props = {
  specUrl: string;
};

export default function RedocViewer({specUrl}: Props): ReactNode {
  const redocScript = useStaticUrl('/js/redoc.standalone.js');
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container) return;

    setStatus('loading');
    setErrorMsg('');
    container.innerHTML = '';

    void (async () => {
      try {
        await loadRedocScript(redocScript);
        if (cancelled || !window.Redoc) return;

        const result = window.Redoc.init(
          specUrl,
          {
            scrollYOffset: 80,
            hideDownloadButton: false,
            theme: {
              colors: {primary: {main: '#667eea'}},
            },
          },
          container,
        );

        if (result && typeof (result as Promise<void>).then === 'function') {
          await result;
        }

        if (!cancelled) setStatus('ready');
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error
            ? err.message
            : typeof err === 'string'
              ? err
              : 'Failed to load API specification';
        setErrorMsg(message);
        setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
      container.innerHTML = '';
    };
  }, [redocScript, specUrl]);

  return (
    <div className={styles.wrapper}>
      {status === 'loading' && (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner} />
          <p>
            <Translate id="api.loading">Loading interactive API documentation…</Translate>
          </p>
        </div>
      )}
      {status === 'error' && (
        <div className={styles.error}>
          <p>
            <Translate id="api.redocError">Unable to render interactive API docs.</Translate>
          </p>
          <p className={styles.errorDetail}>{errorMsg}</p>
          <a className="button button--primary button--sm" href={specUrl} download>
            <Translate id="api.downloadOpenapi">Download OpenAPI</Translate>
          </a>
        </div>
      )}
      <div
        ref={containerRef}
        id="redoc-container"
        className={status === 'ready' ? styles.visible : styles.hidden}
      />
    </div>
  );
}
