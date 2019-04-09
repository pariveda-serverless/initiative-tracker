import { Status } from '../initiatives';

export class Query {
  text: string;
  isPublic: boolean;
  status: Status;
  office: string;

  constructor({ text, status, office, isPublic }: QueryParams) {
    if (text) {
      ({ status, isPublic } = getQueryProperties(text));
    }
    this.text = text;
    this.isPublic = isPublic;
    this.status = status;
    this.office = office;
  }
}

interface QueryParams {
  text?: string;
  status?: Status;
  office?: string;
  isPublic?: boolean;
}

function getQueryProperties(text: string): { status: Status; isPublic: boolean } {
  const statuses = text
    .split(',')
    .map(arg => getStatus(arg))
    .filter(status => status !== undefined);
  const isPublics = text
    .split(',')
    .map(arg => getIsPublic(arg))
    .filter(isPublic => isPublic !== undefined);
  const status = statuses && statuses.length > 0 && statuses[0];
  const isPublic = isPublics && isPublics.length > 0 && isPublics[0];
  return { status, isPublic };
}

function getStatus(arg: string): Status {
  const text = arg
    .toUpperCase()
    .trim()
    .replace(' ', '');
  const isStatus = Object.values(Status).includes(text);
  return isStatus ? Status[text] : undefined;
}

function getIsPublic(arg: string): boolean {
  const isPublic = arg.toUpperCase().trim() === 'PUBLIC';
  return isPublic || undefined;
}
