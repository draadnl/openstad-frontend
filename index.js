const openstadCms = require('@openstad/cms');

require('dotenv').config();

var apos = openstadCms.site({
  bundles: ['@openstad/cms'],
  // See lib/modules for basic project-level configuration of our modules
  // responsible for serving static assets, managing page templates and
  // configuring user accounts.

  modules: {
    '@savvycodes/openstad-event-global-settings': {},
    '@draadnl/openstad-event-planner-widgets': {},
    '@draadnl/openstad-event-browser-widgets': {},
    '@savvycodes/openstad-event-favorites-widgets': {},
  }
});
