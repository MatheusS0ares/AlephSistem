/**
 * TemplateClientePage — Generic landing page template for any client business.
 *
 * Usage:
 *   import TemplateClientePage from '../templates/TemplateClientePage'
 *   import { cilosConfig } from '../templates/clienteExemplo'
 *   <TemplateClientePage config={cilosConfig} />
 *
 * All styles use inline/style-props so `config.cores` colors are dynamic.
 */

const DEFAULT_CORES = {
  primaria: '#C8960C',
  fundo: '#0a0a0a',
  texto: '#ffffff',
}

function useCores(config) {
  return { ...DEFAULT_CORES, ...(config?.cores || {}) }
}

/* ─── Header ─── */
function Header({ config, cores }) {
  const [menuOpen, setMenuOpen] = React.useState(false)

  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Contato', href: '#contato' },
  ]

  const headerStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(10,10,10,0.95)',
    borderBottom: `1px solid rgba(255,255,255,0.06)`,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    padding: '0 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
  }

  return (
    <header style={headerStyle}>
      <a href="#inicio" style={{ textDecoration: 'none' }}>
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: '1.6rem',
          fontWeight: 900,
          color: cores.primaria,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}>
          {config.nome}
        </span>
      </a>

      <nav style={{ display: 'flex', gap: '28px' }}>
        {navLinks.map(l => (
          <a
            key={l.label}
            href={l.href}
            style={{
              color: 'rgba(255,255,255,0.7)',
              textDecoration: 'none',
              fontSize: '0.85rem',
              letterSpacing: '0.06em',
              fontFamily: "'Inter', sans-serif",
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = cores.primaria }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
          >
            {l.label}
          </a>
        ))}
      </nav>

      <a
        href={`https://wa.me/${config.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          padding: '8px 18px',
          borderRadius: '8px',
          background: cores.primaria,
          color: '#000',
          textDecoration: 'none',
          fontSize: '0.82rem',
          fontWeight: 700,
          fontFamily: "'Barlow Condensed', sans-serif",
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        Agendar
      </a>
    </header>
  )
}

/* ─── Hero ─── */
function Hero({ config, cores }) {
  const wppLink = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(`Olá! Gostaria de agendar um horário em ${config.nome}.`)}`

  return (
    <section
      id="inicio"
      style={{
        background: cores.fundo,
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '80px 40px',
      }}
    >
      {/* Radial glow */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${cores.primaria}18 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '700px' }}>
        <p style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: '0.8rem',
          letterSpacing: '0.3em',
          color: cores.primaria,
          textTransform: 'uppercase',
          marginBottom: '16px',
        }}>
          {config.tipo === 'barbearia' ? '✂ Barbearia' :
           config.tipo === 'estetica' ? '✨ Studio de Estética' :
           config.tipo === 'salao' ? '💇 Salão' : '⭐ Bem-vindo'}
        </p>

        <h1 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 'clamp(3rem, 8vw, 6rem)',
          fontWeight: 900,
          lineHeight: 0.95,
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          margin: '0 0 16px',
          color: cores.texto,
        }}>
          {config.nome}
        </h1>

        <p style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
          color: cores.primaria,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '24px',
        }}>
          {config.tagline}
        </p>

        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '1rem',
          color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.6,
          maxWidth: '460px',
          margin: '0 auto 40px',
        }}>
          {config.sobre?.texto?.slice(0, 120)}
          {config.sobre?.texto?.length > 120 ? '…' : ''}
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href={wppLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              borderRadius: '8px',
              background: `linear-gradient(135deg, ${cores.primaria}cc, ${cores.primaria})`,
              color: '#000',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: 700,
              fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            📱 Agendar agora
          </a>
          <a
            href="#servicos"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              borderRadius: '8px',
              background: 'transparent',
              border: `1px solid rgba(255,255,255,0.15)`,
              color: 'rgba(255,255,255,0.7)',
              textDecoration: 'none',
              fontSize: '1rem',
              fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            Ver serviços
          </a>
        </div>
      </div>
    </section>
  )
}

