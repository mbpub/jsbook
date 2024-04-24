import * as utils from '../../common/utils.js'

export default class Evolution {

    static nextGeneration(robots) {
        if(robots.length < 1) {
            return robots
        }

        const normal = utils.normalRnd(0, 1)
        // we want to keep same number of robots
        
        // select the fittest
        // robot.distance() is used as fitness criteria
        const selection = Math.floor(robots.length * 60 / 100) + 1
        const fittest = robots.slice()
            .sort((a, b) => b.distance() - a.distance())
            .slice(0, selection)
        
        // keep the best
        const nextGen = [ fittest[0] ]

        for(let i = 1; i < fittest.length; i++) {
            const parent1 = fittest[i]
            const parent2 =
                fittest[utils.uniformRndInt(0, fittest.length)]
            
            // create offspring
            let offspring = parent1.clone()
            if(parent1.id != parent2.id) {
                // mate = swap weights 
                const weights1 = offspring.nn.weights
                const weights2 = parent2.nn.weights
                for(let l = 0; l < weights1.length; l++) {
                    const lw1 = weights1[l]
                    const lw2 = weights2[l]
                    for(let i = 0; i < lw1.length; i++) {
                        for(let j = 0; j < lw1[0].length; j++) {
                            const r = Math.random()
                            // from parent2 50% of cases
                            if(r > 0.5) {
                                lw1[i][j] = lw2[i][j]
                            }
                        }
                    }
                }
            }

            nextGen.push(offspring)
            if(nextGen.length === robots.length) {
                break
            }
            
            // mutate, copy
            offspring = offspring.clone()
            const weights = offspring.nn.weights
            for(let l = 0; l < weights.length; l++) {
                const lw = weights[l]
                for(let i = 0; i < lw.length; i++) {
                    for(let j = 0; j < lw[0].length; j++) {
                        const r = Math.random()
                        if(r > 0.98) {
                            lw[i][j] = normal()
                        }
                    }
                }
            }

            nextGen.push(offspring)
            if(nextGen.length === robots.length) {
                break
            }
        }

        // give a new id to new robots for this round
        const result = nextGen
            .map((_, idx) => { _.id = idx; return _ })
        return result
    }
}