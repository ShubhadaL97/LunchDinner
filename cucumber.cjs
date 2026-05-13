module.exports = {
  default: {
    import: [
      './support/world.js',
      './support/hooks.js',
      './step-definitions/navigation.steps.js',
      './step-definitions/home.steps.js',
      './step-definitions/menu.steps.js',
      './step-definitions/cart.steps.js',
      './step-definitions/checkout.steps.js',
      './step-definitions/auth.steps.js',
      './step-definitions/account.steps.js',
      './step-definitions/contact.steps.js'
    ],
    format: [
      'progress-bar',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    timeout: 40000,
    worldParameters: {
      headless: process.env.HEADED !== 'true'
    }
  }
};
