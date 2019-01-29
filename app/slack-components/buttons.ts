import {Types} from './types'
import {Colors} from './colors'

export function generateInitiativeDecisionButton(action: string, initiativeId: string ): any {
  switch(action){
    case 'CHAMPION':
      return {
        name: 'champion-button',
        text: 'Champion',
        value: `CHAMPION:${initiativeId}`,
        type: Types.BUTTON,
        style: Colors.GOOD
      }
    case 'JOIN':
      return {
        name: 'join-button',
        text: 'Join',
        value: `JOIN:${initiativeId}`,
        type: Types.BUTTON,
        style: Colors.GOLD
      }
    default:
      return null
  }

}