require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.ADMIN_PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';
const DOCS_ROOT = process.env.DOCS_ROOT
  ? path.resolve(process.env.DOCS_ROOT)
  : path.resolve(__dirname, '..');
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH =
  process.env.ADMIN_PASSWORD_HASH ||
  bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);

const SUPPORTED_LOCALES = ['en', 'zh-CN', 'zh-TW', 'fr', 'ja', 'ru', 'vi'];

app.use(cors({origin: true, credentials: true}));
app.use(express.json({limit: '2mb'}));

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({error: 'Unauthorized'});
  }
  try {
    req.user = jwt.verify(header.slice(7), JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({error: 'Invalid token'});
  }
}

function getDocsDir(locale) {
  if (locale === 'en') {
    return path.join(DOCS_ROOT, 'docs');
  }
  return path.join(DOCS_ROOT, 'i18n', locale, 'docusaurus-plugin-content-docs', 'current');
}

function listMarkdownFiles(dir, base = '') {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...listMarkdownFiles(full, rel));
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      const content = fs.readFileSync(full, 'utf-8');
      const titleMatch = content.match(/^title:\s*(.+)$/m);
      results.push({
        path: rel.replace(/\.mdx?$/, ''),
        title: titleMatch ? titleMatch[1].trim() : rel,
      });
    }
  }
  return results;
}

function resolveDocPath(docPath, locale) {
  const docsDir = getDocsDir(locale);
  const candidates = [
    path.join(docsDir, `${docPath}.md`),
    path.join(docsDir, `${docPath}.mdx`),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  if (locale !== 'en') {
    return resolveDocPath(docPath, 'en');
  }
  return null;
}

app.post('/api/auth/login', (req, res) => {
  const {username, password} = req.body || {};
  if (username !== ADMIN_USERNAME || !bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
    return res.status(401).json({error: 'Invalid credentials'});
  }
  const token = jwt.sign({username, role: 'admin'}, JWT_SECRET, {expiresIn: '24h'});
  res.json({token, username});
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({username: req.user.username, role: req.user.role});
});

app.get('/api/docs', authMiddleware, (req, res) => {
  const locale = SUPPORTED_LOCALES.includes(req.query.locale) ? req.query.locale : 'en';
  const dir = getDocsDir(locale);
  const files = listMarkdownFiles(dir).map(f => ({...f, locale}));
  res.json({files, locale});
});

app.get('/api/docs/content', authMiddleware, (req, res) => {
  const docPath = req.query.path;
  if (!docPath || typeof docPath !== 'string') {
    return res.status(400).json({error: 'path query parameter required'});
  }
  const locale = SUPPORTED_LOCALES.includes(req.query.locale) ? req.query.locale : 'en';
  const filePath = resolveDocPath(docPath, locale);
  if (!filePath) {
    return res.status(404).json({error: 'Document not found'});
  }
  res.json({path: docPath, content: fs.readFileSync(filePath, 'utf-8'), locale});
});

app.put('/api/docs/content', authMiddleware, (req, res) => {
  const docPath = req.body.path;
  if (!docPath || typeof docPath !== 'string') {
    return res.status(400).json({error: 'path required'});
  }
  const locale = SUPPORTED_LOCALES.includes(req.body.locale) ? req.body.locale : 'en';
  const {content} = req.body;
  if (typeof content !== 'string') {
    return res.status(400).json({error: 'Content required'});
  }
  const docsDir = getDocsDir(locale);
  fs.mkdirSync(docsDir, {recursive: true});
  let filePath = resolveDocPath(docPath, locale);
  if (!filePath || !filePath.startsWith(docsDir)) {
    filePath = path.join(docsDir, `${docPath}.md`);
  }
  fs.mkdirSync(path.dirname(filePath), {recursive: true});
  fs.writeFileSync(filePath, content, 'utf-8');
  res.json({success: true, path: docPath, locale});
});

app.post('/api/rebuild', authMiddleware, (_req, res) => {
  res.json({
    success: true,
    message: 'Run `npm run build` in the docs-site directory to publish changes.',
  });
});

app.get('/api/health', (_req, res) => {
  res.json({status: 'ok'});
});

app.listen(PORT, () => {
  console.log(`Admin server running on http://localhost:${PORT}`);
  console.log(`Docs root: ${DOCS_ROOT}`);
});
