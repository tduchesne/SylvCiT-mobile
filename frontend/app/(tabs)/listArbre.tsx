
import TreeList from "@/components/listeArbre";
import Screen from "@/components/Screen";
import { ThemedView } from "@/components/ThemedView";
import { Image, StyleSheet } from 'react-native';
import React, { useState } from "react";


//////////////////////////////////
//Page seulement pour tester la fonctionalité ajout arbre. Pas pour la prod!!!!!!!
//////////////////////////////

export default function ListeArbre() {

    return (

        <TreeList />

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


