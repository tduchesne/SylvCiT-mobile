
import FormAjoutArbre from "@/components/FormAjouterArbre";
import Screen from "@/components/Screen";
import { ThemedView } from "@/components/ThemedView";
import { Image, StyleSheet } from 'react-native';
import React, { useState } from "react";

export default function AjouterArbre() {

    return (
        <ThemedView style={{ flex: 1 }}>
            <Screen
                title="Ajouter Arbre"
                content={
                    <FormAjoutArbre />

                } headerImage={
                    <Image
                        source={require("@/assets/images/adaptive-icon.png")}
                        style={styles.treeLogo} />
                } /></ThemedView>
    )
}

const styles = StyleSheet.create({
    treeLogo: {
        height: 230,
        width: 310,
        bottom: 0,
        left: 36,
        position: "absolute",
    }
});


