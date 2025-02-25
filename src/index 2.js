import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import routes from "./routes/index.js"
import { Provider } from 'react-redux';
import store from './store/index.js'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
  <RouterProvider  router={routes}/>

  </Provider>
);


