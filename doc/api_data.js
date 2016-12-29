define({ "api": [
  {
    "type": "get",
    "url": "/",
    "title": "Flagz Root",
    "name": "Root",
    "description": "<p>The rocking flagz api</p>",
    "group": "API",
    "version": "0.0.0",
    "filename": "src/router/index.js",
    "groupTitle": "API"
  },
  {
    "type": "get",
    "url": "/",
    "title": "Api Root",
    "name": "Root",
    "group": "API",
    "permission": [
      {
        "name": "Authentified"
      }
    ],
    "version": "0.0.0",
    "filename": "src/router/routes/api.js",
    "groupTitle": "API"
  },
  {
    "type": "get",
    "url": "/gen",
    "title": "Request Instance information",
    "name": "Generation",
    "group": "Info",
    "sampleRequest": [
      {
        "url": "/"
      }
    ],
    "version": "0.0.0",
    "filename": "src/router/routes/info.js",
    "groupTitle": "Info"
  },
  {
    "type": "get",
    "url": "/",
    "title": "Infos root",
    "name": "Info",
    "group": "Info",
    "sampleRequest": [
      {
        "url": "/"
      }
    ],
    "version": "0.0.0",
    "filename": "src/router/routes/info.js",
    "groupTitle": "Info"
  },
  {
    "type": "get",
    "url": "/poll",
    "title": "Request Poll information",
    "name": "Poll",
    "group": "Info",
    "sampleRequest": [
      {
        "url": "/"
      }
    ],
    "version": "0.0.0",
    "filename": "src/router/routes/info.js",
    "groupTitle": "Info"
  },
  {
    "type": "get",
    "url": "/api/messages",
    "title": "Show all",
    "description": "<p>Shows all messages</p>",
    "name": "Message",
    "group": "Message",
    "permission": [
      {
        "name": "Authentified"
      }
    ],
    "version": "0.0.0",
    "filename": "src/router/routes/messages.js",
    "groupTitle": "Message"
  },
  {
    "type": "post",
    "url": "/api/messages",
    "title": "Create",
    "description": "<p>create a message</p>",
    "name": "Message_creation",
    "group": "Message",
    "permission": [
      {
        "name": "Authentified"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>text</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "location",
            "description": "<p>position of the message. ex : @48.7861405,2.3274749</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "orientation",
            "description": "<p>of the phone</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "restricted",
            "defaultValue": "false",
            "description": "<p>true|false if true, the message is visible only by the author's friends</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "orientation not yet fully thinked",
          "content": "{\n    x: 2,\n    y: 3,\n    z: 4\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/router/routes/messages.js",
    "groupTitle": "Message"
  },
  {
    "type": "get",
    "url": "/api/messages/@:center&r=:r",
    "title": "Aggregate within sphere",
    "description": "<p>Shows all messages within a circular range</p>",
    "name": "Message_search",
    "group": "Message",
    "permission": [
      {
        "name": "Authentified"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "center",
            "description": "<p>position of the center the circular range. ex : @48.7861405,2.3274749</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "r",
            "defaultValue": "200",
            "description": "<p>range of the circular range in meters</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/router/routes/messages.js",
    "groupTitle": "Message"
  },
  {
    "type": "get",
    "url": "/api/messages/me",
    "title": "Show my messages",
    "description": "<p>Shows all messages of connected user</p>",
    "name": "Message_user",
    "group": "Message",
    "permission": [
      {
        "name": "Authentified"
      }
    ],
    "version": "0.0.0",
    "filename": "src/router/routes/messages.js",
    "groupTitle": "Message"
  },
  {
    "type": "get",
    "url": "/health",
    "title": "Request Instance health",
    "description": "<p>Required by openshift to ensure the server is running</p>",
    "name": "Health",
    "group": "Openshift",
    "version": "0.0.0",
    "filename": "src/router/index.js",
    "groupTitle": "Openshift"
  },
  {
    "type": "post",
    "url": "/api/signin",
    "title": "Sign in",
    "description": "<p>Log in</p>",
    "name": "Login",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "name",
            "description": "<p>The user name</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "password",
            "description": "<p>The password</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>to use for further authentication, expires in 10 hours</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/router/routes/auth.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/api/signup",
    "title": "Sign up",
    "description": "<p>Create an account</p>",
    "name": "Signup",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "name",
            "description": "<p>The user name</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "password",
            "description": "<p>The password : bcrypt hashed</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/router/routes/auth.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/api/users/:id",
    "title": "show user",
    "description": "<p>Shows one user</p>",
    "name": "User",
    "group": "User",
    "permission": [
      {
        "name": "Authentified"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "user",
            "description": "<p>to modify</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/router/routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "patch",
    "url": "/api/users/friends",
    "title": "update friend list",
    "description": "<p>Add or remove a friend to the current user</p>",
    "name": "UserPatch_update_friend",
    "group": "User",
    "permission": [
      {
        "name": "Authentified"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "user",
            "description": "<p>to modify</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "user to operate:",
          "content": "{\n   \"op\": \"insert | delete\"\n   \"id\": \"userId\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/router/routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/api/users",
    "title": "show users",
    "description": "<p>Shows all users</p>",
    "name": "Users",
    "group": "User",
    "permission": [
      {
        "name": "Authentified"
      }
    ],
    "version": "0.0.0",
    "filename": "src/router/routes/users.js",
    "groupTitle": "User"
  }
] });
