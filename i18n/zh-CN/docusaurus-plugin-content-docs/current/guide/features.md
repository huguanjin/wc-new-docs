---
sidebar_position: 1
title: 功能特性
description: Webchannel 核心功能包括 UI、计费、安全和智能路由。
---

# 功能特性概览

## 核心功能

| 功能 | 说明 |
|------|------|
| 🎨 全新 UI | 现代化用户界面设计 |
| 🌍 多语言 | 简体中文、繁体中文、英语、法语、日语、俄语、越南语 |
| 🔄 数据兼容 | 完全兼容原版 One API 数据库 |
| 📈 数据面板 | 可视化控制台和统计分析 |
| 🔒 权限管理 | 令牌分组、模型限制、用户管理 |

## 计费与核算

- 内部充值和配额分配（EPay、Stripe）
- 按请求、按用量和缓存命中计费
- OpenAI、Azure、DeepSeek、Claude、Qwen 模型缓存计费
- 灵活的企业客户计费策略

## 认证与安全

- Discord、LinuxDO、Telegram OAuth 登录
- OIDC 统一认证
- WebAuthn / Passkeys 支持
- 密钥配额查询和用量追踪

## 高级功能

### API 格式支持

- OpenAI Chat Completions 和 Responses
- OpenAI Realtime API（含 Azure）
- Claude Messages 格式
- Google Gemini 格式
- Rerank 模型（Cohere、Jina）

### 智能路由

- 渠道加权随机选择
- 失败自动重试
- 用户级模型速率限制

### 格式转换

- OpenAI 兼容 ⇄ Claude Messages
- OpenAI 兼容 → Google Gemini
- Google Gemini → OpenAI 兼容
- Thinking-to-content 功能
