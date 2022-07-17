import { StyleSheet, View, Text, Image } from "react-native";
import images from '../lib/images'

const Boss = ({boss, currentBossHealth, maxBossHealth}) => {
    return (
    <View style={styles.bossContainer}>
        <Text>
            {boss.value + " OF " + boss.suit + "\n" + currentBossHealth  + " / " + maxBossHealth}
        </Text>
        <View 
            style={styles.bossCard} 
        >
            <Image source={images[(boss.suit + boss.value).toLowerCase()]} style={styles.cardImage}/>
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
    bossContainer: {
        position: 'absolute',
        alignItems: 'center',
        padding: 10,
        top: "3%",
        left: "39%",
    },
    bossCard: {
        width:56,
        height:86,
        margin:5,
        borderColor: 'black',
        borderWidth: 1,
        display: "flex",
        backgroundColor: 'grey',
        justifyContent: "center"
    },
    cardImage: {
        width:54,
        height:85,
    }
});

export default Boss;