import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { BOSS_DAMAGE, BOSS_HEALTH, PHASE_DISCARD, PHASE_PLAY, PHASE_SETUP } from "../lib/constants.js";
import { generateTavernDeck, generateCastleDeck, drawCards, playCards, discardCards, nextBoss, reshuffleCards, bossKilled } from "../lib/regicideUtils.js";
import Boss from "./Boss.js";
import Hand from "./Hand.js";

const Game = () => {
    const [phase, setPhase] = useState(PHASE_SETUP);
    const [currentBoss, setCurrentBoss] = useState({});
    const [currentBossHealth, setCurrentBossHealth] = useState(0);
    const [playerBlocking, setPlayerBlocking] = useState(0);
    const [handOfCards, setHandOfCards] = useState([]);
    const [discardPile, setDiscardPile] = useState([]);
    const [tavernDeck, setTavernDeck] = useState(generateTavernDeck());
    const [castleDeck, setCastleDeck] = useState(generateCastleDeck());
    const [enemyDamagePile, setEnemyDamagePile] = useState([]);

    const getNextBoss = () => {
        const result = nextBoss(castleDeck);
        setCurrentBoss(result.boss);
        setCastleDeck(result.castleDeck);
        setCurrentBossHealth(BOSS_HEALTH[result.boss.value])
    }

    const kill = (matched) => {
        const result = bossKilled(currentBoss, tavernDeck, enemyDamagePile, discardPile, matched);
        setTavernDeck(result.tavernDeck);
        setEnemyDamagePile(result.enemyDamagePile);
        setDiscardPile(result.discardPile);
        getNextBoss();
    }

    const draw = (numberOfCards) => {
        const result = drawCards(tavernDeck,handOfCards, numberOfCards);
        setTavernDeck(result.tavernDeck);
        setHandOfCards(result.handOfCards);
    }

    const reshuffle = (numberOfCards) => {
        const result = reshuffleCards(tavernDeck,discardPile, numberOfCards);
        setTavernDeck(result.tavernDeck);
        setDiscardPile(result.discardPile);
    }

    const play = (cards) => {
        const result = playCards(enemyDamagePile, handOfCards, currentBoss.suit, cards);
        setEnemyDamagePile(result.enemyDamagePile);
        setHandOfCards(result.handOfCards);
        setPlayerBlocking(0);
        console.log(result)

        if(result.reshuffle !== 0) {
            reshuffle(result.reshuffle);
        }

        if(result.redraw !== 0) {
            draw(result.redraw);
        }

        if(result.blocking !== 0) {
            setPlayerBlocking(result.blocking);
        }

        if(currentBossHealth - result.damageDealt <= 0) {
            kill(currentBossHealth - result.damageDealt === 0)
        } else {
            setCurrentBossHealth(currentBossHealth - result.damageDealt);
            if(BOSS_DAMAGE[currentBoss.value] - result.blocking > 0) {
                setPhase(PHASE_DISCARD);
            }
        }

        
    }

    const discard = (cards) => {
        const result = discardCards(discardPile, handOfCards, cards);
        setDiscardPile(result.discardPile);
        setHandOfCards(result.handOfCards);
        setPhase(PHASE_PLAY);
    }

    if(phase === PHASE_SETUP) {
        draw(8);
        getNextBoss();
        setPhase(PHASE_PLAY);
    }

    return (
        <View style={styles.container}>
            <Decks/>
            <Boss
                boss={currentBoss}
                currentBossHealth={currentBossHealth}
                maxBossHealth={BOSS_HEALTH[currentBoss.value]}
            />
            <Hand 
                handOfCards={handOfCards}
                phase={phase}
                enemyDamage={BOSS_DAMAGE[currentBoss.value]}
                playerBlocking={playerBlocking}
                play={play}
                discard={discard}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Game;