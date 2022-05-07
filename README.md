# comer-unnamed-women
Project space for Spring 2022 UTDesign project for UTD's Comer Collection and xtine burrough's AN Archive of Unnamed Women

How to set up and test/use what we have so far:
We used mySQLWorkbench, but you can probably do it in any way that you can set up mySQL tables;
Set up a database and pass in the name and user credentials to the sequelize.js file. Then when you run the backend server code, it will automatically create a blank table in your database.

Then you can run the front end server and go to the /datainputform to add to the database through the POST request the submitted request.

You can search on the default front end page in any field you want and it will do a string search through that field:
Example:
if there is Da Vinci, Leonardo in the artist field in the database, the following would work to return the works of Da Vinci, Leonardo
Vinci || Leo || Da Vinci || Da v || vin
this is because we use the SQL LIKE "%TEXT%" query

you can email jordanatamm@gmail.com for any questions on the code!
