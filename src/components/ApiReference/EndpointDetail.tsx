import type {ReactNode} from 'react';
import clsx from 'clsx';
import Translate, {translate} from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import type {ApiParameter, FlatEndpoint} from '@site/src/types/apiCatalog';
import {
  ANTHROPIC_OFFICIAL_DOC_URL,
  isAnthropicEndpoint,
  resolveAnthropicGatewayUrl,
} from '@site/src/utils/anthropicApi';
import {
  geminiBodyFieldsFromExample,
  getActiveGeminiModel,
  isGeminiEndpoint,
  resolveGeminiGatewayUrl,
  resolveGeminiPath,
  GEMINI_OFFICIAL_DOC_URL,
} from '@site/src/utils/geminiApi';
import {
  gptImageBodyFieldsFromExample,
  isGptImage2AllTextToImage,
} from '@site/src/utils/imagesApi';
import {
  bodyFieldsFromExample,
  getActiveRequestExample,
  getActiveVariant,
  prettyJson,
} from '@site/src/utils/requestBodyFields';
import RequestJsonPreview from './RequestJsonPreview';
import styles from './styles.module.css';

type Props = {
  endpoint: FlatEndpoint | null;
  baseUrl: string;
  variantIdx: number;
  onVariantSelect: (idx: number) => void;
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

function ParamTable({
  title,
  params,
  headingLevel = 'h2',
}: {
  title: ReactNode;
  params: FlatEndpoint['parameters'];
  headingLevel?: 'h2' | 'h3';
}): ReactNode {
  if (params.length === 0) return null;
  const Heading = headingLevel;
  return (
    <section className={styles.detailSection}>
      <Heading
        className={clsx(
          styles.detailHeading,
          headingLevel === 'h3' && styles.detailSubheading,
        )}>
        {title}
      </Heading>
      <div className={styles.paramList}>
        {params.map(param => (
          <div key={`${param.in}-${param.name}`} className={styles.paramRow}>
            <div className={styles.paramHeader}>
              <code className={styles.paramName}>{param.name}</code>
              <span className={styles.paramMeta}>
                {param.in === 'body' ? (
                  <span className={styles.paramIn}>
                    <Translate id="api.ref.bodyField">Request body</Translate>
                  </span>
                ) : (
                  <span className={styles.paramIn}>{param.in}</span>
                )}
                <span className={styles.paramType}>{param.type}</span>
                {param.required ? (
                  <span className={styles.paramRequired}>
                    <Translate id="api.ref.required">Required</Translate>
                  </span>
                ) : (
                  <span className={styles.paramOptional}>
                    <Translate id="api.ref.optional">Optional</Translate>
                  </span>
                )}
              </span>
            </div>
            {param.description && (
              <p className={styles.paramDesc}>{param.description}</p>
            )}
            {param.example != null && String(param.example) !== '' && (
              <code className={styles.paramExample}>{String(param.example)}</code>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ApiEndpointDetail({
  endpoint,
  baseUrl,
  variantIdx,
  onVariantSelect,
}: Props): ReactNode {
  if (!endpoint) {
    return (
      <div className={styles.detailEmpty}>
        <h1 className={styles.detailEmptyTitle}>
          <Translate id="api.ref.selectEndpointTitle">API Reference</Translate>
        </h1>
        <p className={styles.detailEmptyDesc}>
          <Translate id="api.ref.selectEndpointDesc">
            Choose an endpoint from the sidebar to view method, parameters, responses, and code
            examples.
          </Translate>
        </p>
      </div>
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
  const gatewayUrl = isGemini
    ? resolveGeminiGatewayUrl(baseUrl, endpoint.path, modelName)
    : isAnthropic
      ? resolveAnthropicGatewayUrl(baseUrl, endpoint.path)
      : null;

  const activeVariant = getActiveVariant(endpoint, variantIdx);
  const activeRequestExample = getActiveRequestExample(endpoint, variantIdx);
  const activeRequestJson = prettyJson(activeRequestExample);
  const bodyFields = isGemini
    ? geminiBodyFieldsFromExample(activeRequestExample)
    : isGptImageT2I
      ? gptImageBodyFieldsFromExample(activeRequestExample)
      : bodyFieldsFromExample(activeRequestExample, endpoint.categorySlug);
  const showRequestDetail = Boolean(activeRequestExample && bodyFields.length > 0);
  const hasVariants = Boolean(endpoint.variants && endpoint.variants.length > 0);

  const headerParams = endpoint.parameters.filter(p => p.in === 'header');
  const queryParams: ApiParameter[] = endpoint.parameters.filter(
    p => p.in === 'query' && !(isGemini && p.name === 'key'),
  );
  const pathParams: ApiParameter[] = endpoint.parameters
    .filter(p => p.in === 'path')
    .map(p =>
      isGemini && p.name === 'model-name' && modelName
        ? {...p, example: modelName}
        : p,
    );

  const authParams = headerParams.filter(
    p => p.name.toLowerCase() === 'authorization',
  );
  const otherHeaders = headerParams.filter(p => {
    const lower = p.name.toLowerCase();
    if (lower === 'authorization') return false;
    if (isGemini && p.name === 'x-goog-api-key') return false;
    if (isAnthropic && (p.name === 'x-api-key' || p.name === 'anthropic-version' || p.name === 'content-type')) {
      return false;
    }
    return true;
  });

  return (
    <article className={styles.detail}>
      <div className={styles.detailBreadcrumb}>
        <span>{endpoint.categoryLabel}</span>
        <span className={styles.breadcrumbSep}>/</span>
        <span>{endpoint.sectionLabel}</span>
      </div>

      <h1 className={styles.detailTitle}>{endpoint.summary}</h1>

      {isGemini && (
        <p className={styles.geminiRef}>
          <Translate id="api.ref.geminiOfficialRefLead">
            Request and response format (official):
          </Translate>{' '}
          <a href={GEMINI_OFFICIAL_DOC_URL} target="_blank" rel="noopener noreferrer">
            ai.google.dev/api
          </a>
          {gatewayUrl ? (
            <>
              .{' '}
              <Translate id="api.ref.geminiGateway">This gateway:</Translate>{' '}
              <code>{gatewayUrl}</code>
            </>
          ) : null}
        </p>
      )}

      {isAnthropic && (
        <p className={styles.geminiRef}>
          <Translate id="api.ref.anthropicOfficialRefLead">
            Request and response format (official):
          </Translate>{' '}
          <a href={ANTHROPIC_OFFICIAL_DOC_URL} target="_blank" rel="noopener noreferrer">
            platform.claude.com/docs/en/api/overview
          </a>
          {gatewayUrl ? (
            <>
              .{' '}
              <Translate id="api.ref.anthropicGateway">This gateway:</Translate>{' '}
              <code>{gatewayUrl}</code>
            </>
          ) : null}
        </p>
      )}

      <div className={styles.urlBar}>
        <span className={clsx(styles.methodBadge, styles.methodBadgeLg, methodClass(endpoint.method))}>
          {endpoint.method}
        </span>
        <code className={styles.urlText}>{url}</code>
      </div>

      {endpoint.description && (
        <p className={styles.detailDescription}>{endpoint.description}</p>
      )}

      {isGptImageT2I && (
        <div className={styles.endpointNotes}>
          <p className={styles.endpointNote}>
            <strong>
              <Translate id="api.ref.gptImage.sceneTitle">Use case</Translate>
            </strong>
            <Translate id="api.ref.gptImage.sceneBody">
              Text-to-image only — provide a prompt, no image upload needed. For image editing or
              fusion, use POST /v1/images/edits.
            </Translate>
          </p>
          <p className={clsx(styles.endpointNote, styles.endpointNoteWarning)}>
            <strong>
              <Translate id="api.ref.gptImage.paramsTitle">Parameter notes</Translate>
            </strong>
            <ul>
              <li>
                <Translate id="api.ref.gptImage.sizeNote">
                  size is ignored — pass auto or any value without error, but dimensions are
                  determined by the prompt. Put aspect ratio at the start of the prompt for best
                  results.
                </Translate>
              </li>
              <li>
                <Translate id="api.ref.gptImage.unsupportedNote">
                  n, quality, and aspect_ratio are not supported and may trigger validation errors.
                </Translate>
              </li>
              <li>
                <Translate id="api.ref.gptImage.responseFormatNote">
                  Default response_format is b64_json. Use url in the Playground to avoid large
                  base64 payloads. b64_json already includes the data:image/png;base64, prefix.
                </Translate>
              </li>
            </ul>
          </p>
        </div>
      )}

      {hasVariants && (
        <section className={styles.detailSection}>
          <h2 className={styles.detailHeading}>
            <Translate id="api.ref.useCasesTitle">Use cases</Translate>
            <span className={styles.useCaseCount}>
              {translate(
                {id: 'api.ref.useCases', message: '{count} documented use cases'},
                {count: String(endpoint.variantCount ?? endpoint.variants!.length)},
              )}
            </span>
          </h2>
          <ul className={styles.variantList}>
            {endpoint.variants!.map((variant, idx) => (
              <li key={`${variant.summary}-${idx}`}>
                <button
                  type="button"
                  className={clsx(
                    styles.variantItem,
                    variantIdx === idx && styles.variantItemActive,
                  )}
                  aria-pressed={variantIdx === idx}
                  onClick={() => onVariantSelect(idx)}>
                  <span className={styles.variantLabel}>{variant.label || variant.summary}</span>
                  {variant.description && (
                    <span className={styles.variantDesc}>{variant.description}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {showRequestDetail && (
        <section className={styles.variantDetail}>
          {activeVariant ? (
            <>
              <h2 className={styles.variantDetailTitle}>
                {activeVariant.label || activeVariant.summary}
              </h2>
              {activeVariant.description && (
                <p className={styles.variantDetailDesc}>{activeVariant.description}</p>
              )}
            </>
          ) : (
            <h2 className={styles.variantDetailTitle}>
              <Translate id="api.ref.requestBody">Request body</Translate>
            </h2>
          )}
          <ParamTable
            title={<Translate id="api.ref.requestBodyFields">Request body fields</Translate>}
            params={bodyFields}
            headingLevel="h3"
          />
          <RequestJsonPreview json={activeRequestJson} />
        </section>
      )}

      <section className={styles.detailSection}>
        <h2 className={styles.detailHeading}>
          <Translate id="api.ref.authentication">Authentication</Translate>
        </h2>
        <div className={styles.authBlock}>
          {isGemini ? (
            <>
              <div className={styles.authRow}>
                <span className={styles.authLabel}>x-goog-api-key</span>
                <span className={styles.authType}>
                  <Translate id="api.ref.header">Header</Translate>
                </span>
              </div>
              <p className={styles.authDesc}>
                <Translate id="api.ref.geminiAuthDesc">
                  API key in the x-goog-api-key header (see the official Gemini API reference).
                  On this gateway you may also use Authorization: Bearer with your platform token.
                </Translate>
              </p>
            </>
          ) : isAnthropic ? (
            <>
              <div className={styles.authRow}>
                <span className={styles.authLabel}>x-api-key</span>
                <span className={styles.authType}>
                  <Translate id="api.ref.header">Header</Translate>
                </span>
              </div>
              <div className={styles.authRow}>
                <span className={styles.authLabel}>anthropic-version</span>
                <span className={styles.authType}>
                  <Translate id="api.ref.required">Required</Translate>
                </span>
              </div>
              <div className={styles.authRow}>
                <span className={styles.authLabel}>content-type</span>
                <span className={styles.authType}>application/json</span>
              </div>
              <p className={styles.authDesc}>
                <Translate id="api.ref.anthropicAuthDesc">
                  All Claude API requests require these headers (see the official API overview).
                  Use x-api-key or Authorization: Bearer. On this gateway, Bearer with your
                  platform token is also supported.
                </Translate>
              </p>
            </>
          ) : (
            <>
              <div className={styles.authRow}>
                <span className={styles.authLabel}>Authorization</span>
                <span className={styles.authType}>Bearer</span>
              </div>
              <p className={styles.authDesc}>
                <Translate id="api.ref.authDesc">
                  API key as bearer token in the Authorization header.
                </Translate>
              </p>
              {authParams.map(p => (
                <p key={p.name} className={styles.authDesc}>
                  {p.description}
                </p>
              ))}
            </>
          )}
        </div>
      </section>

      <ParamTable
        title={<Translate id="api.ref.headers">Headers</Translate>}
        params={otherHeaders}
      />
      <ParamTable
        title={<Translate id="api.ref.query">Query parameters</Translate>}
        params={queryParams}
      />
      <ParamTable
        title={<Translate id="api.ref.pathParams">Path parameters</Translate>}
        params={pathParams}
      />

      <div className={styles.detailFooter}>
        <Link to={endpoint.docHref} className={styles.categoryLink}>
          <Translate id="api.ref.viewCategoryDoc">View category documentation →</Translate>
        </Link>
      </div>
    </article>
  );
}
