import { Tabs } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const no_emp = '1';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].inactive,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="carte"
        options={{
          title: "Carte",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "map" : "map-outline"}
              color={color}
            />
          ),
        }}
      />
            <Tabs.Screen
        name="ajouterArbre"
        options={{
          title: "Ajouter Arbre",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "add" : "add-sharp"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tree-analyzer"
        options={{
          title: "Tree Analyzer",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "aperture-outline" : "aperture-sharp"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="liste_arbre"
        options={{
          title: "Liste d'arbres",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "leaf" : "leaf"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tree_management"
        initialParams={{ no_emp }}
        options={{
          title: "Modifier Métadonnées",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "create" : "create-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="supprimer_arbres"
        options={{
          title: "Supprimer Arbres",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "trash" : "trash-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}  
