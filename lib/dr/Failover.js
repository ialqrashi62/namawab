'use strict';
// Failover — promotes secondary to primary when primary is unhealthy, then
// triggers DNS update via a provided hook.

function newFailover({ replica, onPromote }) {
  let primary = true;
  function check({ primaryHealthy }) {
    if (primaryHealthy) return { promoted: false, primary };
    if (primary) {
      primary = false;
      replica.replay(replica.status().primary);
      onPromote && onPromote({ primary: false, lag: replica.lag() });
      return { promoted: true, primary: false };
    }
    return { promoted: false, primary };
  }
  function isPrimary() { return primary; }
  return { check, isPrimary, _replica: replica };
}

module.exports = { newFailover };
