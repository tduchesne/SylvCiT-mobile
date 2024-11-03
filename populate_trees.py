import csv
import subprocess
from datetime import datetime

# ===================================================================== #
# Data dictionnaries to hold the values and id's for each foreign key
# ===================================================================== #

f_groups = {}
types = {}
families = {}
genres = {}
locations = {}

# ===================================================================== #
# Function that parse the date format to a more readable form for the tree data
# ===================================================================== #
def parse_date(date_str):
    if date_str:
        print(datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S"))
        return datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S")
    return datetime(1970, 1, 1, 0, 0, 0)

# ===================================================================== #
# Function responsible for adding the functional_group fields of the database. 
# PS: In its current state, there's only one group thats added to the database (group A). 
# When we get more information on said groups, we can modify the function call to include these groups
# ===================================================================== #
def add_f_groups(group: str):
    insert_command = f"INSERT INTO functional_group (\\`group\\`, description) VALUES ('{group}', 'description to be added');"
    command = f"docker exec -i inm5151-a2024-sylvcit-db-1 mysql -u root -proot inm5151_db -e \"{insert_command}\""
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    _, stderr = process.communicate()

    if process.returncode == 0:
        print("Functionnal group was added succesfully.")
        f_groups[group] = len(f_groups) + 1
    else: 
        print("An error occured during the functionnal group insertion.")
        print(stderr.decode('utf-8'))

# ===================================================================== #
# Function reponsible for populating the family table of the database
# ===================================================================== #
def add_family(f_name: str):

    # If family exists, return its id
    if f_name not in families:
        new_id = len(families) + 1
        families[f_name] = new_id

    insert_command = f"INSERT INTO family (name) VALUES ('{f_name}');"
    command = f"docker exec -i inm5151-a2024-sylvcit-db-1 mysql -u root -proot inm5151_db -e \"{insert_command}\""
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    _, stderr = process.communicate()

    if process.returncode == 0:
        print("Family was added succesfully.")
    else: 
        error_msg = stderr.decode('utf-8')
        if "Duplicate" in error_msg:
            # Log the error to the console and keep going
            print(f"Error: duplicate family {f_name} was found. Using existing ID")
            print(stderr.decode('utf-8'))
    return families[f_name]

# ===================================================================== #
# Function reponsible for populating the genre table of the database
# ===================================================================== #
def add_genre(g_name: str):

    if g_name not in genres:
        new_id = len(genres) + 1
        genres[g_name] = new_id

    insert_command = f"INSERT INTO genre (name) VALUES ('{g_name}');"
    command = f"docker exec -i inm5151-a2024-sylvcit-db-1 mysql -u root -proot inm5151_db -e \"{insert_command}\""
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    _, stderr = process.communicate()
    
    if process.returncode == 0:
        print("Genre was added succesfully.")
    else: 
        error_msg = stderr.decode('utf-8')
        if "Duplicate" in error_msg:
            # Log the error to the console and keep going
            print(f"Error: duplicate genre {g_name} was found. Using existing ID")
            print(stderr.decode('utf-8'))
    return genres[g_name]

# ===================================================================== #
# Function reponsible for populating the location table of the database
# ===================================================================== #
def add_position(latitude, longitude):

    key = (latitude, longitude)

    if key not in locations:
        new_id = len(locations) + 1
        locations[key] = new_id

    insert_command = f"INSERT INTO location (latitude, longitude) VALUES ('{latitude}', '{longitude}');"
    command = f"docker exec -i inm5151-a2024-sylvcit-db-1 mysql -u root -proot inm5151_db -e \"{insert_command}\""
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    _, stderr = process.communicate()

    if process.returncode == 0:
        print("Location was added succesfully.")
    else: 
        error_msg = stderr.decode('utf-8')
        if "Duplicate" in error_msg:
            # Log the error to the console and keep going
            print(f"Error: duplicate location ({latitude}, {longitude}) was found. Using existing ID")
            print(stderr.decode('utf-8'))
    return locations[key]

# ===================================================================== #
# Function reponsible for populating the type table of the database
# ===================================================================== #
def add_type(n_latin: str, n_french: str, n_english: str):

    if n_latin not in types:
        new_id = len(types) + 1
        types[n_latin] = new_id

    insert_command = f"INSERT INTO type (name_fr, name_en, name_la) VALUES ('{n_french}', '{n_english}', '{n_latin}');"
    command = f"docker exec -i inm5151-a2024-sylvcit-db-1 mysql -u root -proot inm5151_db -e \"{insert_command}\""
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    _, stderr = process.communicate()
    
    if process.returncode == 0:
        print("Type was added succesfully.")
    else: 
        error_msg = stderr.decode('utf-8')
        if "Duplicate" in error_msg:
            # Log the error to the console and keep going
            print(f"Error: duplicate type {n_latin} was found. Using existing ID")
            print(stderr.decode('utf-8'))

    return types[n_latin]

# ===================================================================== #
# Function reponsible for populating the tree table of the database based on the result of the
# other functions
# ===================================================================== #
def add_trees():
    with open("pp_dataset.csv", newline="", encoding="utf-8") as csv_f:
        data = csv.DictReader(csv_f)

        for tree in data:
            date_plantation = parse_date(tree['Date_Plantation']).strftime("%Y-%m-%d %H:%M:%S")
            date_measure = parse_date(tree['Date_Releve']).strftime("%Y-%m-%d %H:%M:%S")
            id_type = add_type(tree['Essence_latin'], tree['Essence_fr'], tree['Essence_ang'])
            id_genre = add_genre(tree['Essence_latin'].split(' ')[0])
            id_family = add_family(tree['Essence_latin'].split(' ')[1])
            id_location = add_position(tree['Latitude'], tree['Longitude'])

            # TODO: Ajouter le statut de l'arbre + DHP

            insert_command = f"INSERT INTO tree (date_plantation, date_measure, details_url, id_type, id_genre, id_family, id_functional_group, id_location) VALUES ('{date_plantation}', '{date_measure}', 'tree image url', '{id_type}', '{id_genre}', '{id_family}', '{f_groups.get('A')}', '{id_location}');"
            command = f"docker exec -i inm5151-a2024-sylvcit-db-1 mysql -u root -proot inm5151_db -e \"{insert_command}\""
            process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            _, stderr = process.communicate()

            if process.returncode == 0:
                print("Tree was added successfully.")
            else:
                print("An error occurred while adding the tree.")
                print(stderr.decode('utf-8'))

def main():
    # Group is articificially added with only 'A'
    add_f_groups('A')
    add_trees()

if __name__ == "__main__":
    main()

