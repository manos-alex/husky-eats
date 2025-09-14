import { StatusBar } from 'expo-status-bar';
import { Text, View, ScrollView } from 'react-native';
import "../../global.css";
import { useState, useEffect } from 'react';
import { DiningHall, getMenuItems, MenuItem } from '../api';

export default function Hall({hall}: any) {

    return (
        <ScrollView className="flex-1 bg-[#1A1A1A]">
            <Text className="font-[#DDD]" >{hall.name}</Text>
        </ScrollView>
    )
}