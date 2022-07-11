'use strict';

const EventEmitter = require('events').EventEmitter;

/**
 * An extremely simple and pretty straight forward component collector for Eris
 */
class ButtonHandler extends EventEmitter {
    constructor(interaction, filter, permanent = false, options = {}) {
        super();

        this.client         = (interaction.channel.guild) ? interaction.channel.guild.shard.client : interaction.channel.client;
        this.filter         = filter;
        this.interaction    = interaction;
        this.options        = options;
        this.permanent      = permanent;
        this.ended          = false;
        this.collected      = [];
        this.listener       = (int) => this.checkPreConditions(int, int.data.custom_id, int.member?.id || int.user.id);

        this.client.on('interactionCreate', this.listener);

        if (options.time) {
            setTimeout(() => this.stopListening('time'), options.time);
        }
    }

    /**
     * Verify a button for its validity with provided filters
     * @param {object} int The interaction object 
     * @param {object} button The component object containing its custom_id
     * @param {string} userID The user ID of the user who's reacted 
     */
    async checkPreConditions(int, button, userID) {
        if (this.interaction.id !== int.message.id) {
            return false;
        }
        await int.acknowledge();

        if (this.filter(userID)) {
            this.collected.push({ int, button, userID });
            this.emit('reacted', { int, button, userID });

            if (this.collected.length >= this.options.maxMatches) {
                this.stopListening('maxMatches');
                return true;
            }
        }

        return false;
    }

    /**
     * Stops collecting buttons and removes the listener from the client
     * @param {string} reason The reason for stopping
     */
    stopListening (reason) {
        if (this.ended) {
            return;
        }

        this.ended = true;

        if (!this.permanent) {
            this.client.removeListener('interactionCreate', this.listener);
        }
        
        this.emit('end', this.collected, reason);
    }
}

module.exports = {
    continuousReactionStream: ButtonHandler,
    collectReactions: (interaction, filter, options) => {
        const bulkCollector = new ButtonHandler(interaction, filter, false, options);

        return new Promise((resolve) => {
            bulkCollector.on('end', resolve);
        });
    }
};
