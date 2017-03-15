import MySQLdb
username=raw_input("Enter username of mysql db ")
password=raw_input("Enter password of mysql db ")
db=raw_input("Enter the name of the database ")

print username,password,db

db = MySQLdb.connect("localhost",username,password,db )
cursor = db.cursor()

tablename=raw_input("Enter the name of the table to export ")
query="describe "+tablename+";";
cursor.execute(query)
columns=cursor.fetchall()
print "The columns are:"
for column in columns:
	print column[0],column[1]


export_columns=raw_input("Enter the column you wish to export (seperated by columns)\n")

print export_columns

query="select "+export_columns+" from "+tablename+";"
cursor.execute(query)
rows=cursor.fetchall()
print rows