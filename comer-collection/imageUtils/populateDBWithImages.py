import os



def get_web_png_files(directory="."):
    png_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if (file.endswith(".png") or file.endswith(".PNG")) and not ('thumb' in file or '_back' in file or 'cropped' in file):
                png_files.append(os.path.relpath(os.path.join(root, file), directory))
    return png_files

class Artist:
    def __init__(self, name):
        self.name = name
        self.works = []
        self.filepath = ""

    def add_work(self, work, filepath):
        self.works.append([work, filepath])


def populate_artist_objects(file_names):
    artists = {}
    for file_name in file_names:
        base_name = os.path.basename(file_name)
        work_title = os.path.splitext(base_name)[0]
        
        artist_name = file_name.split('/')[0]
        if artist_name not in artists:
            artists[artist_name] = Artist(artist_name)
        artists[artist_name].add_work(work_title, file_name)
    return list(artists.values())

def build_SQL(artists):
    for artist in artists:
        for work in artist.works:
            #print("UPDATE atc_sandbox.comerCollection2s SET image_file_name='%s' where artist='%s',title='%s';"%(work[1],artist.name,work[0]))
            #print("SELECT title FROM  atc_sandbox.comerCollection2s WHERE artist='%s' AND title='%s';"%(artist.name.replace("'","\\'"),work[0].replace("'","\\'")))
            print("UPDATE atc_sandbox.comerCollection2s SET image_file_name='{0}' WHERE artist='{1}' AND title LIKE '{2}%';".format(work[1].replace("'","\\'"), artist.name.replace("'","\\'"),work[0].replace("'","\\'")))


os.chdir("/Users/dwm160130/Projects/comer-unnamed-women/comer-collection/imageUtils/images")
build_SQL(populate_artist_objects(get_web_png_files()))