import React from "react";
import styled from "styled-components";

const Wrapper = styled.a`
    align-self: center;
    color: #666;
    font-size: 0.9rem;
    font-weight: bold;
    margin: 3rem;
    text-decoration: none;
    text-shadow: none;
    user-select: none;
`;

export const Footer: React.FunctionComponent = () => (
    <Wrapper href="https://forms.gle/bZkEJEnfZQWF2rq29">feedback</Wrapper>
);
