// components/Chart.jsx
import { Dimensions, View, Text, ScrollView } from "react-native";
import { useState, useEffect, useMemo } from "react";
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

    // Determine best performance based on metric type
    const bestPerformanceIndex = useMemo(() => {
        const values = data.datasets[0].data;
        if (!values.length) return null;

        // For time-based metrics, lower is better
        if (units === "s") {
            const minValue = Math.min(...values);
            return values.indexOf(minValue);
        }
        
        // For distance and weight, higher is better
        if (units === "in" || units === "lb") {
            const maxValue = Math.max(...values);
            return values.indexOf(maxValue);
        }

        return null;
    }, [data, units]);

    const chartConfig = {
        backgroundGradientFrom: COLORS.background,
        backgroundGradientTo: COLORS.background,
        decimalPlaces: 2,
        color: () => COLORS.primary,
        labelColor: () => COLORS.text,
        propsForDots: (dataPoint, dataPointIndex) => ({
            r: dataPointIndex === bestPerformanceIndex ? "6" : "3",
            strokeWidth: "2",
            stroke: dataPointIndex === bestPerformanceIndex ? (COLORS.pb || '#FFD700') : COLORS.primary,
            fill: dataPointIndex === bestPerformanceIndex ? (COLORS.pb || '#FFD700') : COLORS.primary,
        }),
        propsForBackgroundLines: {
            opacity: "0.18"
        }
    };

    const onDataClick = ({ value, index }) => {
        setSelectedPoint({
            value,
            label: data.labels[index],
            index
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
            const inches = totalInches % 12;
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

    const isBestPerformance = selectedPoint?.index === bestPerformanceIndex;

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
                        formatYAxisValue(Number(value).toFixed(2), units, metric)
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
                    backgroundColor: isBestPerformance ? COLORS.pb || '#FFD700' : COLORS.card,
                    shadowColor: "#000",
                    shadowOpacity: 0.15,
                    shadowRadius: 6,
                    elevation: 3,
                    alignItems: "center",
                }}
            >
                {selectedPoint ? (
                    <>
                        {isBestPerformance && (
                            <Text style={{ 
                                fontWeight: "600", 
                                color: COLORS.background,
                                fontSize: 14,
                                marginBottom: 4,
                            }}>
                                🏆 Personal Best
                            </Text>
                        )}
                        <Text style={{ 
                            fontWeight: "600", 
                            color: isBestPerformance ? COLORS.background : COLORS.text 
                        }}>
                            {selectedPoint.label}
                        </Text>
                        <Text style={{ 
                            color: isBestPerformance ? COLORS.background : COLORS.text, 
                            marginTop: 4,
                            fontWeight: isBestPerformance ? "500" : "400"
                        }}>
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