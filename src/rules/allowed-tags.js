/**
* @module rules/allowed-tags
**/
const _ = require('lodash');

/** The name of the rule
* @member {string} name
**/
const name = 'allowed-tags';

/** The avalable configurations of the rule
* @member {Object} availableConfigs
**/
const availableConfigs = {
  'tags': []
};

/**
@function run
@description Runs the rule's logic against the provide feature file/object
@alias module:run
@param feature       {Gerkin.Feature} - A Gerkin.Feature object
@param unused        {}               - Unused parameter, exists to conform to the rule run method signature
@param configuration {Object}         - The rule configuration whose format should match `availableConfigs`
@returns             {Array}          - The detected errors
**/
function run(feature, unused, configuration) {
  if (!feature) {
    return [];
  }

  let errors = [];
  const allowedTags = configuration.tags;

  checkTags(feature, allowedTags, errors);

  feature.children.forEach(child => {
    if (child.scenario) {
      checkTags(child.scenario, allowedTags, errors);

      if (child.scenario.examples) {
        child.scenario.examples.forEach(example => {
          checkTags(example, allowedTags, errors);
        });
      }
    }      
  });

  return errors;
}

/**
@function checkTags
@private
@param feature        {Gerkin.Feature} - A node that represents the feature or a scenario (the only types of nodes that have tags)
@param allowedTags    {Array}          - An array of allowedTags
@param errors         {Array}          - A reference to the rule's errors array that gets filled as errors get detected
**/
function checkTags(node, allowedTags, errors) {
  return node.tags
    .filter(tag => !_.includes(allowedTags, tag.name))
    .forEach(tag => {
      errors.push({
        message: 'Not allowed tag ' + tag.name + ' on ' + node.keyword,
        rule   : name,
        line   : tag.location.line
      });
    });
}


module.exports = {
  name,
  run,
  availableConfigs
};
