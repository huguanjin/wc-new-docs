import type {ReactNode} from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import {Highlight, themes} from 'prism-react-renderer';
import styles from './styles.module.css';

type Props = {
  json: string | null;
  label?: ReactNode;
};

export default function RequestJsonPreview({json, label}: Props): ReactNode {
  if (!json) return null;

  return (
    <div className={styles.requestJsonBlock}>
      <div className={styles.requestJsonLabel}>
        {label ?? <Translate id="api.ref.requestBodyJson">Request body (JSON)</Translate>}
      </div>
      <Highlight theme={themes.vsDark} code={json} language="json">
        {({className, style, tokens, getLineProps, getTokenProps}) => (
          <pre className={clsx(className, styles.pre, styles.preJson, styles.requestJsonPre)} style={style}>
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
    </div>
  );
}
