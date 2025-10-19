import React, { forwardRef, useCallback, useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Keyboard } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { COLORS } from '../constants/colors'
import { Ionicons } from '@expo/vector-icons';

const CustomBottomSheet = forwardRef(({ title, data = [], onSelect, selectedItem }, ref) => {
    const snapPoints = useMemo(() => ['50%', '75%', '90%'], []);
    const [search, setSearch] = useState('')
    const [filtered, setFiltered] = useState(data)

    const handleSelect = useCallback(
        (item) => {
            onSelect?.(item)
            ref.current?.close()
        },
        [onSelect]
    );

    useEffect(() => {
        if(!search.trim()) {
            setFiltered(data)
        } else {
            const lower = search.toLowerCase()
            setFiltered(
                data.filter((item) => {
                    const displayName = item.name || item.metric || ''
                    return displayName.toLowerCase().includes(lower)
                })
            )
        }
    }, [search, data])

    const renderItem = ({ item }) => {

        const isSelected = selectedItem && selectedItem.id === item.id

        const displayName = item.name || item.metric || 'N/A'

        return (
            <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
                <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
                    {displayName}
                </Text>
                {isSelected && <Ionicons name="checkmark" size={20} color={COLORS.income} />}
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.wrapper}>
            <BottomSheet
                ref={ref}
                index={-1} // Initially closed
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                onChange={(index) => {
                    if(index === -1) Keyboard.dismiss()
                }}
            >
                <BottomSheetView style={styles.contentContainer}>
                    <Text style={styles.title}>{title}</Text>

                    {/* Search Bar */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="search" size={22} color={COLORS.textLight} style={styles.inputIcon} />
                        <TextInput 
                            style={styles.input}
                            placeholder={`Search...`}
                            placeholderTextColor={COLORS.textLight}
                            value={search}
                            onChangeText={setSearch}
                        />
                    </View>

                    {/* List */}
                    <FlatList 
                        data={filtered}
                        keyExtractor={(item) => item.id || item.id.toString()}
                        renderItem={renderItem}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>No items available</Text>
                        }
                    />
                </BottomSheetView>
            </BottomSheet>
        </View>
    );
});

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    contentContainer: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: COLORS.text,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
        backgroundColor: COLORS.white,
    },
    inputIcon: {
        marginHorizontal: 12,
    },
    input: {
        flex: 1,
        padding: 12,
        fontSize: 16,
        color: COLORS.text,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    itemText: {
        fontSize: 16,
        color: COLORS.text,
    },
    itemTextSelected: {
        color: COLORS.income,
        fontWeight: '600',
    },
    emptyText: {
        textAlign: 'center',
        color: COLORS.border,
        marginTop: 20,
    },
});

export default CustomBottomSheet;