/* ─── Services ─── */
function Servicos({ config, cores }) {
  if (!config.servicos?.length) return null

  return (
    <section
      id="servicos"
      style={{
        background: '#0d0d0d',
        padding: '80px 40px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            color: cores.primaria,
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}>
            O que oferecemos
          </p>
          <h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: cores.texto,
            margin: 0,
          }}>
            Nossos Serviços
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '16px',
        }}>
          {config.servicos.map((s, i) => (
            <div
              key={i}
              style={{
                background: '#111',
                border: `1px solid #1e1e1e`,
                borderRadius: '14px',
                padding: '24px',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = cores.primaria + '44' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e' }}
            >
              {s.icon && (
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '12px' }}>
                  {s.icon}
                </span>
              )}
              <h3 style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '1.2rem',
                fontWeight: 700,
                color: cores.texto,
                margin: '0 0 8px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}>
                {s.nome}
              </h3>
              {s.desc && (
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.82rem',
                  color: 'rgba(255,255,255,0.5)',
                  lineHeight: 1.5,
                  margin: '0 0 12px',
                }}>
                  {s.desc}
                </p>
              )}
              {s.preco && (
                <span style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: cores.primaria,
                }}>
                  {s.preco}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Sobre ─── */
function Sobre({ config, cores }) {
  if (!config.sobre) return null
  const stats = config.sobre.stats || []

  return (
    <section
      id="sobre"
      style={{
        background: cores.fundo,
        padding: '80px 40px',
      }}
    >
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: stats.length ? '1fr 1fr' : '1fr',
        gap: '60px',
        alignItems: 'center',
      }}>
        <div>
          <p style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            color: cores.primaria,
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}>
            Sobre nós
          </p>
          <h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: cores.texto,
            margin: '0 0 20px',
          }}>
            {config.nome}
          </h2>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.8,
            margin: 0,
          }}>
            {config.sobre.texto}
          </p>
        </div>

        {stats.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
          }}>
            {stats.map((st, i) => (
              <div
                key={i}
                style={{
                  background: '#111',
                  border: `1px solid #1e1e1e`,
                  borderRadius: '14px',
                  padding: '24px',
                  textAlign: 'center',
                }}
              >
                <span style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '2.4rem',
                  fontWeight: 800,
                  color: cores.primaria,
                  display: 'block',
                  lineHeight: 1,
                }}>
                  {st.value}
                </span>
                <span style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.45)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginTop: '6px',
                  display: 'block',
                }}>
                  {st.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

/* ─── CTA ─── */
function CTA({ config, cores }) {
  const wppLink = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(`Olá! Gostaria de agendar um horário em ${config.nome}.`)}`

  return (
    <section style={{
      background: `linear-gradient(135deg, ${cores.primaria}18 0%, ${cores.fundo} 60%)`,
      padding: '80px 40px',
      textAlign: 'center',
      borderTop: `1px solid ${cores.primaria}22`,
      borderBottom: `1px solid ${cores.primaria}22`,
    }}>
      <h2 style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: cores.texto,
        margin: '0 0 16px',
      }}>
        Agende Agora
      </h2>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '1rem',
        color: 'rgba(255,255,255,0.55)',
        maxWidth: '400px',
        margin: '0 auto 32px',
        lineHeight: 1.6,
      }}>
        Entre em contato pelo WhatsApp e garanta seu horário.
      </p>
      <a
        href={wppLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '16px 36px',
          borderRadius: '8px',
          background: `linear-gradient(135deg, ${cores.primaria}cc, ${cores.primaria})`,
          color: '#000',
          textDecoration: 'none',
          fontSize: '1.1rem',
          fontWeight: 700,
          fontFamily: "'Barlow Condensed', sans-serif",
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        📱 {config.whatsapp ? 'Falar no WhatsApp' : 'Entrar em Contato'}
      </a>
    </section>
  )
}

/* ─── Contato ─── */
function Contato({ config, cores }) {
  if (!config.contato) return null

  const { endereco, horarios = [], cidade } = config.contato

  return (
    <section
      id="contato"
      style={{
        background: '#0d0d0d',
        padding: '80px 40px',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            color: cores.primaria,
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}>
            Onde nos encontrar
          </p>
          <h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: cores.texto,
            margin: 0,
          }}>
            Contato
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '16px',
        }}>
          {endereco && (
            <div style={{
              background: '#111',
              border: '1px solid #1e1e1e',
              borderRadius: '14px',
              padding: '24px',
            }}>
              <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '10px' }}>📍</span>
              <h4 style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: cores.primaria,
                margin: '0 0 8px',
              }}>Endereço</h4>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.65)',
                margin: 0,
                lineHeight: 1.5,
              }}>
                {endereco}{cidade ? <><br />{cidade}</> : null}
              </p>
            </div>
          )}

          {horarios.length > 0 && (
            <div style={{
              background: '#111',
              border: '1px solid #1e1e1e',
              borderRadius: '14px',
              padding: '24px',
            }}>
              <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '10px' }}>🕐</span>
              <h4 style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: cores.primaria,
                margin: '0 0 8px',
              }}>Horários</h4>
              <div style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.65)',
                lineHeight: 1.7,
              }}>
                {horarios.map((h, i) => <div key={i}>{h}</div>)}
              </div>
            </div>
          )}

          {config.whatsapp && (
            <div style={{
              background: '#111',
              border: '1px solid #1e1e1e',
              borderRadius: '14px',
              padding: '24px',
            }}>
              <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '10px' }}>💬</span>
              <h4 style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: cores.primaria,
                margin: '0 0 8px',
              }}>WhatsApp</h4>
              <a
                href={`https://wa.me/${config.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.9rem',
                  color: '#25D366',
                  textDecoration: 'none',
                }}
              >
                {config.whatsapp}
              </a>
            </div>
          )}

          {config.instagram && (
            <div style={{
              background: '#111',
              border: '1px solid #1e1e1e',
              borderRadius: '14px',
              padding: '24px',
            }}>
              <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '10px' }}>📸</span>
              <h4 style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: cores.primaria,
                margin: '0 0 8px',
              }}>Instagram</h4>
              <a
                href={config.instagram}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.9rem',
                  color: '#e1306c',
                  textDecoration: 'none',
                }}
              >
                @{config.instagram.split('/').filter(Boolean).pop()}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ─── Footer ─── */
