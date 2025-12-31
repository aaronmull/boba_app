// components/Chart.jsx
// future improvements:
//  1. PR highlighting
//  2. Date ranges
import { Dimensions, View, Text, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { LineChart } from "react-native-chart-kit"
import { COLORS } from "../constants/colors";

const screenWidth = Dimensions.get("window").width

export default function Chart({ chartKey, data, metric, units }) {
    if(!data || data.datasets[0].data.length === 0) return null
    if (!data?.datasets?.[0]?.data?.length) return null;

    const [selectedPoint, setSelectedPoint] = useState(null)

    useEffect(() => {
        setSelectedPoint(null);
    }, [chartKey]);

    const chartConfig = {
        backgroundGradientFrom: COLORS.background,
        backgroundGradientTo: COLORS.background,
        decimalPlaces: 2,
        color: () => COLORS.primary,
        labelColor: () => COLORS.text,
        propsForDots: {
            r: "3",
            strokeWidth: "2",
            stroke: COLORS.primary,
        },
        propsForBackgroundLines: {
            opacity: "0.18"
        }
    };

    const onDataClick = ({ value, index }) => {
        setSelectedPoint({
            value,
            label: data.labels[index]
        })
    }

    const formatYAxisValue = (value, units, metric) => {
        const num = Number(value);

        if (units === "in") {
            if (metric === "Vertical Jump") {
                return `${num}"`;
            }
            const feet = Math.floor(num / 12);
            const inches = Math.round(num % 12);
            return `${feet}' ${inches}"`;
        }

        if (units === "s") {
            return num.toFixed(2);
        }

        if (units === "lb") {
            return num.toFixed(1);
        }

        return value;
    };

    const formatPerformance = (value) => {
        if(units === "in") {
            if(metric === "Vertical Jump") return `${value}"`
            const totalInches = Number(value);
            const feet = Math.floor(totalInches / 12);
            const inches = Math.round(totalInches % 12);
            return `${feet}' ${inches}"`;
        }
        if (units === "s") {
        return `${Number(value).toFixed(2)} s`;
        }
        if (units === "lb") {
        return `${Number(value).toFixed(1)} lb`;
        }
        return value ?? "-"
    }


    return (
        <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <LineChart 
                    data={data}
                    width={Math.max(screenWidth, data.labels.length * 50)}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    onDataPointClick={onDataClick}
                    formatYLabel={(value) => 
                        formatYAxisValue(value, units, metric)
                    }
                    verticalLabelRotation={-45}
                    xLabelsOffset={15}
                />
            </ScrollView>
            <View
                style={{
                    alignSelf: "center",
                    marginTop: 12,
                    marginBottom: 12,
                    padding: 10,
                    borderRadius: 10,
                    backgroundColor: COLORS.card,
                    shadowColor: "#000",
                    shadowOpacity: 0.15,
                    shadowRadius: 6,
                    elevation: 3,
                    alignItems: "center",
                }}
            >
                {selectedPoint ? (
                    <>
                        <Text style={{ fontWeight: "600", color: COLORS.text }}>
                            {selectedPoint.label}
                        </Text>
                        <Text style={{ color: COLORS.text, marginTop: 4 }}>
                            {formatPerformance(selectedPoint.value)}
                        </Text>
                    </>
                ) : (
                    <Text style={{ color: "#7A7A7A" }}>
                        Click a point to view your performance
                    </Text>
                )}
            </View>
        </View>
    )
}
