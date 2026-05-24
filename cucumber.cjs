module.exports = {
  default: {
    import: [
      './support/world.ts',
      './support/hooks.ts',
      './step-definitions/navigation.steps.ts',
      './step-definitions/home.steps.ts',
      './step-definitions/menu.steps.ts',
      './step-definitions/cart.steps.ts',
      './step-definitions/checkout.steps.ts',
      './step-definitions/auth.steps.ts',
      './step-definitions/account.steps.ts',
      './step-definitions/contact.steps.ts',
      './step-definitions/order-flow.steps.ts'
    ],
    format: [
      'progress-bar',
      'json:reports/cucumber-report.tson',
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
