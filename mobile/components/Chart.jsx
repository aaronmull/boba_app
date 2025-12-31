// components/Chart.jsx
import { Dimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit"
import { COLORS } from "../constants/colors";

const screenWidth = Dimensions.get("window").width

export default function Chart({ data }) {
    if(!data || data.length === 0) return null

    return (
        <View>
            <LineChart 
                data={data}
            />
        </View>
    )
}
