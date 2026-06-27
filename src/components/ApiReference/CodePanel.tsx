import type {ReactNode} from 'react';
import {useMemo, useState} from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import {Highlight, themes} from 'prism-react-renderer';
import type {ApiResponse, FlatEndpoint} from '@site/src/types/apiCatalog';
import {endpointWithExample} from '@site/src/types/apiCatalog';
import {
  CODE_LANGS,
  type CodeLang,
  generateCodeSample,
} from '@site/src/utils/codeSamples';
import {isAnthropicEndpoint} from '@site/src/utils/anthropicApi';
import {
  getActiveGeminiModel,
  isGeminiEndpoint,
  resolveGeminiPath,
} from '@site/src/utils/geminiApi';
import {
  getGptImageResponseExample,
  isGptImage2AllTextToImage,
} from '@site/src/utils/imagesApi';
import {getActiveRequestExample, prettyJson} from '@site/src/utils/requestBodyFields';
import styles from './styles.module.css';

type Props = {
  endpoint: FlatEndpoint | null;
  baseUrl: string;
  variantIdx: number;
  onVariantChange: (idx: number) => void;
};

function methodClass(method: string): string {
  const m = method.toLowerCase();
  if (m === 'get') return styles.methodGet;
  if (m === 'post') return styles.methodPost;
  if (m === 'put') return styles.methodPut;
  if (m === 'patch') return styles.methodPatch;
  if (m === 'delete') return styles.methodDelete;
  return styles.methodDefault;
}

function langToPrism(lang: CodeLang): string {
  if (lang === 'curl') return 'bash';
  if (lang === 'javascript') return 'javascript';
  return lang;
}

function statusClass(code: string): string {
  if (code.startsWith('2')) return styles.statusSuccess;
  if (code.startsWith('4')) return styles.statusClient;
  if (code.startsWith('5')) return styles.statusServer;
  return '';
}

