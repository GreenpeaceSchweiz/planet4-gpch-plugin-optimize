# Planet4 GPCH Optimize Plugin

A/B testing and personalization functionality for Planet4 websites that use Mixpanel for web analytics.

Main functionality:
- A Gutenberg block for experiments with any number of variants. Targeting of variants by
- - Weighted random (for example show 60% of visitors variant A, 40% variant B)
- - Force showing a variant when a URL parameter is present
- - Force showing a variant depending on body classes (for personalization)
- Page settings to run split URL A/B or multivariate experiments

Evaluation of experiments is not done within this plugin. The plugin sends either a DataLayer event or an event to [Mixpanel](https://mixpanel.com/) when the experiment starts. Evaluation of experiments need to be done in Mixpanel. Conversion events also need to be set up separately.
