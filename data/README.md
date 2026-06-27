# Apifox Source Data

Place your Apifox project export here:

```
data/enterprise.apifox.json
```

Then regenerate documentation:

```bash
npm run generate:api-docs
```

This updates:
- `static/openapi/enterprise.json` — OpenAPI 3.0 spec
- `docs/api/*.md` — Category documentation pages

The `.apifox.json` source file is gitignored (typically 10–20 MB).