function ResponseList({responses}: {responses: ApiResponse[]}): ReactNode {
  if (!responses.length) {
    return (
      <p className={styles.paneEmpty}>
        <Translate id="api.ref.noResponse">No response schema documented.</Translate>
      </p>
    );
  }

  return (
    <ul className={styles.responsePaneList}>
      {responses.map(resp => (
        <li key={resp.code} className={styles.responsePaneItem}>
          <span className={clsx(styles.statusCode, statusClass(resp.code))}>{resp.code}</span>
          <div className={styles.responsePaneText}>
            {resp.name ? <strong>{resp.name}</strong> : null}
            <span>{resp.description}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function ApiCodePanel({
  endpoint,
  baseUrl,
  variantIdx,
  onVariantChange,
}: Props): ReactNode {
  const [lang, setLang] = useState<CodeLang>('curl');
  const [copied, setCopied] = useState(false);

  const variants = endpoint?.variants?.length ? endpoint.variants : null;

  const activeEndpoint = useMemo(() => {
    if (!endpoint) return null;
    if (!variants) return endpoint;
    const variant = variants[variantIdx] ?? variants[0];
    return endpointWithExample(endpoint, variant.requestExample);
  }, [endpoint, variants, variantIdx]);

  const code = useMemo(() => {
    if (!endpoint) return '';
    return generateCodeSample(lang, activeEndpoint ?? endpoint, baseUrl, variantIdx);
  }, [activeEndpoint, endpoint, baseUrl, lang, variantIdx]);

  const copyCode = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  if (!endpoint) {
    return (
      <aside className={styles.codePanel}>
        <div className={styles.codeEmpty}>
          <Translate id="api.ref.selectEndpoint">
            Select an endpoint to view request and response.
          </Translate>
        </div>
      </aside>
    );
  }

  const isGemini = isGeminiEndpoint(endpoint);
  const isAnthropic = isAnthropicEndpoint(endpoint);
  const isGptImageT2I = isGptImage2AllTextToImage(endpoint);
  const modelName = isGemini ? getActiveGeminiModel(endpoint, variantIdx) : null;
  const displayPath = isGemini
    ? resolveGeminiPath(endpoint.path, modelName)
    : endpoint.path;
  const url = isGemini || isAnthropic
    ? displayPath
    : `${baseUrl.replace(/\/$/, '')}${endpoint.path}`;
  const requestBody = prettyJson(getActiveRequestExample(endpoint, variantIdx));
  const responseExample = isGptImageT2I
    ? getGptImageResponseExample(endpoint, variantIdx)
    : null;

  return (
    <aside className={styles.codePanel}>
      <div className={styles.codePanelTop}>
        <div className={styles.codeEndpointMeta}>
          <span className={clsx(styles.methodBadge, styles.methodBadgeLg, methodClass(endpoint.method))}>
            {endpoint.method}
          </span>
          <code className={styles.codePath}>{displayPath}</code>
        </div>
        {!isGemini && !isAnthropic && <p className={styles.codeUrl}>{url}</p>}
      </div>

      {variants && variants.length > 1 && (
        <div className={styles.variantTabs} role="tablist">
          {variants.map((variant, idx) => (
            <button
              key={variant.summary}
              type="button"
              role="tab"
              aria-selected={variantIdx === idx}
              className={clsx(styles.variantTab, variantIdx === idx && styles.variantTabActive)}
              onClick={() => onVariantChange(idx)}
              title={variant.summary}>
              {variant.label || variant.summary}
            </button>
          ))}
        </div>
      )}

      <div className={styles.codeSplit}>
        <section className={styles.requestPane} aria-label="Request">
          <div className={styles.paneHeader}>
            <span className={styles.paneTitle}>
              <Translate id="api.ref.request">Request</Translate>
            </span>
            <div className={styles.paneHeaderActions}>
              <div className={styles.langTabs} role="tablist">
                {CODE_LANGS.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={lang === item.id}
                    className={clsx(styles.langTab, lang === item.id && styles.langTabActive)}
                    onClick={() => setLang(item.id)}>
                    {item.label}
                  </button>
                ))}
              </div>
              <button type="button" className={styles.copyBtn} onClick={copyCode}>
                {copied ? (
                  <Translate id="api.ref.copied">Copied</Translate>
                ) : (
                  <Translate id="api.ref.copy">Copy</Translate>
                )}
              </button>
            </div>
          </div>
          <div className={styles.paneScroll}>
            <Highlight theme={themes.vsDark} code={code || '// No example'} language={langToPrism(lang)}>
              {({className, style, tokens, getLineProps, getTokenProps}) => (
                <pre className={clsx(className, styles.pre)} style={style}>
                  <code>
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({line})}>
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({token})} />
                        ))}
                      </div>
                    ))}
                  </code>
                </pre>
              )}
            </Highlight>
            {requestBody ? (
              <>
                <div className={styles.jsonLabel}>
                  <Translate id="api.ref.requestBody">Body (JSON)</Translate>
                </div>
                <Highlight theme={themes.vsDark} code={requestBody} language="json">
                  {({className, style, tokens, getLineProps, getTokenProps}) => (
                    <pre className={clsx(className, styles.pre, styles.preJson)} style={style}>
                      <code>
                        {tokens.map((line, i) => (
                          <div key={i} {...getLineProps({line})}>
                            {line.map((token, key) => (
                              <span key={key} {...getTokenProps({token})} />
                            ))}
                          </div>
                        ))}
                      </code>
                    </pre>
                  )}
                </Highlight>
              </>
            ) : (
              <p className={styles.paneHint}>
                <Translate id="api.ref.noRequestBody">No request body for this endpoint.</Translate>
              </p>
            )}
          </div>
        </section>

        <section className={styles.responsePane} aria-label="Response">
          <div className={styles.paneHeader}>
            <span className={styles.paneTitle}>
              <Translate id="api.ref.responses">Response</Translate>
            </span>
          </div>
          <div className={styles.paneScroll}>
            <ResponseList responses={endpoint.responses} />
            {responseExample ? (
              <>
                <div className={styles.jsonLabel}>
                  <Translate id="api.ref.responseExample">Example (200)</Translate>
                </div>
                <Highlight theme={themes.vsDark} code={responseExample} language="json">
                  {({className, style, tokens, getLineProps, getTokenProps}) => (
                    <pre className={clsx(className, styles.pre, styles.preJson)} style={style}>
                      <code>
                        {tokens.map((line, i) => (
                          <div key={i} {...getLineProps({line})}>
                            {line.map((token, key) => (
                              <span key={key} {...getTokenProps({token})} />
                            ))}
                          </div>
                        ))}
                      </code>
                    </pre>
                  )}
                </Highlight>
              </>
            ) : null}
          </div>
        </section>
      </div>
    </aside>
  );
}
