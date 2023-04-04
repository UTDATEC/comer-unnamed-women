import json
import os
import shutil



image_folder_data_json = '../resources/uniqueartists.json'

image_folder_data = {}

with open(image_folder_data_json) as json_file:
    image_folder_data = json.load(json_file)
print("read", len(image_folder_data), 'names from', image_folder_data_json)
   
ARTISTS_TITLES_DATA_JSON = '../resources/artists_titles.json'
artists_titles_data = {}

with open(artists_titles_data_json) as json_file:
    artists_titles_data = json.load(json_file)
print("read", len(artists_titles_data), 'names from', ARTISTS_TITLES_DATA_JSON)
   
print(artists_titles_data)
ORIGINAL_IMAGES_DIRECTORY = '/Users/dwm160130/Box Sync/Comer Collection Inventory - Photographs/'

def get_titled_folder_names(path_in_images_directory):
    original_directory = ORIGINAL_IMAGES_DIRECTORY + path_in_images_directory.split('/')[0]
    rest_of_path = ""
    if len(path_in_images_directory.split('/')) == 4:
        #print(path_in_images_directory.split('/'))
        rest_of_path = path_in_images_directory.split('/')[2]
    files = os.listdir(original_directory)
    files = [path_in_images_directory.split('/')[0] + '/' + f + '/' + rest_of_path for f in files if os.path.isdir(original_directory +'/'+f + '/' + rest_of_path)] #Filtering only the non-files .
    #print(*files, sep="\n")
    return(files)
os.mkdir('images')
for name in range(len(image_folder_data)):
    os.makedirs('images/'+image_folder_data[name]['dbname']+ '/front')
    os.makedirs('images/'+image_folder_data[name]['dbname']+ '/back')
    os.makedirs('images/'+image_folder_data[name]['dbname']+ '/uncropped')
    os.makedirs('images/'+image_folder_data[name]['dbname']+ '/web')
    os.makedirs('images/'+image_folder_data[name]['dbname']+ '/print')
    image_folders = []
    if 'TITLE' in image_folder_data[name]['pathName'] :
        image_folders = get_titled_folder_names(image_folder_data[name]['pathName'])
    elif image_folder_data[name]['pathName'] == '/Images/':
        print("no directory for", image_folder_data[name]['dbname'])
    else:
        image_folders = [ image_folder_data[name]['pathName'] ]
    for folder in image_folders:
        #print("folder:",folder)
        image_files = []
        if 'Condition Reports' in folder:
            pass
        else:
            image_files = os.listdir (original_images_directory + folder)
            image_files = [f for f in image_files if os.path.isfile(original_images_directory + folder +'/'+f )] #Filtering only the files .
            if len(image_files) == 0:
                print("no images found in ", original_images_directory + folder)
            #else:
                #print(*image_files, sep="\n")
        for image_file in image_files:
            source_image_path = original_images_directory + folder +'/'+ image_file
            destination_image_path = 'images/'+image_folder_data[name]['dbname']
            if 'back.' in image_file.lower():
                shutil.copy(source_image_path, destination_image_path + '/back')
            elif 'uncropped.' in image_file.lower():
                shutil.copy(source_image_path, destination_image_path + '/uncropped')
            elif 'web.' in image_file.lower():
                shutil.copy(source_image_path, destination_image_path + '/web')
            elif 'print.' in image_file.lower():
                shutil.copy(source_image_path, destination_image_path + '/print')
            else:
                shutil.copy(source_image_path, destination_image_path + '/front')
                possible_title = image_file.split('.')[0]
     
