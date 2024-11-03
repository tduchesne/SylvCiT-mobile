import csv
import subprocess
from datetime import datetime

# ===================================================================== #
# Function that escapes single quotes from SQL queries
# ===================================================================== #
def escape_string(value: str) -> str:
    return value.replace("'", "\\'")


# ===================================================================== #
# Function that parse the date format to a more readable form for the tree data
# ===================================================================== #
def parse_date(date_str):
    if date_str:
        print(datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S"))
        return datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S")
    return datetime(1970, 1, 1, 0, 0, 0)


# ===================================================================== #
# Helper function to execute a MySQL command and retrieve output
# ===================================================================== #
def execute_query(query):
    command = f"docker exec -i inm5151-a2024-sylvcit-db-1 mysql -u root -proot inm5151_db -e \"{query}\""
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()
    return stdout.decode('utf-8'), stderr.decode('utf-8')


# ===================================================================== #
# Function responsible for adding the functional_group fields of the database. 
# PS: In its current state, there's only one group thats added to the database (group A). 
# When we get more information on said groups, we can modify the function call to include these groups
# ===================================================================== #
def add_f_groups(group: str):
    insert_command = f"INSERT INTO functional_group (\\`group\\`, description) VALUES ('{group}', 'description to be added');"
    execute_query(insert_command)


# ===================================================================== #
# Check if the functional group exists in the database and return its ID
# (recursive calls if id isnt found currently in DB)
# ===================================================================== #
def get_f_group_id(group):
    query = f"SELECT id_functional_group FROM functional_group WHERE \\`group\\` = '{group}'"
    stdout, _ = execute_query(query)
    if stdout.strip():
        return int(stdout.splitlines()[1])
    # Insert if not exists
    add_f_groups(group)
    return get_f_group_id(group)


# ===================================================================== #
# Function responsible for adding families in db 
# (recursive calls if id isnt found currently in DB)
# ===================================================================== #
def add_family(f_name: str):
    query = f"SELECT id_family FROM family WHERE name = '{f_name}'"
    stdout, _ = execute_query(query)
    if stdout.strip():
        return int(stdout.splitlines()[1])
    # Insert if not exists
    insert_command = f"INSERT INTO family (name) VALUES ('{f_name}');"
    execute_query(insert_command)
    return add_family(f_name)


# ===================================================================== #
# Function responsible for adding genres in db 
# (recursive calls if id isnt found currently in DB)
# ===================================================================== #
def add_genre(g_name: str):
    query = f"SELECT id_genre FROM genre WHERE name = '{g_name}'"
    stdout, _ = execute_query(query)
    if stdout.strip():
        return int(stdout.splitlines()[1])
    # Insert if not exists
    insert_command = f"INSERT INTO genre (name) VALUES ('{g_name}');"
    execute_query(insert_command)
    return add_genre(g_name)


# ===================================================================== #
# Function responsible for adding positions in db (Honestly irrelevant since positions are all unique**)
# (recursive calls if id isnt found currently in DB)
# ===================================================================== #
def add_position(latitude, longitude):
    query = f"SELECT id_location FROM location WHERE latitude = '{latitude}' AND longitude = '{longitude}'"
    stdout, _ = execute_query(query)
    if stdout.strip():
        return int(stdout.splitlines()[1])
    # Insert if not exists
    insert_command = f"INSERT INTO location (latitude, longitude) VALUES ('{latitude}', '{longitude}');"
    execute_query(insert_command)
    return add_position(latitude, longitude)


# ===================================================================== #
# Function responsible for adding types in db 
# ===================================================================== #
def add_type(n_latin: str, n_french: str, n_english: str):

    # Escape strings before using them in the query
    n_latin = escape_string(n_latin)
    n_french = escape_string(n_french)
    n_english = escape_string(n_english)

    query = f"SELECT id_type FROM type WHERE name_la = '{n_latin}'"
    stdout, _ = execute_query(query)
    if stdout.strip():
        return int(stdout.splitlines()[1]) 
    # Insert if not exists
    insert_command = f"INSERT INTO type (name_fr, name_en, name_la) VALUES ('{n_french}', '{n_english}', '{n_latin}');"
    stdout, stderr = execute_query(insert_command)
    print(stdout, stderr)
    return add_type(n_latin, n_french, n_english)

# ===================================================================== #
# Function responsible for adding trees in db based on other function calls
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
            id_functional_group = get_f_group_id('A')
            dhp = tree['DHP']
            image_url = "https://arbres.hydroquebec.com/image/9034"
            
            insert_command = (
                f"INSERT INTO tree (date_plantation, date_measure, details_url, id_type, id_genre, "
                f"id_family, id_functional_group, id_location, dhp, image_url) "
                f"VALUES ('{date_plantation}', '{date_measure}', 'tree image url', '{id_type}', "
                f"'{id_genre}', '{id_family}', '{id_functional_group}', '{id_location}', '{dhp}', '{image_url}');"
            )
            _, stderr = execute_query(insert_command)

            # TODO: manage the return value of last query

def main():
    add_trees()

if __name__ == "__main__":
    main()

