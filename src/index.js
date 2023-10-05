import React from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { CookiesProvider } from "react-cookie";
import { Provider } from "react-redux";
import { store } from "./store";
const root = createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

/*
例：npx eslint --ext .jsx --ext .js lib/
--extで拡張子指定ができる．
行動前にバグを検知する
https://eslint.org/docs/latest/use/command-line-interface

prettier(formatter)
ファイルをどう書くかの形式のみを指定する
prettierはwriteを入れないと動かない
https://prettier.io/docs/en/cli

SaSSでは変数と関数が使える
 */
