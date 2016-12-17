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
    "url": "/poll",
    "title": "Request Poll information",
    "name": "Poll",
    "group": "Info",
    "version": "0.0.0",
    "filename": "src/router/routes/info.js",
    "groupTitle": "Info"
  },
  {
    "type": "get",
    "url": "/messages",
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
    "filename": "src/router/routes/api.js",
    "groupTitle": "Message"
  },
  {
    "type": "post",
    "url": "/message",
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
            "field": "center",
            "description": "<p>position of the center the circular range. ex : @48.7861405,2.3274749</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "r",
            "description": "<p>range of the circular range</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/router/routes/api.js",
    "groupTitle": "Message"
  },
  {
    "type": "get",
    "url": "/messages/@:center&r=:r",
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
            "optional": false,
            "field": "r",
            "description": "<p>range of the circular range</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/router/routes/api.js",
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
    "type": "get",
    "url": "/users",
    "title": "",
    "description": "<p>Shows all users</p>",
    "name": "Health",
    "group": "User",
    "permission": [
      {
        "name": "Authentified"
      }
    ],
    "version": "0.0.0",
    "filename": "src/router/routes/api.js",
    "groupTitle": "User"
  }
] });
