#!/bin/bash

# Automatise l'exécution des tests pour le projet SylvCiT.

# Vérifie l'installation de Docker, démarre les conteneurs, exécute les tests, puis nettoie l'environnement.

# === Configuration des couleurs pour l'affichage dans le terminal ===
# Ces variables stockent les codes ANSI pour colorer la sortie du terminal
# Utilisation: echo -e "${RED}texte en rouge${NC}"
RED='\033[0;31m'      # Pour les messages d'erreur
GREEN='\033[0;32m'    # Pour les succès
YELLOW='\033[1;33m'   # Pour les avertissements
NC='\033[0m'          # Réinitialise la couleur (No Color)

# Variable globale pour suivre l'état des tests
# Si un test échoue, cette variable passera à false
test_success=true

# === Fonctions utilitaires pour l'affichage des messages ===

# Affiche un message d'erreur en rouge
# Usage: display_error "Message d'erreur"
display_error() {
    echo -e "${RED}❌ Erreur: $1${NC}"
}

# Affiche un message de succès en vert
# Usage: display_success "Message de succès"
display_success() {
    echo -e "${GREEN}✓ Succès: $1${NC}"
}

# Affiche un avertissement en jaune
# Usage: display_warning "Message d'avertissement"
display_warning() {
    echo -e "${YELLOW}⚠ Attention: $1${NC}"
}

echo "Démarrage des tests locaux pour SylvCiT..."

# === Vérification des prérequis ===
echo "Vérification de Docker..."
# Vérifie si les commandes docker et docker-compose sont disponibles dans le système
# command -v retourne 0 si la commande existe, 1 sinon
# &> /dev/null redirige toute sortie vers /dev/null pour supprimer les messages d'avertissement
if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null; then
    display_error "Docker et/ou docker-compose ne sont pas installés"
    exit 1  
fi
display_success "Docker est correctement installé"

# === Démarrage des conteneurs ===
echo "Construction et démarrage des conteneurs..."
# --build : Force la reconstruction des images pour avoir le dernier code
# -d : Mode détaché pour permettre au script de continuer et gérer les tests plutôt que d'être bloqué par l'affichage des logs
if ! docker-compose up --build -d; then
    display_error "Échec de la construction des conteneurs"
    exit 1
fi
display_success "Conteneurs démarrés avec succès"

echo "Attente du démarrage des services..."
# Pause de 30 secondes pour laisser le temps aux services de s'initialiser complètement
sleep 30  

# === Vérification de l'état des conteneurs ===
echo "Vérification des conteneurs..."
# Vérifie si tous les conteneurs sont en état "running"
# ps --services liste tous les services
# --filter filtre selon le statut
# grep -q : retourne uniquement le code de sortie sans afficher les résultats (-q = silencieux)
if ! docker-compose ps --services --filter "status=running" | grep -q .; then
    display_error "Tous les conteneurs ne sont pas en cours d'exécution"
    docker-compose logs  
    docker-compose down  
    exit 1
fi
display_success "Tous les conteneurs sont en cours d'exécution"

# === Exécution des tests ===
echo "Exécution des tests du backend..."
# docker-compose exec : permet d'exécuter une commande dans un conteneur en cours d'exécution
# -T : désactive l'interface interactive pour l'automatisation des tests
# -v active le mode verbeux
if ! docker-compose exec -T backend pytest tests/ -v; then
    display_warning "Les tests du backend ont échoué"
    test_success=false
else
    display_success "Tests du backend réussis"
fi

# Tests frontend à implémenter éventuellement
echo "Tests frontend désactivés pour le moment..."
display_warning "Les tests frontend seront configurés ultérieurement"

# === Nettoyage ===
echo "Nettoyage de l'environnement de test..."
# Arrête et supprime tous les conteneurs, réseaux et volumes créés par docker-compose up
docker-compose down 

# === Rapport final ===
# Vérifie si tous les tests ont réussi et sort avec le code approprié
if [ "$test_success" = false ]; then
    display_error "Certains tests ont échoué - voir les logs ci-dessus"
    exit 1
else
    display_success "Tests terminés avec succès"
fi
