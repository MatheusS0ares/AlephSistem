import { useState } from 'react'
import { motion } from 'motion/react'
import styles from './AlephControle.module.css'

export default function AlephControleLogin({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const correct = import.meta.env.VITE_CONTROLE_PASSWORD || 'aleph@master'
    if (password === correct) {
      sessionStorage.setItem('aleph_controle', '1')
      onLogin()
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div className={styles.loginPage}>
      <motion.div
        className={styles.loginCard}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.loginLogo}>
          <motion.span
            className={styles.loginAleph}
            animate={{
              filter: [
                'drop-shadow(0 0 6px rgba(201,168,76,0.4))',
                'drop-shadow(0 0 18px rgba(201,168,76,0.9))',
                'drop-shadow(0 0 6px rgba(201,168,76,0.4))',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            א
          </motion.span>
          <div>
            <span className={styles.loginTitle}>Controle Aleph</span>
            <span className={styles.loginSub}>Painel Master</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.loginGroup}>
            <label>Senha master</label>
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
            className={styles.loginBtn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Acessar painel
          </motion.button>
        </form>

        <a href="/" className={styles.loginBack}>← Voltar ao início</a>
      </motion.div>
    </div>
  )
}
