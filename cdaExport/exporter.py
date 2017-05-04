import os, shutil
import time

folder = '/Users/meghanathiyyakat/Documents/MTech/4thsem/4thSemProject/client/cdaExport/input'
# time.sleep(10)

for csv_file in os.listdir(folder):
    file_path = os.path.join(folder, csv_file)
    data=open("file_path","r")

    for line in data:
    	print line




    print file_path
    # try:
    #     if os.path.isfile(file_path):
    #         os.unlink(file_path)
        
    # except Exception as e:
    #     print(e)

