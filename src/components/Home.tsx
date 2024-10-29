import Welcome from './Welcome.tsx'
import OperationCards from './OperationCards.tsx'
import styles from '../styles/home.module.css'

const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <Welcome/>
      <OperationCards/>
    </div>
  )
}

export default Home;