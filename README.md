TapVote
=======

TapVote Team repository



###Setup

Clone this repository:
```
$ git clone git@github.com:LutherSrProject/TapVote.git
```

Install dependencies:
```
$ cd TapVote
$ (sudo) npm install
```

Install the database server (all instructions aimed at Ubuntu. Installing PostgreSQL will differ by operating system):
```
$ sudo apt-get install postgresql
```

Connect to the newly installed Postgres server using the default `postgres` database. We will set a password and
create the development and test databases. When prompted for a new password, use `wearetapvote`.
```
$ sudo -u postgres psql postgres
# \password postgres
# create database tapvote;
# create database tapvotetest;
<Ctrl>-D
```

Install pgTap:
```
$ sudo apt-get install pgtap
```

Now set up the schema for the development database (run this command from the TapVote repository directory):
```
$ node_modules/.bin/db-migrate up
```

(Note that the schema for the unit-testing database (tapvotetest) will be created as needed by the unit test suite.)

If everything worked, you should be able to start the server by running:
```
$ nodejs index.js
```

Browse to `http://localhost:8000` to start using TapVote!


###API

The API is made up of a series of JSON endpoints that can be utilized to do all operations related to creating, presenting, editing, and removing surveys.

See the [API Documentation page](https://github.com/LutherSrProject/TapVote/wiki/API-Documentation) for more information.

