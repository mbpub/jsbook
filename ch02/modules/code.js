import * as myUtils from '../../common/utils.js'
import { lerp, clamp as myClamp } from '../../common/utils.js'

// 0.5
console.log('norm', myUtils.norm(2, 1, 3))
// 5
console.log('lerp', lerp(0.5, 4, 6))
// 3
console.log('clamp', myClamp(5, 1, 3))
