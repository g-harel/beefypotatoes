import React from "react";
import styled from "styled-components";

const Wrapper = styled.h1`
    margin: 0;
    padding: 3rem;
    text-shadow: 0 0 4px #121212;
    user-select: none;
    width: 100%;
`;

const Feedback = styled.a`
    color: #666;
    font-size: 1rem;
    text-decoration: none;
    text-shadow: none;
`;

export const Title: React.FunctionComponent = () => (
    <Wrapper>
        Humanity <br /> Against <br /> Cards <br />
        <Feedback href="https://forms.gle/bZkEJEnfZQWF2rq29">Feedback</Feedback>
    </Wrapper>
);
