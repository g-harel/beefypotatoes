import React, {useState, useEffect} from "react";
import styled from "styled-components";

import {CreateGame, SubmitGame} from "../../common/endpoints";
import {ISubmitResponse, ICard, ICreateResponse} from "../../common/types";
import {Button} from "./button";
import {Card} from "./card";
import {Counter} from "./counter";
import {Logo} from "./logo";

const EXCLUDED_PROMPT_KEY = "excl";

const Wrapper = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: flex-start;
    padding: 0rem 1rem;
`;

const Row = styled.div`
    display: flex;
    flex-wrap: wrap;
    min-height: 18.8rem;
    justify-content: center;
`;

const Result = styled.div`
    align-content: center;
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    font-size: 3rem;
    font-weight: 600;
    justify-content: center;
    user-select: none;
`;

const Subtitle = styled.div`
    color: #444;
    font-size: 1.6rem;
    height: 4rem;
    text-align: center;
    width: 100%;
`;

const Stack = styled.div`
    padding: 1.4rem;

    > * {
        padding: 0;
    }

    > *:not(:last-child) {
        height: 0;
    }
`;

const updateExcludeList = (id?: string): string[] => {
    const currentList = (localStorage.getItem(EXCLUDED_PROMPT_KEY) || "")
        .split(",")
        .filter(Boolean);
    // Exclude list is overridden on the server (starting with the leftmost items) if it grows too large.
    if (id !== undefined) currentList.push(id);
    localStorage.setItem(EXCLUDED_PROMPT_KEY, currentList.join(","));
    return currentList;
};

export const Board: React.FunctionComponent = () => {
    const [board, setBoard] = useState<ICreateResponse | null>(null);
    const [selection, setSelection] = useState<ICard | null>(null);
    const [result, setResult] = useState<ISubmitResponse | null>(null);
    const [counting, setCounting] = useState<boolean>(false);

    const submit = (card: ICard) => {
        if (!board) return;
        setSelection(card);
        SubmitGame.call({
            ...board,
            choice: card.id,
        })
            .then(setResult)
            .then(() => setCounting(true));
    };

    const reset = () => {
        setBoard(null);
        setSelection(null);
        setResult(null);
        CreateGame.call({excludePrompts: updateExcludeList()}).then(
            (createResponse) => {
                updateExcludeList(createResponse.game.prompt.id);
                setBoard(createResponse);
            },
        );
    };

    // Load a game on initial render.
    useEffect(reset, []);

    if (!board) {
        return (
            <Wrapper>
                <div style={{paddingTop: "10rem"}}>
                    <Logo isLoading scale={0.3} color="#444" />
                </div>
            </Wrapper>
        );
    }

    let bottomRowContents: React.ReactNode = null;
    if (result && result.isFirstResponse) {
        bottomRowContents = (
            <Row>
                <Result>
                    Nailed it...
                    <Subtitle>
                        You're the first to vote on this matchup
                    </Subtitle>
                    <Button onClick={reset}>again</Button>
                </Result>
            </Row>
        );
    } else if (result) {
        bottomRowContents = (
            <Row>
                <Result>
                    <Counter
                        target={result.similarity * 100}
                        duration={1000}
                        callback={() => setTimeout(() => setCounting(false))}
                    />
                    %<Subtitle>agree</Subtitle>
                    <Button onClick={reset} hide={counting}>
                        again
                    </Button>
                </Result>
            </Row>
        );
    } else if (selection) {
        bottomRowContents = (
            <Row>
                <Result>
                    <Logo isLoading scale={0.3} color="#444" />
                </Result>
            </Row>
        );
    } else {
        bottomRowContents = (
            <Row>
                {board.game.answers.map((card) => (
                    <Card
                        key={card.id}
                        type="white"
                        content={card.text}
                        onClick={() => submit(card)}
                    />
                ))}
            </Row>
        );
    }

    return (
        <Wrapper>
            <Row style={{pointerEvents: "none"}}>
                <Card type="black" content={board.game.prompt.text} />
                <Stack>
                    <Card type="outline" content="" />
                    {selection && (
                        <Card type="white" content={selection.text} />
                    )}
                </Stack>
            </Row>
            {bottomRowContents}
        </Wrapper>
    );
};
