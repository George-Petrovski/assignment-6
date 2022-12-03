import React from "react";
import { useAtom } from "jotai";
import { searchHistoryAtom } from "../store";
import { useRouter } from "next/router";
import { Card, ListGroup, Button } from 'react-bootstrap';
import styles from '../styles/History.module.css';
import { removeFromHistory } from "../lib/userData";

export default function History(){
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
    const router = useRouter();

    if(!searchHistory) return null;

    let parsedHistory = [];

    searchHistory.forEach(h => {
        let params = new URLSearchParams(h);
        let entries = params.entries();
        parsedHistory.push(Object.fromEntries(entries));
    });

    function historyClicked(e, index) {
        e.preventDefault();
        router.push(`/artwork?${searchHistory[index]}`);
    }

    async function removeHistoryClicked(e, index) {
        e.stopPropagation(); // stop the event from trigging other events
        setSearchHistory(await removeFromHistory(searchHistory[index]));
    }

    return (
        <>
            <ListGroup>
                <br/><br/>
                    {parsedHistory.length > 0
                    ? parsedHistory.map((historyItem, index) => {
                        return (
                                <ListGroup.Item key={historyItem.id} className={styles.historyListItem}
                                    onClick={e => historyClicked(e, index)} >
                                    {Object.keys(historyItem).map(key => (<>{key}: <strong>{historyItem[key]}</strong>&nbsp;</>))}
                                    <Button className="float-end"
                                        variant="danger"
                                        size="sm"
                                        onClick={e => removeHistoryClicked(e, index)}>&times;</Button>
                                </ListGroup.Item>
                        )
                    })
                    : <Card>
                        <Card.Body>
                            <Card.Text>
                                <h4><strong>Nothing Here</strong></h4><br />
                                Try searching for some artwork
                            </Card.Text>
                        </Card.Body>
                    </Card>}
            </ListGroup>
        </>
    );
}