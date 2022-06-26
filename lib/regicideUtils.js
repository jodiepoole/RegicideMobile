import { SUITS, TAVERN_SUIT_CARDS, ENEMIES, HAND_LIMIT, ANIMAL_COMPANION, SPADES, HEARTS, DIAMONDS, CLUBS, CLUBS_DAMAGE_MODIFIER } from "../lib/constants";

export const newCard = (suit, value) => {return {suit, value}};

// Fisher-Yates shuffle algorithm 
export function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

export const findIndexOfCardInDeck = (deck, card) => deck.findIndex(e => e.value === card.value && e.suit === card.suit);

export const sumCardValues = (cards) => cards.reduce((accumulator, object) => {
    return accumulator + object.value;
}, 0)

export const generateTavernDeck = () => {
    let newTavernDeck = [];
    SUITS.forEach(suit => {
        TAVERN_SUIT_CARDS.forEach(value => {
            newTavernDeck.push(newCard(suit, value));
        });
    });
    return shuffle(newTavernDeck);
}


export const generateCastleDeck = () => {
    let newCastleDeck = [];
    ENEMIES.forEach(value => {
        let enemyDeck = []
        SUITS.forEach(suit => {
            enemyDeck.push(newCard(suit, value));
        });
        newCastleDeck = newCastleDeck.concat(shuffle(enemyDeck));
    });
    return newCastleDeck;
}

export const drawCards = (tavernDeck, handOfCards, numberOfCards) => {
    for(let i = 0; i < numberOfCards; i++) {
        if(handOfCards.length !== HAND_LIMIT && tavernDeck.length > 0) {
            handOfCards.push(tavernDeck.pop());
        }
    }
    return {
        tavernDeck, 
        handOfCards
    };
}

export const bossKilled = (currentBoss, tavernDeck, enemyDamagePile, discardPile, matched) => {
    if(matched) {
        tavernDeck.push(currentBoss);
    } else {
        discardPile.push(currentBoss);
    }

    for(let i = 0; i < enemyDamagePile.length; i++) {
        discardPile.push(enemyDamagePile[i])
    }

    enemyDamagePile = []

    return {
        tavernDeck, 
        enemyDamagePile, 
        discardPile
    };
}

export const reshuffleCards = (tavernDeck, discardPile, numberOfCards) => {
    for(let i = 0; i < numberOfCards; i++) {
        if(discardPile.length > 0) {
            tavernDeck.unshift(shuffle(discardPile).pop());
        }
    }

    return {
        tavernDeck, 
        discardPile
    };
}

export const playCards = (enemyDamagePile, handOfCards, bossType, cards) => {
    const sumValue = sumCardValues(cards);
    let clubsAttackModifier = false;
    let damageDealt = sumValue;
    let blocking = 0;
    let redraw = 0;
    let reshuffle = 0;
    for(let i = 0; i < cards.length; i++) {
        console.log(bossType, cards[i].suit)
        if(bossType !== cards[i].suit) {
            switch(cards[i].suit) {
                case SPADES: {
                    blocking = sumValue;
                    break;
                }
                case HEARTS: {
                    reshuffle = sumValue;
                    break;
                }
                case DIAMONDS: {
                    redraw = sumValue;
                    break;
                }
                case CLUBS: {
                    clubsAttackModifier = true;
                    break;
                }
                default:
                    break;
            }
        }

        const index = findIndexOfCardInDeck(handOfCards, cards[i]);
        if(index !== -1) {
            enemyDamagePile.push(cards[i]);
            handOfCards.splice(index, 1);
        }
    }

    if(clubsAttackModifier) {
        damageDealt = damageDealt * CLUBS_DAMAGE_MODIFIER;
    }

    return {
        enemyDamagePile, 
        handOfCards,
        damageDealt,
        blocking,
        reshuffle,
        redraw
    }
}

export const discardCards = (discardPile, handOfCards, cards) => {
    for(let i = 0; i < cards.length; i++) {
        const index = findIndexOfCardInDeck(handOfCards, cards[i])
        if(index !== -1) {
            discardPile.push(cards[i]);
            handOfCards.splice(index, 1)
        }
    }

    console.log(discardPile.length, handOfCards.length)

    return {
        discardPile, 
        handOfCards
    }
}

export const nextBoss = (castleDeck) => {
    const boss = castleDeck.pop();
    return {
        boss,
        castleDeck
    }
}

export const validateCombo = (selectedCard, card, sum) => {
    return ( 
        selectedCard.value !== card.value || 
        card.value !== ANIMAL_COMPANION || 
        (sum + card.value > 10)
    );
}