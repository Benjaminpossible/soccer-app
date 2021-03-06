const sclQF = require('../models/sclQF')

const  updateQF = async (h, hs, a, as, leg, season, callback) => {
    const data = await sclQF.findOne({ season })
    if (`${h} vs ${a}` in data.fixtures[0]) {
        switch (data.fixtures[0][`${h} vs ${a}`][leg].played) {
            case true:
                return callback({
                    feedBack: 'Match already recorded!'
                })
            case false:
                if (data.fixtures[0][`${h} vs ${a}`][leg].home === h) {
                    await sclQF.updateOne({ season }, {
                        $inc: {
                            [`fixtures.0.${h} vs ${a}.${leg}.hs`]: hs,
                            [`fixtures.0.${h} vs ${a}.${leg}.as`]: as
                        },
                        $set: {
                            [`fixtures.0.${h} vs ${a}.${leg}.played`]: true
                        }
                    })
                    } else {
                        await sclQF.updateOne({ season }, {
                            $inc: {
                                [`fixtures.0.${h} vs ${a}.${leg}.hs`]: as,
                                [`fixtures.0.${h} vs ${a}.${leg}.as`]: hs
                            },
                            $set: {
                                [`fixtures.0.${h} vs ${a}.${leg}.played`]: true
                            }
                        })
                        }
        }

    } else if (`${a} vs ${h}` in data.fixtures[0]) {
        switch (data.fixtures[0][`${a} vs ${h}`][leg].played) {
            case true:
                return callback({
                    feedBack: 'Match already recorded!'
                })
            case false:
                if (data.fixtures[0][`${a} vs ${h}`][leg].home === h) {
                    await sclQF.updateOne({ season }, {
                        $inc: {
                            [`fixtures.0.${a} vs ${h}.${leg}.hs`]: hs,
                            [`fixtures.0.${a} vs ${h}.${leg}.as`]: as
                        },
                        $set: {
                            [`fixtures.0.${a} vs ${h}.${leg}.played`]: true
                        }
                    })
                    } else {
                        await sclQF.updateOne({ season }, {
                            $inc: {
                                [`fixtures.0.${a} vs ${h}.${leg}.hs`]: as,
                                [`fixtures.0.${a} vs ${h}.${leg}.as`]: hs
                            },
                            $set: {
                                [`fixtures.0.${a} vs ${h}.${leg}.played`]: true
                            }
                        })
                    }
        }
    } else {
        return callback({
            feedBack: 'fixture does not exist!'
        })
    }

    await Qualified(season, h, a)
    callback({
        feedBack: 'Fixture Recorded!'
    })
}

const Qualified = async (season, h, a) => {
    const QF = await sclQF.findOne({ season })
    if (`${h} vs ${a}` in QF.fixtures[0]) {
    const _1stLeg = QF.fixtures[0][`${h} vs ${a}`].firstLeg.played
    const _2ndLeg = QF.fixtures[0][`${h} vs ${a}`].secondLeg.played
    if (_1stLeg && _2ndLeg) {
        const qualified = evaluateBothLeg(QF.fixtures[0][`${h} vs ${a}`])
        // if ( qualified === 'draw' ) 
        await sclQF.updateOne({ season }, {
            $set: {
                [`fixtures.0.${h} vs ${a}.qualified`]: qualified
            }
        })
    } else if (_1stLeg) {
        const qualified = evaluateLeg(QF.fixtures[0][`${h} vs ${a}`].firstLeg)
        await sclQF.updateOne({ season }, {
            $set: {
                [`fixtures.0.${h} vs ${a}.qualified`]: qualified
            }
        })
    }
    } else if (`${a} vs ${h}` in QF.fixtures[0]) {
        const _1stLeg = QF.fixtures[0][`${a} vs ${h}`].firstLeg.played
        const _2ndLeg = QF.fixtures[0][`${a} vs ${h}`].secondLeg.played
        if (_1stLeg && _2ndLeg) {
            const qualified = evaluateBothLeg(QF.fixtures[0][`${a} vs ${h}`])
            await sclQF.updateOne({ season }, {
                $set: {
                    [`fixtures.0.${a} vs ${h}.qualified`]: qualified
                }
            })
        } else if (_1stLeg) {
            const qualified = evaluateLeg(QF.fixtures[0][`${a} vs ${h}`].firstLeg)
            await sclQF.updateOne({ season }, {
                $set: {
                    [`fixtures.0.${a} vs ${h}.qualified`]: qualified
                }
            })
        }        
    }
}

const evaluateBothLeg = (data) => {
    const home = data.firstLeg.hs + data.secondLeg.as
    const away = data.firstLeg.as + data.secondLeg.hs
    if (home > away) {
         return data.firstLeg.home
    } else if (away > home) {
         return data.firstLeg.away
    } else {
        const awayAdv = data.firstLeg.as
        const homeAdv = data.secondLeg.as
        if (homeAdv > awayAdv) {
             return data.firstLeg.home
        } else if (awayAdv > homeAdv) {
             return data.firstLeg.away
        } else {
             return `draw`
        }
    }
} 
const evaluateLeg = (data) => {
    const home = data.hs 
    const away = data.as 
    if (home>away) {
        return data.home
    } else if (away>home) {
        return data.away
    } else return `draw`
}

module.exports = updateQF