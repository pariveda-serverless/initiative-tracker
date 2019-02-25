const keyMappings = {
  initiativeId: 'iid',
  slackUserId: 'suid',
  action: 'a',
  status: 's',
  champion: 'c',
  remove: 'r'
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
  initiativeId?: any;
  slackUserId?: any;
  action?: any;
  status?: any;
  champion?: any;
  remove?: any;
}
