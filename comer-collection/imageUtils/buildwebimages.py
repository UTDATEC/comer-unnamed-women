import os, sys
from PIL import Image


def convert_tiff_to_png_with_max_dimension(in_file_path, out_path, max_dimaension = 800, extraID = "", overwrite=False):
    out_filename = out_path + os.path.splitext(os.path.split(in_file_path)[1])[0] + extraID + ".png"
    if not os.path.isfile(out_filename) or overwrite:
        im = Image.open(in_file_path)
        width, height = im.size
        if width > height:
            new_width = max_dimaension
            new_height = int((new_width / width) * height)
        else:
            new_height = max_dimaension
            new_width = int((new_height / height) * width)
        try:
            im_resized = im.resize((new_width, new_height))
            im_resized.save(out_filename)
        except Exception  as e:
            print("unable to resize", in_file_path )
            print(str(e))

def get_tiff_files(directory):
    tiff_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".tiff") or file.endswith(".tif"):
                tiff_files.append(os.path.relpath(os.path.join(root, file), directory))
    return tiff_files
os.chdir("imageUtils/images")
for infile in get_tiff_files("."):
    out_path = infile.split('/')[0] + "/web/"  
    extraID = ""
    if 'back' in infile:
        extraID = "_back"
    convert_tiff_to_png_with_max_dimension(infile,out_path,extraID=extraID)
    extraID+="_thumb"
    convert_tiff_to_png_with_max_dimension(infile,out_path,max_dimaension=128,extraID=extraID)


