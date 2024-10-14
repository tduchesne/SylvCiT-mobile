
import TreeList from "@/components/listeArbre";
import Screen from "@/components/Screen";
import { ThemedView } from "@/components/ThemedView";
import { Image, StyleSheet } from 'react-native';



//Page pour test seulement pour le sprint. Pas pour la prod
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


