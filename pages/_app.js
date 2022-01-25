import App from 'next/app';
import ErrorPage from 'next/error';

import Layout from '../components/Layout';
import './stylesheets/all.scss';

export default class MyApp extends App {
  componentDidMount = () => {
    window.GOVUKFrontend.initAll();
  };

  render() {
    const { Component, pageProps, environmentName } = this.props;

    if (environmentName === 'production') {
      return (
        <>
          <Layout>
            <ErrorPage statusCode={404} />
          </Layout>
          <script src="/js/govuk.js"></script>
        </>
      );
    }

    return (
      <>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <script src="/js/govuk.js"></script>
      </>
    );
  }
}

MyApp.getInitialProps = async (appContext) => {
  const environmentName =
    process.env.ENV === 'production' ? 'production' : 'development';
  const appProps = await App.getInitialProps(appContext);

  return {
    ...appProps,
    environmentName,
  };
};
