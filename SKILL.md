---
name: design-system-u-toeic
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# BLOG

## Mission

Deliver implementation-ready design-system guidance for BLOG that can be applied consistently across documentation site interfaces.

## Brand

- Product/brand: BLOG
- URL: https://dautoeic.com/grammar
- Audience: developers and technical teams
- Product surface: documentation site

## Style Foundations

- Visual style: structured, accessible, implementation-first
- Main font style: `font.family.primary=Inter`, `font.family.stack=Inter, system-ui, sans-serif`, `font.size.base=14px`, `font.weight.base=500`, `font.lineHeight.base=20px`
- Typography scale: `font.size.xs=14px`, `font.size.sm=16px`, `font.size.md=18px`, `font.size.lg=20px`, `font.size.xl=36px`
- Color palette: `color.text.primary=#f8fafc`, `color.text.secondary=#97a3b4`, `color.text.tertiary=#26b2f2`, `color.text.inverse=#0f131a`, `color.surface.base=#000000`, `color.surface.muted=#161d27`, `color.border.default=#29313d`
- Spacing scale: `space.1=2px`, `space.2=4px`, `space.3=8px`, `space.4=12px`, `space.5=16px`, `space.6=20px`, `space.7=24px`, `space.8=40px`
- Radius/shadow/motion tokens: `radius.xs=10px`, `radius.sm=12px`, `radius.md=9999px` | `shadow.1=rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`, `shadow.2=rgb(15, 19, 26) 0px 0px 0px 1px, rgba(38, 178, 242, 0.3) 0px 0px 0px 3px, rgba(38, 178, 242, 0.3) 0px 0px 8px 2px`, `shadow.3=rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px`, `shadow.4=rgba(13, 162, 231, 0.4) 0px 10px 30px -10px` | `motion.duration.instant=150ms`

## Accessibility

- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone

concise, confident, implementation-focused

## Rules: Do

- Use semantic tokens, not raw hex values in component guidance.
- Every component must define required states: default, hover, focus-visible, active, disabled, loading, error.
- Responsive behavior and edge-case handling should be specified for every component family.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't

- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.

## Guideline Authoring Workflow

1. Restate design intent in one sentence.
2. Define foundations and tokens.
3. Define component anatomy, variants, and interactions.
4. Add accessibility acceptance criteria.
5. Add anti-patterns and migration notes.
6. End with QA checklist.

## Required Output Structure

- Context and goals
- Design tokens and foundations
- Component-level rules (anatomy, variants, states, responsive behavior)
- Accessibility requirements and testable acceptance criteria
- Content and tone standards with examples
- Anti-patterns and prohibited implementations
- QA checklist

## Component Rule Expectations

- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.

## Quality Gates

- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Prefer system consistency over local visual exceptions.

<!-- TYPEUI_SH_MANAGED_END -->
