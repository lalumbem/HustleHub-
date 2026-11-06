const logger = {
    log(level, message, metadata = {}) {
        const event = {
            time: new Date().toISOString(),
            level,
            service: 'hustlehub-backend',
            message,
            ...metadata
        };

        // Keep logs visible in the local Docker/application console.
        console.log(JSON.stringify(event));

        const token = process.env.AXIOM_TOKEN;
        const dataset = process.env.AXIOM_DATASET;
        const edge = process.env.AXIOM_EDGE;

        if (!token || !dataset || !edge) return;

        fetch(`https://${edge}/v1/ingest/${dataset}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([event])
        }).catch(error => {
            console.error('Axiom log delivery failed:', error.message);
        });
    },

    info(message, metadata) {
        this.log('info', message, metadata);
    },

    warn(message, metadata) {
        this.log('warn', message, metadata);
    },

    error(message, metadata) {
        this.log('error', message, metadata);
    }
};

module.exports = logger;