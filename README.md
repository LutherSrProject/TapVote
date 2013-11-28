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


###API

The API is made up of a series of JSON endpoints that can be utilized to do all operations related to creating, presenting, editing, and removing surveys.

The base URL is `%host%/`.


#####`/createSurvey`

POST body:
```
{ 
  'title':'"Because clickers are SO 1999."', 
  'questions': [
                {'question': 'Which is best?', 
                 'type': MCSR,
                 'answers': ["Puppies", "Cheese", "Joss Whedon", "Naps"]
                }
               ],
  'password':'supersecretpassword'
}
```

Note that the attribute `type` of a question object can by any one of {'MCSR', 'MCMR', 'MCRANK', 'FR'}


POST response (contains the ID of the new survey):
``` 
{"surveyId" : 2}
```


#####`/getSurveyInfo`

GET body:
```
{"surveyId" : 2}
```

GET response (contains all the information needed to present the survey):
```
{ 
  title: "A sweet survey",
  questions: [
              { id:12,
                value: "What is your favorite color",
                type: "MCSR",
                answers: [
                          {id:45, value:"blue"},
                          {id:32, value:"red"}
                         ]
              },
              { id:14,
                value: "What is your favorite food",
                type: "MCSR",
                answers: [
                          {id:21, value:"pizza"},
                          {id:18, value:"cake"},
                          {id:12, value:"brains"}
                         ]
              }
            ]
}
```
