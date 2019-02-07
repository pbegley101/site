---
title: 'React Socket.io stock simulator'
date: '2019-02-04'
tags: ['JavaScript', 'React', 'Socket.io']
---

The application is a stock simulator, which mimics a real time feed being pushed to connected clients via a Websocket duplex channel. 

Websockets is an internet protocol which provides a full-duplex channel over a TCP connection.

Websockets allow both client and server send and receive data between each other over a channel in reattime, without any need to refresh the client.  It is based on an event-driven model, with client and server sending and reacting to messages.

Sockio works of node.js events, which means one can listen to a connection event, react by activiating a function, and emit an event/message over a socket.

Socket.io on the server

The server wil use Socket.io to emit a message based on a defined interval, client defined or not, and client will listen for the same message over a real-time socket.

The file server.js holds the actual server code:

```javascript
const io = require('socket.io')();

```
The above imports socket.io, instantiates it and assigns the instance to the variable io.

```javascript
io.on('connection', (client) => {
  
});


```

Now we need to manage the long running duplex channel between the server and the client.

```javascript
const port = 8000;
io.listen(port);
console.log('listening on port ', port);

```

Inform Socket.io to start listening on port 8000.

We now have access to the client sockets but are not emitting anything to them.  Let's create a server event handler to react to events being emitted by the client.

We now start a service with an interval and send a message back to the client.  Below we have the interval dictated by the client and send back the current time, the structure to handle client connection and to handle an event from the client to start a timer for that event.  We start up the timer and start emitting events/messagesback to the client containing the current time.

```javascript
client.on('subscribeToTimer', (interval) => {
    console.log('client is subscribing to timer with interval ', interval);
    setInterval(() => {
      client.emit('timer', new Date());
    }, interval);
  });
```

We have a closure which enables us to handle events from a particular client.  We handle a specific event subscribleToTimer, emiited by the client and causing a timer to start.  When the timer fires then it emits an event/message called timer back to the client.

The server.js file looks like this:

```javascript
const io = require('socket.io')();
const feed = require('./feed')

io.on('connection', (client) => {
  
  client.on('subscribeToTimer', (interval) => {
    console.log('client is subscribing to timer with interval ', interval);
    setInterval(() => {
      client.emit('timer', new Date());
    }, interval);
  });
  
const port = 8000;
io.listen(port);
console.log('listening on port ', port);

```

With the server complete, let's move onto the client.

Socket.io on the client

One needs to wire up the client socket code that'll communicate with the server socket to start the timer by emitting the subscribeToTimer event/message and to consume the Timer events/messages emitted by the server.

One creates a function, which when called will emit the message/event subscribeToTimer to the server and will feed back the results of the Timer event/message to the consuming code.

Define the function and export it:

```javascript
function subscribeToTimer(cb) {
 
}
```

This is a node style function, which the caller has the ability to pass their desired interval for the timer in the first argument, in the second argument they pass in a callback function.

Communication with the server will be done via the library socket.io-client.  First we import the library and then instantiate an instance of a socket.

```javascript
import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:8000');
```

The server waits for a client to emit a subscribeToTimer to it before starting a timer and the emit the Timer event/message to the client everytime the timer fires.

Next one subscribes to the Timer event emitted by the server and then emits a subscribeToTimer event.  Everytime a Timer event is received then the calaback function will be invoked with the result.

Responding to events in React

Import the subscribeToTimer into App.js component

```javascript
import { subscribeToTimer } from './test';
```

In the constructor call the subscribeToTimer function, everytime we receive an event we will update/set a property named timestamp defined on state using the value, which came from the server. 

Sa we are using a property called timestamp on state, it makes sense to add a default value to it.  Add the following outside and below the constructor.

```javascript
state = {
         timestamp: 'no timestamp yet'
        };
```

Next we update the render function of the App components to render the timestamp set on state by the event handler.

```javascript
	render() {
	  return (
		<div className="App">
		  <div className="App-intro">
		  This is the timer value: {this.state.timestamp}
		  </div>
		</div>
	  );
	}
```

Finally we should see in the Browser events coming in from the server and being rendered inside the React component.