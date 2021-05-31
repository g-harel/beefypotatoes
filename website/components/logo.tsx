import React from "react";
import styled, {keyframes, css} from "styled-components";

interface IProps {
    color?: string;
    isLoading?: true;
    scale?: number;
}

const Wrapper = styled.div<IProps>`
    height: 0;

    ${({color, scale}) => css`
        color: ${color || "white"};
        transform: scale(${scale || 1}) translateY(-5rem);
    `}
`;

const Base = styled.div`
    border-radius: 1rem;
    box-sizing: border-box;
    height: 10rem;
    width: 6.666rem;
`;

const slideFull = keyframes`
    0% {transform: rotate(20deg) translateX(2.666rem)}
    20% {transform: rotate(-20deg) translateX(-2.666rem)}
    50% {transform: rotate(20deg) translateX(2.666rem)}
    100% {transform: rotate(20deg) translateX(2.666rem)}
`;

const Full = styled(Base)<IProps>`
    animation: 2s ${slideFull} ease infinite;
    background-color: currentColor;

    ${({isLoading}) => css`
        animation-play-state: ${isLoading ? "initial" : "paused"};
    `}
`;

const slideOutline = keyframes`
    0% {transform: rotate(-20deg) translateX(-2.666rem)}
    20% {transform: rotate(20deg) translateX(2.666rem)}
    50% {transform: rotate(-20deg) translateX(-2.666rem)}
    100% {transform: rotate(-20deg) translateX(-2.666rem)}
`;

const Outline = styled(Base)<IProps>`
    animation: 2s ${slideOutline} ease infinite;
    border: 0.6rem solid currentColor;

    ${({isLoading}) => css`
        animation-play-state: ${isLoading ? "initial" : "paused"};
    `}
`;

const Collapse = styled.div`
    height: 0;
`;

export const Logo: React.FunctionComponent<IProps> = (props) => (
    <Wrapper {...props}>
        <Collapse>
            <Full {...props} />
        </Collapse>
        <Outline {...props} />
    </Wrapper>
);
