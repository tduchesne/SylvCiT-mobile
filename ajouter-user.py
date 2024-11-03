import subprocess
import os
import bcrypt
import getpass

# Fonction pour hacher le mot de passe
def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

# Fonction pour ajouter un utilisateur via une commande shell
def add_user_via_shell(username, password, role):
    hashed_password = hash_password(password).decode('utf-8').replace('$', '\\$')
    insert_command = f"INSERT INTO user (username, password, role) VALUES ('{username}', '{hashed_password}', '{role}');"

    command = f"docker exec -i inm5151-a2024-sylvcit-db-1 mysql -u root -proot  inm5151_db -e \"{insert_command}\""
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()

    if process.returncode == 0:
        print("Utilisateur ajouté avec succès.")
    else:
        error_msg = stderr.decode('utf-8')
        if "Duplicate entry" in error_msg:
            print("Le nom d'utilisateur est déjà pris. Veuillez réessayer.")
            username = get_username()
            add_user_via_shell(username, password, role)

# Fonction de validation de nom utilisateur
def get_username():
    username = input("Entrez le nom d'utilisateur : ")
    while len(username) > 80:
        username = input("Le nom d'utilisateur doit etre moin de 80 characteres: ")
    return username

# Fonction de validation du role
def get_role():
    role = input("Entrez le role ( 1 pour etudiant, 2 pour expert ): ")
    while int(role) != 1 and int(role) != 2 :
         role = input("le role doit etre soit 1 pour etudiant, soit 2 pour expert: ")
    
    return role

# Fonction principale
def main():
    username = get_username()
    password = getpass.getpass("Entrez le mot de passe : ")
    role = get_role()
    add_user_via_shell(username, password, role)

if __name__ == "__main__":
    main()
