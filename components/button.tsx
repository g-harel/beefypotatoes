import React from "react";
import styled, {css} from "styled-components";

export interface IProps {
    hide?: boolean;
    onClick: () => any;
    color?: string;
}

const Wrapper = styled.div<IProps>`
    border-radius: 0.2rem;
    border: 1px solid currentColor;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    padding: 1rem 2rem;
    text-transform: uppercase;
    transition: opacity 0.4s ease;
    user-select: none;

    ${({color, hide}) => css`
        color: ${color || "#444"};
        opacity: ${hide ? 0 : 1};
    `}

    &:active {
        transform: scale(0.98);
    }
`;

export const Button: React.FunctionComponent<IProps> = (props) => (
    <Wrapper {...props} onClick={() => props.onClick()}>
        {props.children}
    </Wrapper>
);
