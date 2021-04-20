import React, {Fragment} from "react";
import ReactDOM from "react-dom";
import styled, {createGlobalStyle} from "styled-components";

import {Board} from "./components/board";
import {Title} from "./components/title";

// Global styles, similar to traditional css.
const GlobalStyle = createGlobalStyle`
    html, body, #root {
        background-color: #232323;
        color: #ffffff;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 20px;
        font-weight: 500;
        height: 100%;
        margin: 0;
        min-width: 36rem;
        width: 100%;
    }

    * {
        box-sizing: border-box;
    }
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

const App: React.FunctionComponent = () => (
    <Fragment>
        <GlobalStyle />
        <Wrapper>
            <Title />
            <Board />
        </Wrapper>
    </Fragment>
);

ReactDOM.render(<App />, document.getElementById("root"));
