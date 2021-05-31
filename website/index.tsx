import React, {Fragment} from "react";
import ReactDOM from "react-dom";
import {createGlobalStyle} from "styled-components";

import {Board} from "./components/board";
import {Title} from "./components/title";
import {Footer} from "./components/footer";

// Global styles, similar to traditional css.
const GlobalStyle = createGlobalStyle`
    html, body, #root {
        background-color: #232323;
        color: #ffffff;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: min(calc(10px + 0.5vh), calc(8px + 0.6vw));
        font-weight: 500;
        margin: 0;
        min-height: 100%;
        width: 100%;
    }

    * {
        box-sizing: border-box;
    }
`;

const App: React.FunctionComponent = () => (
    <Fragment>
        <GlobalStyle />
        <Title />
        <Board />
        <Footer />
    </Fragment>
);

ReactDOM.render(<App />, document.getElementById("root"));
