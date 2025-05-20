# Planet4 GPCH Optimize Plugin

> [!CAUTION]
> **This plugin is still in alpha stage and not ready for production use.**

Testing and personalization functionality for WordPress/Planet4 websites that use Mixpanel for web analytics.

## Functionality

- Set up A/B or multivariate content tests directly from the Gutenberg editor
- Split URL testing directly from the Gutenberg editor
- Weighted random targeting for content variants (e.g. 70% variant A, 30% variant B)
- Personalized content bases on:
    - URL parameters (including UTM tags)
    - localStorage and sessionStorage
- Sends experiment data either directly to the Mixpanel JavaScript SDK or to dataLayer (Tag Manager)

Measurement and evaluation of experiments is not part of this plugin.

It only works in conjunction with the [Mixpanel experiments](https://docs.mixpanel.com/docs/reports/apps/experiments) feature. Conversion events also need to be set up separately for Mixpanel.

## Documentation

- [Setup](documentation/setup.md)
- [Setting up an in-page experiment](documentation/setting-up-an-experiment.md)
- [Using split URL tests](documentation/using-split-url-tests.md)
- [Personalize content](./documentation/personalization.md)
- [Evaluating experiments in Mixpanel](documentation/evaluating-experiments-in-mixpanel.md)
- [Development](documentation/development.md)

## FAQ

### Is the plugin compatible with every WordPress website?

So far yes. Although it's developed and tested for [Planet4](https://planet4.greenpeace.org/), it can be used in any WordPress installation.

### Can the plugin be used with different web analytics software?

You may be able to use Tag Manager to set up the plugin to work with different web analytics solutions if you can make use of dataLayer event. The event contains the variables `experiment_name` and `experiment_variant`. Those could be used to build cohorts in some web analytics tools.

### I have more questions, an idea for an additional feature or something doesn't work

Please be aware that the plugin is provided as is and our time for support is limited. But please do open an issue on GitHub for any bugs, feature ideas or other requests.
