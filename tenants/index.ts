import type { TenantConfig } from './types'
import { paizaoConfig } from './paizao'
import { magnnataConfig } from './magnnata'
import { station061Config } from './station061'
import { hoomauConfig } from './hoomau'

const tenants: Record<string, TenantConfig> = {
  paizao: paizaoConfig,
  magnnata: magnnataConfig,
  station061: station061Config,
  hoomau: hoomauConfig,
}

export function getTenant(): TenantConfig {
  const tenantId = process.env.NEXT_PUBLIC_TENANT ?? 'paizao'
  const tenant = tenants[tenantId]
  if (!tenant) {
    console.error(`Tenant "${tenantId}" não encontrado — usando paizao como fallback.`)
    return paizaoConfig
  }
  return tenant
}

export function getAllTenantIds(): string[] {
  return Object.keys(tenants)
}

export type { TenantConfig }
