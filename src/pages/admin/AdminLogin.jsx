import { useState } from 'react'
import { motion } from 'motion/react'
import styles from './AdminLogin.module.css'

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const correct = import.meta.env.VITE_ADMIN_PASSWORD || 'reinoimperial2024'
    if (password === correct) {
      sessionStorage.setItem('ri_admin', '1')
      onLogin()
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div className={styles.page}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.logo}>
          <motion.span
            animate={{ filter: ['drop-shadow(0 0 6px rgba(201,168,76,0.4))', 'drop-shadow(0 0 14px rgba(201,168,76,0.8))', 'drop-shadow(0 0 6px rgba(201,168,76,0.4))'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >♛</motion.span>
          <div>
            <span className={styles.logoMain}>Reino Imperial</span>
            <span className={styles.logoSub}>Painel Administrativo</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.group}>
            <label>Senha de acesso</label>
            <input
              type="password"
              placeholder="Digite a senha..."
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
              className={error ? styles.inputError : ''}
            />
            {error && <span className={styles.errorMsg}>Senha incorreta</span>}
          </div>
          <motion.button
            type="submit"
            className={styles.btn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Entrar no painel
          </motion.button>
        </form>

        <a href="/" className={styles.back}>← Voltar ao site</a>
      </motion.div>
    </div>
  )
}
