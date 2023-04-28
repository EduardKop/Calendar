import '@/styles/globals.css';
import '@/styles/reset.css';
import { Provider } from 'react-redux';
import store from '../../utils/store'; // import your redux store

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}