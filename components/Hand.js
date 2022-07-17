import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text, Button, Image } from 'react-native';
import { CARD_SELECTED_DISCARD, CARD_SELECTED_PLAY, PHASE_DISCARD, PHASE_PLAY } from '../lib/constants';
import { validateCombo, sumCardValues } from '../lib/regicideUtils';
import images from '../lib/images';

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
            <Image source={images[(card.suit + card.value).toLowerCase()]} style={styles.cardImage}/>
        </View>
    );
}

const Hand = ({handOfCards, phase, enemyDamage, playerBlocking, currentEnemyHealth, play, discard, yieldTurn}) => {

    const [state, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);
    const [selectedCards, setSelectedCards] = useState([]);
    const cardsSelectedLessThanDamage = sumCardValues(selectedCards) < (enemyDamage - playerBlocking);
    const cardsSelected = selectedCards.length !== 0;

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
            if(cardsSelected) {
                play(selectedCards)
            } else {
                yieldTurn();
            }
        } else {
            discard(selectedCards)
        }
        setSelectedCards([]);
    }

    return (
        <View style={styles.handContainer}>
            <Button 
                title={phase === PHASE_PLAY ? (cardsSelected ? "Submit" : "Yield") : "Discard"} 
                disabled={phase === PHASE_PLAY ? !selectedCards : cardsSelectedLessThanDamage} 
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        position: 'absolute',
        bottom: 3,
    },
    cardContainer: {
        backgroundColor: '#fff',
        flexDirection: "row",
    },
    card: {
        width:55,
        height:85,
        margin:5,
        borderColor: 'black',
        borderWidth: 1,
        display: "flex",
        backgroundColor: 'grey',
        justifyContent: "center"
    },
    cardSelected: {
        width:55,
        height:85,
        margin:5,
        borderColor: 'black',
        borderWidth: 1,
        display: "flex",
        backgroundColor: CARD_SELECTED_PLAY,
        justifyContent: "center",
        opacity: 0.5
    },
    cardSelectedDiscarding: {
        width:55,
        height:85,
        margin:5,
        borderColor: 'black',
        borderWidth: 1,
        display: "flex",
        backgroundColor: CARD_SELECTED_DISCARD,
        justifyContent: "center",
        opacity: 0.5
    },
    cardDisabled: {
        width:55,
        height:85,
        margin:5,
        borderColor: 'black',
        borderWidth: 1,
        display: "flex",
        backgroundColor: 'grey',
        justifyContent: "center",
        opacity: 0.5
    },
    cardText: {
        textAlign: "center",
        fontSize: 10,
    },
    cardImage: {
        width:53,
        height:84,
    }
});

export default Hand;