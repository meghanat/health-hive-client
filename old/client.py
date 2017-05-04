import MySQLdb
username=raw_input("Enter username of mysql db ")
password=raw_input("Enter password of mysql db ")
db=raw_input("Enter the name of the database ")

# print username,password,db

db = MySQLdb.connect("localhost",username,password,db )
# db = MySQLdb.connect("localhost","root","","somedb" )
cursor = db.cursor()

tablename=raw_input("Enter the name of the table to export ")
# tablename="activities_ayur_consultant"
query="describe "+tablename+";";
cursor.execute(query)
columns=cursor.fetchall()
print "The columns are:"
for column in columns:
	print column[0],column[1]


export_columns=raw_input("Enter the column you wish to export (seperated by columns)\n")
# export_columns="patient_id,prakruthi"

print export_columns

query="select "+export_columns+" from "+tablename+";"
cursor.execute(query)
rows=cursor.fetchall()
csv_header_row='"'+export_columns.replace(",",'","')+'"\n'
filename=tablename+".csv"
csv_file=open(filename,"w")
csv_file.write(csv_header_row)


for i in rows:
	print i
	row=",".join(map(str,i))
	row+="\n"
	csv_file.write( row)
