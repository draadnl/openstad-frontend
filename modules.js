module.exports.default = {
  bundles: ['@openstad/cms'],
    // See lib/modules for basic project-level configuration of our modules
    // responsible for serving static assets, managing page templates and
    // configuring user accounts.

    modules: {
      '@savvycodes/openstad-event-global-settings': {},
      '@savvycodes/openstad-event-planner-widgets': {},
      '@savvycodes/openstad-event-browser-widgets': {},
      '@savvycodes/openstad-event-favorites-widgets': {},
    }
}
