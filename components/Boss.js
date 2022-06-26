import { Text } from "react-native";

const Boss = ({boss, currentBossHealth, maxBossHealth}) => {
    return (<Text>
        {boss.value + " OF " + boss.suit + "\n" + currentBossHealth  + " / " + maxBossHealth}
    </Text>)
}

export default Boss;