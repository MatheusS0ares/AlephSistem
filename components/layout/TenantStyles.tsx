import { getTenant } from '@/tenants'

// Overrides the CSS variables defined in globals.css with the active tenant's colors.
// This allows the same Tailwind classes (paizao-gold, paizao-navy, etc.)
// to render different colors per tenant without changing any class names.
export function TenantStyles() {
  const { cores: c } = getTenant()
  const css = `
    :root {
      --color-paizao-gold: ${c.primary};
      --color-paizao-gold-bright: ${c.primaryBright};
      --color-paizao-gold-soft: ${c.primarySoft};
      --color-paizao-navy: ${c.accent};
      --color-paizao-navy-deep: ${c.accentDeep};
      --color-paizao-bg: ${c.bg};
      --color-paizao-surface: ${c.surface};
      --color-paizao-surface-2: ${c.surface2};
      --color-paizao-ink: ${c.ink};
      --color-paizao-ink-dim: ${c.inkDim};
      --color-wa-green: ${c.success};
      --color-paizao-green: ${c.green};
      --color-paizao-yellow: ${c.yellow};
      --color-paizao-red: ${c.red};
    }
  `
  return <style dangerouslySetInnerHTML={{ __html: css }} />
}
