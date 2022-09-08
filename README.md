# Delta
#### Description
Delta is a website where you can store text online and share it with others. Each text stored 
is called a `Delta` and multiple texts are being referred to as `Deltas`.
You can choose to encrypt a Delta with a password and/or enable an auto-delete feature.

Delta uses PHP for server-side processing and HTML, Javascript, and CSS
(with bootstrap and mdboostrap for material-like design). I've decided to not use
any framework for PHP because it seemed overkill in this situation. Finally, SQL (MySQL)
is used to store Deltas in the database.

#### Folder and files structure
The structure of the project is as follows:
* src/ : contains all source files
  * public/ : contain all HTML, CSS, JS files
    * resources/ : contains images, css and js files
      * css/main.css : all the css used in Delta
      * js/main.js : all the Javascript code used in Delta
      * images/ : contains logo + icon of Delta
    * .htaccess : apache .htaccess file (in case of Apache web server)
    * delta.php : contains all the functions an php code to execute
    * favicon.ico : favicon of the website
    * index.html : html code to display Delta's user interface
  * delta.nginx.conf : nginx file configuration (in case of NGINX web server)
  * deltas.sql : SQL script to setup a new Database for Delta
  * requirements : list php modules that need to be installed on the server (debian based distros)
* .gitignore : gitignore file
* README.md : see README.md

#### Process
To create a new piece of text and share it, the user must go to the website,
write text in the text editor, and click on the `Save` button. When PHP stored the
data in the database (after sanitizing it), an UUID is returned by PHP and a link is
created on the website. This link will allow other users to view the delta saved in the
database.

When creating a delta, the user has the ability to setup a password and in this case
encryption will be used to protect the Delta (the library CryptoJS is used to encrypt the data).
The user has also the ability to enable an auto-remove feature. When the Delta is accessed 
via its URL, it will automatically erase itself in the Database.

#### Ideas to implement
* Add a period after which a Delta will self-destruct
* Let the user decide which encryption settings he wants to use
* Let the user store multiple deltas inside a folder-like structure
* Use a framework if the complexity of the project increase over time

#### Thank you
I would like to personally thank CS50x's staff for their incredible help.
I've learned a lot in Computer Sciences thanks to these lessons, and
I will probably continue to use everything I've learned at my job. 

