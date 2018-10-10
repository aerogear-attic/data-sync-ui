
const { sequelize } = require("../gql/models");

exports.runHealthChecks = function () {
    function databaseConnectivityCheck() {
        return sequelize.authenticate();
    }

    /**
     * Summarize the results of all checks in to a report of the form of:
     * {
     *   ok: <overall status>,
     *   checks: [
     *     {check1: <check1 status>},
     *     {check2: <check2 status>}
     *   ]
     * }
     * @param results
     * @returns {{ok: boolean, checks: *}}
     */
    function summarize(results) {
        const overallStatus = {
            ok: false,
            checks: results
        };

        overallStatus.ok = results.reduce((outer, result) => {
            const pass = outer && Object.values(result).reduce((inner, val) => {
                const innerPass = inner && val;
                return innerPass;
            }, true);
            return pass;
        }, true);

        return overallStatus;
    }

    function handleResolve({ label, promise }) {
        return { label, promise: promise.then(() => ({ [label]: true })) };
    }

    function handleReject({ label, promise }) {
        return promise.catch(err => {
            console.error(err);
            return { [label]: false };
        });
    }

    /**
     * Runs all health checks defined in `checks` and returns an array
     * with the results in the form of:
     * [
     *   {check1: <check1 status>},
     *   {check2: <check2 status>}
     * ]
     */
    function run() {
        // Add additional health checks to this array
        const checks = [{
            label: "Database Connectivity",
            promise: databaseConnectivityCheck()
        }].map(handleResolve).map(handleReject);

        return Promise.all(checks);
    }

    return run().then(summarize);
};
