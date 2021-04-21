import React, {useState, useEffect} from "react";
import styled from "styled-components";

import {CreateGame, SubmitGame} from "../../common/endpoints";
import {IGameToken, IGameResult, ICard} from "../../internal/types";
import {Button} from "./button";
import {Card} from "./card";
import {Counter} from "./counter";
import {Logo} from "./logo";

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
    height: 18.8rem;
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

export const Board: React.FunctionComponent = () => {
    const [game, setGame] = useState<IGameToken | null>(null);
    const [selection, setSelection] = useState<ICard | null>(null);
    const [result, setResult] = useState<IGameResult | null>(null);
    const [counting, setCounting] = useState<boolean>(false);

    const submit = (card: ICard) => {
        if (!game) return;
        setSelection(card);
        SubmitGame.call({
            token: game,
            choice: card.id,
        })
            .then(setResult)
            .then(() => setCounting(true));
    };

    const reset = () => {
        setGame(null);
        setSelection(null);
        setResult(null);
        CreateGame.call({}).then(setGame);
    };

    // Load a game on initial render.
    useEffect(reset, []);

    if (!game) {
        return (
            <Wrapper>
                <div style={{paddingTop: "10rem"}}>
                    <Logo isLoading scale={0.5} color="#444" />
                </div>
            </Wrapper>
        );
    }

    let bottomRowContents: React.ReactNode = null;
    if (result) {
        bottomRowContents = (
            <Row>
                <Result>
                    <Counter
                        target={result.similarity * 100}
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
                    <Logo isLoading scale={0.5} color="#444" />
                </Result>
            </Row>
        );
    } else {
        bottomRowContents = (
            <Row>
                {game.answers.map((card) => (
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
                <Card type="black" content={game.question.text} />
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
