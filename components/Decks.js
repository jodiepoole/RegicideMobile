import { View, Text, StyleSheet } from "react-native";

const Decks = ({discardPile, tavernDeck, castleDeck, enemyDamagePile}) => {

    return (
        <View style={styles.container}>
            <Text>
                {"discardPile: " + discardPile.length}
            </Text>
            <Text>
                {"tavernDeck: " + tavernDeck.length}
            </Text>
            <Text>
                {"castleDeck: " + castleDeck.length}
            </Text>
            <Text>
            {"enemyDamagePile: " + enemyDamagePile.length}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        top: "3%",
        left: "3%",
    },
});

export default Decks;