---
sidebar_position: 3
title: Authentication
description: OAuth, OIDC, and API key authentication in Webchannel.
---

# Authentication

## API Key Authentication

All relay API requests require an API key in the `Authorization` header:

```bash
curl https://your-gateway.com/v1/chat/completions \
  -H "Authorization: Bearer sk-your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"model": "gpt-4o", "messages": [{"role": "user", "content": "Hello"}]}'
```

## Dashboard Login

The admin dashboard supports multiple login methods:

| Method | Description |
|--------|-------------|
| Email/Password | Default local account |
| GitHub OAuth | GitHub authorization |
| Discord OAuth | Discord authorization |
| Telegram | Telegram bot authorization |
| OIDC | Enterprise single sign-on |
| WebAuthn | Passkey / hardware key |

Configure OAuth providers in **System Settings → Authentication**.

## Token Management

- Create tokens with model restrictions and quota limits
- Group tokens for different use cases
- Set expiration dates and usage limits
- Query token usage via the dashboard or API

## Security Best Practices

1. Rotate `SESSION_SECRET` and `CRYPTO_SECRET` regularly
2. Use HTTPS in production
3. Set model restrictions on API tokens
4. Enable rate limiting for public endpoints
5. Monitor usage logs for anomalies
