import { Types } from './types'
import { Colors } from './colors'

export function generateInitiativeDecisionButton(action: string, initiativeId: string ): any {
  switch(action){
    case 'CHAMPION':
      return {
        name: 'champion-button',
        text: 'Champion',
        value: `CHAMPION:${initiativeId}`,
        type: Types.BUTTON,
        style: Colors.PRIMARY
      }
    case 'JOIN':
      return {
        name: 'join-button',
        text: 'Join',
        value: `JOIN:${initiativeId}`,
        type: Types.BUTTON,
        style: Colors.DANGER
      }
    default:
      return null
  }

}