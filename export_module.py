    # importing the modules
import shutil
import os
import datetime

    # Providing the folder path
source = r"g:\sites\webgis-test.lolland.dk"
origin = os.path.dirname(__file__)
target = origin.replace(r"c:\spatialsuite-4.5.0\sites\sps450", source)

    # Replacing text/url in index.html
index_file = origin + r'\dist\index.html'
search_text = "http://localhost:8080/"
replace_text = "/"
with open(index_file, 'r') as file:
    data = file.read()
    data = data.replace(search_text, replace_text)

with open(index_file, 'w') as file:
    file.write(data)

    # target used for testing
# target = r'G:\sites\webgis-test.lolland.dk\appbase\spatialmap\WEB-INF\config\modules\custom\data'
 
    # using now() to get current time
current_time = datetime.datetime.now().timestamp()

    # rename dist folder to dist_[timestamp]
os.chdir(target)
dst = 'dist_' + str(current_time)
os.rename("dist", dst)

    #move dist folder
directory = r'\dist'
shutil.move(origin + directory, target + directory)

    # copy and overwrite readme.md file
filename = r'\readme.md'
shutil.copyfile(origin + filename, target + filename)

print("Module has been exportet på test-site!\nRemember to deploy the module...")