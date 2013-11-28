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
create the test database. When prompted for a new password, use `wearetapvote`.
```
$ sudo -u postgres psql postgres
# \password postgres
# create database tapvotetest;
<Ctrl>-D
```

Now set up the schema (run this command from the TapVote repository directory):
```
$ node_modules/.bin/db-migrate up
```

If everything worked, you should be able to start the server by running:
```
$ nodejs index.js
```

Browse to `http://localhost:8000` to start using TapVote!
