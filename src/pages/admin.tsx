import type {ReactNode, FormEvent} from 'react';
import {useState, useEffect, useCallback} from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Translate, {translate} from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

interface DocFile {
  path: string;
  locale: string;
  title: string;
}

interface AuthState {
  token: string | null;
  username: string | null;
}

const TOKEN_KEY = 'new-api-docs-admin-token';

function getAdminApiUrl(): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.protocol}//${window.location.hostname}:4000`;
}

function AdminHead(): ReactNode {
  return (
    <Head>
      <meta name="robots" content="noindex, nofollow" />
    </Head>
  );
}

export default function AdminPage(): ReactNode {
  const {i18n} = useDocusaurusContext();
  const [auth, setAuth] = useState<AuthState>({token: null, username: null});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState<DocFile[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [saveMsg, setSaveMsg] = useState('');

  const apiUrl = getAdminApiUrl();

  const authHeaders = useCallback(
    () => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth.token}`,
    }),
    [auth.token],
  );

  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (!saved || !apiUrl) return;

    fetch(`${apiUrl}/api/auth/me`, {headers: {Authorization: `Bearer ${saved}`}})
      .then(async r => {
        if (!r.ok) throw new Error('Session expired');
        return r.json();
      })
      .then(data => setAuth({token: saved, username: data.username}))
      .catch(() => localStorage.removeItem(TOKEN_KEY));
  }, [apiUrl]);

  const loadDocs = useCallback(async () => {
    if (!auth.token || !apiUrl) return;
    try {
      const res = await fetch(`${apiUrl}/api/docs?locale=${i18n.currentLocale}`, {
        headers: authHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setDocs(data.files ?? []);
      }
    } catch {
      // Admin server may be offline during local dev
    }
  }, [auth.token, apiUrl, authHeaders, i18n.currentLocale]);

  useEffect(() => {
    void loadDocs();
  }, [loadDocs]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem(TOKEN_KEY, data.token);
      setAuth({token: data.token, username: data.username});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Is the admin server running on port 4000?');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setAuth({token: null, username: null});
    setSelectedDoc(null);
    setContent('');
  };

  const openDoc = async (docPath: string) => {
    if (!auth.token || !apiUrl) return;
    try {
      const res = await fetch(
        `${apiUrl}/api/docs/content?path=${encodeURIComponent(docPath)}&locale=${i18n.currentLocale}`,
        {headers: authHeaders()},
      );
      if (res.ok) {
        const data = await res.json();
        setSelectedDoc(docPath);
        setContent(data.content);
        setSaveMsg('');
      }
    } catch {
      setSaveMsg(translate({id: 'admin.loadFailed', message: 'Failed to load document.'}));
    }
  };

  const saveDoc = async () => {
    if (!auth.token || !selectedDoc || !apiUrl) return;
    setLoading(true);
    setSaveMsg('');
    try {
      const res = await fetch(`${apiUrl}/api/docs/content`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({path: selectedDoc, content, locale: i18n.currentLocale}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setSaveMsg(translate({id: 'admin.saved', message: 'Saved successfully!'}));
    } catch (err) {
      setSaveMsg(err instanceof Error ? err.message : translate({id: 'admin.saveFailed', message: 'Save failed'}));
    } finally {
      setLoading(false);
    }
  };

  if (!auth.token) {
    return (
      <Layout title="Admin Login" description="Admin login for Webchannel documentation">
        <AdminHead />
        <main className="container margin-vert--xl" style={{maxWidth: 420}}>
          <h1>
            <Translate id="admin.loginTitle">Admin Login</Translate>
          </h1>
          <p>
            <Translate id="admin.loginDesc">
              Sign in to edit documentation content. Public pages remain accessible without login.
            </Translate>
          </p>
          <form onSubmit={handleLogin}>
            <div className="margin-bottom--md">
              <label htmlFor="username">
                <Translate id="admin.username">Username</Translate>
              </label>
              <input
                id="username"
                className="input"
                style={{width: '100%', padding: '0.5rem'}}
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="margin-bottom--md">
              <label htmlFor="password">
                <Translate id="admin.password">Password</Translate>
              </label>
              <input
                id="password"
                type="password"
                className="input"
                style={{width: '100%', padding: '0.5rem'}}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p style={{color: 'var(--ifm-color-danger)'}}>{error}</p>}
            <button type="submit" className="button button--primary" disabled={loading}>
              {loading ? '...' : <Translate id="admin.loginButton">Login</Translate>}
            </button>
          </form>
        </main>
      </Layout>
    );
  }

  return (
    <Layout title="Admin Panel" description="Documentation admin panel">
      <AdminHead />
      <main className="container margin-vert--lg">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1>
            <Translate id="admin.panelTitle">Documentation Admin</Translate>
          </h1>
          <div>
            <span className="margin-right--md">{auth.username}</span>
            <button className="button button--secondary button--sm" onClick={handleLogout}>
              <Translate id="admin.logout">Logout</Translate>
            </button>
          </div>
        </div>
        <p>
          <Translate id="admin.panelDesc">
            Edit markdown documentation files. Changes are saved immediately. Rebuild the site to publish updates.
          </Translate>
        </p>
        <div style={{display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1rem', minHeight: '60vh'}}>
          <aside style={{borderRight: '1px solid var(--ifm-color-emphasis-300)', paddingRight: '1rem'}}>
            <h3>
              {translate(
                {id: 'admin.docsList', message: 'Documents ({locale})'},
                {locale: i18n.currentLocale},
              )}
            </h3>
            <ul style={{listStyle: 'none', padding: 0}}>
              {docs.map(doc => (
                <li key={doc.path} style={{marginBottom: '0.25rem'}}>
                  <button
                    className={`button button--sm ${selectedDoc === doc.path ? 'button--primary' : 'button--secondary'}`}
                    style={{width: '100%', textAlign: 'left'}}
                    onClick={() => openDoc(doc.path)}>
                    {doc.title || doc.path}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
          <section>
            {selectedDoc ? (
              <>
                <h3>{selectedDoc}</h3>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '50vh',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--ifm-color-emphasis-300)',
                  }}
                />
                <div style={{marginTop: '1rem'}}>
                  <button className="button button--primary" onClick={saveDoc} disabled={loading}>
                    <Translate id="admin.save">Save</Translate>
                  </button>
                  {saveMsg && <span className="margin-left--md">{saveMsg}</span>}
                </div>
              </>
            ) : (
              <p>
                <Translate id="admin.selectDoc">Select a document from the sidebar to edit.</Translate>
              </p>
            )}
          </section>
        </div>
      </main>
    </Layout>
  );
}
