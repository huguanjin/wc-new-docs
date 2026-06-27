---
sidebar_position: 4
title: Billing
description: Quota management, billing policies, and payment integration in Webchannel.
---

# Billing & Quota

## Quota System

Webchannel uses an internal quota system for usage tracking:

- **Quota** — Abstract currency unit for API consumption
- **Ratio** — Model-specific pricing multiplier
- **Group** — Token/user group with shared pricing rules

## Payment Integration

Supported payment gateways:

- **EPay** — Chinese payment aggregator
- **Stripe** — International card payments

Configure in **System Settings → Payment**.

## Billing Policies

| Policy | Description |
|--------|-------------|
| Per-request | Fixed cost per API call |
| Token-based | Cost based on input/output tokens |
| Cache hit | Reduced cost for cached responses |
| Expression-based | Dynamic pricing via billing expressions |

## Cache Billing

Supported for cache-aware models:

- OpenAI / Azure OpenAI
- DeepSeek
- Claude
- Qwen

Cache hit statistics are tracked separately in the usage dashboard.

## Admin Operations

- Top-up user quota manually
- Set group-level pricing ratios
- Export usage logs for accounting
- Configure model-specific billing rules
