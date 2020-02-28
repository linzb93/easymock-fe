import React from 'react';
import {
  Router as DefaultRouter,
  Route,
  Switch,
  StaticRouter,
} from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@@/history';
import RendererWrapper0 from '/Users/linzhibin/Documents/GitHub/easymock-fe/src/pages/.umi/LocaleWrapper.jsx';
import { routerRedux, dynamic as _dvaDynamic } from 'dva';

const Router = routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__index" */ '../../layouts/index'),
        })
      : require('../../layouts/index').default,
    routes: [
      {
        path: '/',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__index__index" */ '../index/index'),
            })
          : require('../index/index').default,
        exact: true,
        _title: 'easymock-fe',
        _title_default: 'easymock-fe',
      },
      {
        path: '/project/:project_id',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__project" */ '../project'),
            })
          : require('../project').default,
        exact: true,
        _title: 'easymock-fe',
        _title_default: 'easymock-fe',
      },
      {
        path: '/project/:project_id/create',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__project__create" */ '../project/create'),
            })
          : require('../project/create').default,
        exact: true,
        _title: 'easymock-fe',
        _title_default: 'easymock-fe',
      },
      {
        path: '/project/:project_id/update/:api_id',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__project__create" */ '../project/create'),
            })
          : require('../project/create').default,
        exact: true,
        _title: 'easymock-fe',
        _title_default: 'easymock-fe',
      },
      {
        component: () =>
          React.createElement(
            require('/Users/linzhibin/Documents/GitHub/easymock-fe/node_modules/_umi-build-dev@1.17.1@umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
        _title: 'easymock-fe',
        _title_default: 'easymock-fe',
      },
    ],
    _title: 'easymock-fe',
    _title_default: 'easymock-fe',
  },
  {
    component: () =>
      React.createElement(
        require('/Users/linzhibin/Documents/GitHub/easymock-fe/node_modules/_umi-build-dev@1.17.1@umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: true },
      ),
    _title: 'easymock-fe',
    _title_default: 'easymock-fe',
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    // dva 中 history.listen 会初始执行一次
    // 这里排除掉 dva 的场景，可以避免 onRouteChange 在启用 dva 后的初始加载时被多执行一次
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return (
      <RendererWrapper0>
        <Router history={history}>{renderRoutes(routes, props)}</Router>
      </RendererWrapper0>
    );
  }
}
