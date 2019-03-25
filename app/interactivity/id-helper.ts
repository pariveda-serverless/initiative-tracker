// This is needed because Slack places a hard limit of 74 characters
// in the value field of all display elements.  In order to capture
// the relevant values for an action (ids and also action intents)
// we need to use as short of a stringified json payload as possible
const keyMappings = {
  initiativeId: 'iid',
  slackUserId: 'suid',
  action: 'a',
  status: 's',
  champion: 'c',
  remove: 'r',
  queryId: 'qid'
};

let mappings = {};
Object.entries(keyMappings).forEach(([key, short]) => {
  mappings[key] = short;
  mappings[short] = key;
});

export function stringifyValue(values: Value) {
  let payload = {};
  Object.entries(values).forEach(([key, value]) => {
    const short = mappings[key];
    payload[short] = value;
  });
  return JSON.stringify(payload);
}

export function parseValue(value: any): Value {
  const parsed = JSON.parse(value);
  let payload = {};
  Object.entries(parsed).forEach(([key, value]) => {
    const long = mappings[key];
    payload[long] = value;
  });
  return payload;
}

interface Value {
  initiativeId?: string;
  slackUserId?: string;
  action?: any;
  status?: any;
  champion?: boolean;
  remove?: boolean;
  queryId?: string;
}
