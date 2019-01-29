import { Types } from './types'
import { Colors } from './colors'

export function generateField(title: string, value: string, short?: boolean): any {
  return { title, value, short}
}