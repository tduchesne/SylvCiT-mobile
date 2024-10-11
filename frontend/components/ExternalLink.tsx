import { Link, Href } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { type ComponentProps } from "react";
import { Platform } from "react-native";
import React from "react";

// Typage des props pour ExternalLink
type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: Href<string | object> };

// Utilisation de `Href` dans le composant
export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async (event) => {
        if (Platform.OS !== "web") {
          event.preventDefault();
          await openBrowserAsync(typeof href === "string" ? href : href.toString());
        }
      }}
    />
  );
}