function Footer({ config, cores }) {
  return (
    <footer style={{
      background: '#050505',
      borderTop: '1px solid #111',
      padding: '32px 40px',
      textAlign: 'center',
    }}>
      <p style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: '1.2rem',
        fontWeight: 700,
        letterSpacing: '0.1em',
        color: cores.primaria,
        margin: '0 0 6px',
        textTransform: 'uppercase',
      }}>
        {config.nome}
      </p>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.75rem',
        color: '#333',
        margin: 0,
      }}>
        {new Date().getFullYear()} · {config.nome}
        {config.contato?.cidade ? ` · ${config.contato.cidade}` : ''}
      </p>
    </footer>
  )
}

/* ─── Main template component ─── */
// Import React for useState in Header sub-component
import React from 'react'

export default function TemplateClientePage({ config = {} }) {
  const cores = useCores(config)

  const pageStyle = {
    background: cores.fundo,
    color: cores.texto,
    minHeight: '100vh',
    fontFamily: "'Inter', sans-serif",
  }

  return (
    <div style={pageStyle}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; }
        @media (max-width: 768px) {
          .tpl-header-nav { display: none !important; }
          .tpl-section { padding: 60px 20px !important; }
          .tpl-grid-2col { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Header config={config} cores={cores} />
      <Hero config={config} cores={cores} />
      <Servicos config={config} cores={cores} />
      <Sobre config={config} cores={cores} />
      <CTA config={config} cores={cores} />
      <Contato config={config} cores={cores} />
      <Footer config={config} cores={cores} />
    </div>
  )
}
