import React from "react";
import styled, {css} from "styled-components";

export interface IProps {
    type: "black" | "white" | "outline";
    content: string;
    onClick?: () => any;
}

interface IBaseProps {
    angle?: number;
    x?: number;
    y?: number;
}

// CSS helper to generate the translate transform.
const translate = (x: number = 0, y: number = 0) => {
    return `translate(${x}rem, ${y}rem)`;
};

// CSS helper to generate the rotate transform.
const rotate = (angle: number = 0, bounce: number = 0) => {
    // Adds the bounce amount in the opposite direction to the angle.
    angle = angle + (angle < 0 ? bounce : -bounce);
    return `rotate(${angle}deg)`;
};

const Base = styled.div<IBaseProps>`
    border-radius: 0.6rem;
    font-size: 0.9rem;
    font-weight: 600;
    height: 16rem;
    padding: 0.9rem 1.3rem;
    transition: transform 0.1s ease;
    user-select: none;
    width: 12rem;

    ${({x, y, angle}) => css`
        transform: ${rotate(angle)} ${translate(x, y)};
    `}
`;

// Parent of both "Black" and "White" together.
const Solid = styled(Base)<IBaseProps>`
    cursor: pointer;

    /* TODO logo ::after */
`;

const Black = styled(Solid)`
    background-color: #000;
    color: #fff;
`;

const White = styled(Solid)`
    background-color: #fff;
    color: #000;
`;

const Shadow = styled(Base)`
    background-color: #000;
    opacity: 0.2;
`;

const Outline = styled(Base)`
    border: 0.1rem dashed #fff;
    opacity: 0.1;
    transform: scale(1.02) rotate(0);
`;

const Collapse = styled.div`
    height: 0;
`;

const Wrapper = styled.div<IBaseProps>`
    padding: 1.4rem;

    &:hover:not(:active) {
        ${Solid} {
            ${({x, y, angle}) => css`
                transform: scale(1.01) ${rotate(angle, 0.5)}
                    ${translate(x, (y || 0) - 0.2)};
            `}
        }

        ${Shadow} {
            ${({x, y, angle}) => css`
                transform: scale(1.02) ${rotate(angle, 0.5)}
                    ${translate((x || 0) - 0.85, (y || 0) + 0.55)};
            `}
        }
    }
`;

// Un-escapes non-nested italics and html entities.
const bake = (text: string) => {
    const parts = text.split(/<\/?i>/g);
    const elements = parts.map((part, i) => {
        const ultraBaked = part.replace(/&.*?;/g, (entity) => {
            var doc = new DOMParser().parseFromString(entity, "text/html");
            return doc.documentElement.textContent || "";
        });
        if (i % 2 === 1) {
            return <i key={i}>{ultraBaked}</i>;
        } else {
            return <span key={i}>{ultraBaked}</span>;
        }
    });
    return <>{...elements}</>;
};

export const Card: React.FunctionComponent<IProps> = (props) => {
    // Deterministic angle calculation using first two chars from content.
    // Regular randomness would cause the angle to change on each render.
    let content = (props.content || "").padEnd(2, " ");
    const angle = ((content.charCodeAt(0) + content.charCodeAt(1)) % 7) - 3;

    if (props.type === "outline") {
        return (
            <Wrapper>
                <Outline angle={angle} />
            </Wrapper>
        );
    }

    return (
        <Wrapper angle={angle}>
            <Collapse>
                <Shadow angle={angle} x={-0.8} y={0.5} />
            </Collapse>
            {props.type === "black" ? (
                <Black angle={angle} onClick={props.onClick}>
                    {bake(content)}
                </Black>
            ) : (
                <White angle={angle} onClick={props.onClick}>
                    {bake(content)}
                </White>
            )}
        </Wrapper>
    );
};
