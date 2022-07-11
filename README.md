#### Setting up a listener for continuous Reaction listening:
```js
new ReactionHandler.continuousReactionStream(interaction, filter, permanent, options);
```
- **Eris.Interaction** `interaction` - *An Eris interaction emitted from the `interactionCreate` event.*
- **Function** `filter` - *A filter function which is passed a **userID** as a Discord Snowflake.*
- **Boolean** `permanent` - *Whether or not the listener should stay attached or be automatically removed after use.*
- **Object** `options` - *An object containing following options:*
    - **Number** `options.maxMatches` - *The maximum amount of reactions to collect.*
    - **Number** `options.time` - *The maximum amount of time the collector should run for in milliseconds.*

In addition to that a temporary listener needs to be attached to listen for the `reacted` event:
```js
.on('reacted', eventListener);
```
- **String** `'reacted'` - *The event name. This **MUST** stay the same!*
- **Function** `eventListener` - *The event listener which is passed an event object.*
    - **Object** `eventObject` - *The object emitted from the `reacted` event*.
        - **Eris.Interaction | Object** `eventObject.int` - The message/interaction on which the user reacted.
        - **Object** `eventObject.button` - *The custom_id of the component*
        - **String** `eventObject.userID` - *The user ID of the user who has reacted (as a Discord Snowflake).*

# Examples
#### Continuously listening for reactions:
```js
const ReactionHandler = require('eris-reactions');

// This will continuously listen for 100 incoming reactions over the course of 15 minutes
const reactionListener = new ReactionHandler.continuousReactionStream(
    interaction, 
    (userID) => userID === interaction.member.id, 
    false, 
    { maxMatches: 100, time: 900000 }
);

reactionListener.on('reacted', (event) => {
    interaction.createMessage('You reacted with: ' + event.button);
});
```
# License
This repository makes use of the [MIT License](https://opensource.org/licenses/MIT) and all of its correlating traits.

While it isn't mandatory, a small credit if this repository was to be reused would be highly appreciated!
