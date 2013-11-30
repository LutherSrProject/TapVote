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

**API methods**  
[/addQuestions](#addQuestions)  
[/createSurvey](#createSurvey)  
[/deVote](#deVote)  
[/getSurveyInfo](#getSurveyInfo)  
[/getSurveyResults](#getSurveyResults)  
[/removeQuestion](#removeQuestion)  
[/vote](#vote)  


=================================================================================================================
=================================================================================================================

<a name="addQuestions"></a>
####`/addQuestions`

TODO

=================================================================================================================
=================================================================================================================

<a name="createSurvey"></a>
####`/createSurvey`

Sends information needed to create a new survey. Returns the new survey ID.

**POST request body**:
```
{ 
  'title':'"Because clickers are SO 1999."', 
  'questions': [
                {'question': 'Which is best?', 
                 'type': 'MCSR',
                 'answers': ["Puppies", "Cheese", "Joss Whedon", "Naps"]
                }
               ],
  'password':'supersecretpassword'
}
```

Note that the attribute `type` of a question object can by any one of {'MCSR', 'MCMR', 'MCRANK', 'FR'}


**POST response body**:
``` 
{"surveyId" : 2}
```

=================================================================================================================
=================================================================================================================

<a name="deVote"></a> 
####`/deVote`

Removes a vote from the database. This will be used if/when a user changes their vote.

**POST request body**:
```
{"questionId" : 1, "answerId": 3}
```

**POST response body**:
```
{"status" : "success"}
```

**Possible errors**:
* `400 Bad Request: questionId and answerId don't match` - returned when the specified answerId isn't associated with the specified questionId.

=================================================================================================================
=================================================================================================================

<a name="getSurveyInfo"></a>
####`/getSurveyInfo`

Gets all information needed to present a survey to the user. Requires a survey ID, responds with all survey data.

**GET request body**:
```
{"surveyId" : 2}
```

**GET response body**:
```
{ 
  title: "A sweet survey",
  questions: [
              { 'id':12,
                'value': 'What is your favorite color?',
                'type': 'MCSR',
                'answers': [
                          {id:45, value:"blue"},
                          {id:32, value:"red"}
                         ]
              },
              { 'id':14,
                'value': 'What is your favorite food?',
                'type': 'MCSR',
                'answers: [
                          {id:21, value:"pizza"},
                          {id:18, value:"cake"},
                          {id:12, value:"brains"}
                         ]
              }
            ]
}
```

**Possible Errors**:
* `404 Not Found: Non-existent survey ID` - returned when requesting info for non-existent survey ID

=================================================================================================================
=================================================================================================================

<a name="getSurveyResults"></a>
####`/getSurveyResults`

Get the results of a survey. The returned data contains a count of the votes for each answer. Note that the answers
in the result of this call are not separated by question; it's assumed that the client already has that information
from a call to /getSurveyInfo.

**GET request body**:
```
{"surveyId": 1}
```

**GET response body** (object keys are answerIds, object values are a count of the number of votes for that answer) :
```
{
  1: 13,
  2: 21,
  3: 12
}
```

**Possible Errors**:
* `404 Not Found: Non-existent survey ID` - returned when requesting results for non-existent survey ID

=================================================================================================================
=================================================================================================================

<a name="removeQuestion"></a> 
####`/removeQuestion`

TODO

=================================================================================================================
=================================================================================================================

<a name="vote"></a> 
####`/vote`

Record a vote to the database.

**POST request body**:
```
{"questionId" : 1, "answerId" : 3} 
```

**POST response body**:
```
{"status" : "success"}
```

**Possible Errors**:
* `400 Bad Request: questionId and answerId don't match` - returned when the specified answerId isn't associated with the specified questionId.

=================================================================================================================
=================================================================================================================

