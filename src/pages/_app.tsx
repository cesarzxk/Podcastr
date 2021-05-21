import '../styles/global.scss';
import styles from '../styles/app.module.scss';

import { Player } from '../components/Player';
import {Header} from '../components/Header';
import { PlayerProviders } from '../contexts/playerContext';

function MyApp({ Component, pageProps }) {
  return (
  <div className={styles.appWrapper}>
    <PlayerProviders>
      <main>
        <Header/>
        <Component {...pageProps} />
      </main>
      <Player/>
    </PlayerProviders>
  </div>
  )
}

export default MyApp
