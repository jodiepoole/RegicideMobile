import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { CARD_SELECTED_DISCARD, CARD_SELECTED_PLAY, PHASE_DISCARD, PHASE_PLAY } from '../lib/constants';
import { validateCombo, sumCardValues } from '../lib/regicideUtils';

const CardView = ({index, card, discarding, selectedCards, toggleSelectedCards}) => {
    const [selected, setSelected] = useState(false);
    const [cardDisabled, setCardDisabled] = useState(false);

    const toggleSelected = () => {
        if(!cardDisabled) {
            toggleSelectedCards(index);
            setSelected(!selected);
        }
    }

    useEffect(() => {
        if(!selected && !discarding) {
            let disable = false;
            const sum = sumCardValues(selectedCards)
            selectedCards.forEach(selectedCard => {
                if(validateCombo(selectedCard, card, sum)) {
                    disable = true;
                } 
            })
            if(cardDisabled !== disable) {
                setCardDisabled(disable);
            }
        } else if (discarding && cardDisabled) {
            setCardDisabled(false);
        }
    }, [selectedCards.length, discarding])


    return (
        <View 
            style={selected ? (discarding ? styles.cardSelectedDiscarding: styles.cardSelected) : (cardDisabled ? styles.cardDisabled : styles.card)} 
            onTouchStart={toggleSelected}
        >
            <Text style={styles.cardText}>
                {(card.value === 1 ? "Ace" : card.value ) + "\n"}
                {"OF\n"}
                {card.suit}
            </Text>
            
        </View>
    );
}

const Hand = ({handOfCards, phase, enemyDamage, playerBlocking, currentEnemyHealth, play, discard}) => {

    const [state, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);
    const [selectedCards, setSelectedCards] = useState([]);

    useEffect(() => {
        if(phase === PHASE_DISCARD) {
            const handTotal = sumCardValues(handOfCards);
            if(handTotal < enemyDamage) {
                console.log("GAME OVER")
            }
        }
    }, [phase]);

    const toggleSelectedCards = (index) => {
        let tempSelectedCards = selectedCards
        const card = handOfCards[index];
        const cardSelectedIndex = selectedCards.findIndex(e => e.suit === card.suit && e.value === card.value);
        if(cardSelectedIndex === -1) {
            tempSelectedCards.push({
                suit: card.suit,
                value: card.value,
                index: index
            })
        } else {
            tempSelectedCards.splice(cardSelectedIndex, 1)
        }
        setSelectedCards(tempSelectedCards);
        forceUpdate();
    }

    const act = () => {
        if(phase === PHASE_PLAY) {
            play(selectedCards)
        } else {
            discard(selectedCards)
        }
        setSelectedCards([]);
    }

    return (
        <View style={styles.handContainer}>
            <Button 
                title={"Submit"} 
                disabled={phase === PHASE_PLAY ? (selectedCards.length === 0) : (sumCardValues(selectedCards) < (enemyDamage - playerBlocking))} 
                onPress={act}
            />
            <View style={styles.cardContainer} >
                {handOfCards.map((card, index) => {
                    return <CardView 
                        key={card.value + "_" + card.suit} 
                        index={index} 
                        card={card} 
                        discarding={phase === PHASE_DISCARD}
                        selectedCards={selectedCards} 
                        toggleSelectedCards={toggleSelectedCards} 
                    />
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    handContainer: {
        alignItems: 'center',
        padding: 10,
        position: 'absolute',
        bottom: 3,
    },
    cardContainer: {
        backgroundColor: '#fff',
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row"
    },
    card: {
        width:60,
        height:100,
        margin:2,
        borderWidth: 2,
        borderRadius: 2,
        display: "flex",
        backgroundColor: 'grey',
        justifyContent: "center"
    },
    cardSelected: {
        width:61,
        height:101,
        margin:2,
        borderWidth: 2,
        borderRadius: 2,
        borderColor: CARD_SELECTED_PLAY,
        display: "flex",
        backgroundColor: 'grey',
        justifyContent: "center"
    },
    cardSelectedDiscarding: {
        width:61,
        height:101,
        margin:2,
        borderWidth: 2,
        borderRadius: 2,
        borderColor: CARD_SELECTED_DISCARD,
        display: "flex",
        backgroundColor: 'grey',
        justifyContent: "center"
    },
    cardDisabled: {
        width:60,
        height:100,
        margin:2,
        display: "flex",
        backgroundColor: 'grey',
        justifyContent: "center",
        opacity: 0.5,
    },
    cardText: {
        textAlign: "center",
        fontSize: 10,
    }
});

export default Hand;