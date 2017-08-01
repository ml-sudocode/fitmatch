// copied from https://www.ibm.com/watson/developercloud/personality-insights/api/v3/?node#api_explorer

require('dotenv').config()
const username = process.env.IBMWDC_USERNAME
const password = process.env.IBMWDC_PASSWORD

// version_date options can be found here: https://www.ibm.com/watson/developercloud/doc/personality-insights/release-notes.html
const PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
const personality_insights = new PersonalityInsightsV3({
  username: username,
  password: password,
  version_date: '2017-04-10',
  headers: {
    'X-Watson-Learning-Opt-Out': 'true'
  }
});

const sampleText = [
  {content: "Half a dozen women working in the tech industry say they have faced unwanted and inappropriate advances from a well-connected Silicon Valley venture capitalist"},
  {content: "Half a dozen women working in the tech industry say they have faced unwanted and inappropriate advances from a well-connected Silicon Valley venture capitalist"},
  {content: "Half a dozen women working in the tech industry say they have faced unwanted and inappropriate advances from a well-connected Silicon Valley venture capitalist"},
  {content: "Half a dozen women working in the tech industry say they have faced unwanted and inappropriate advances from a well-connected Silicon Valley venture capitalist"},
  {content: "Half a dozen women working in the tech industry say they have faced unwanted and inappropriate advances from a well-connected Silicon Valley venture capitalist"}
]

const params = {
  // Get the content items from the JSON file.
  // content_items: require('./misc_ref/profile.json').contentItems,
  content_items: sampleText,
  consumption_preferences: true,
  raw_scores: true,
  headers: {
    'accept-language': 'en',
    'accept': 'application/json'
  }
};

personality_insights.profile(params, function(error, response) {
  if (error)
    console.log('Error:', error);
  // else
    // console.log(JSON.stringify(response, null, 2));
    // const rawResults = JSON.stringify(response, null, 2)
    // res.send(rawResults)
    const rawResults = JSON.stringify(response, null, 2)
    console.log(`These are the results: ${rawResults}`)
  }
);
