import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import routes from "./routes/index.js"
import store from '/Users/cagataydalaman/Desktop/sahibinden/src/store/index.js';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
  <RouterProvider  router={routes}/>

  </Provider>
);


