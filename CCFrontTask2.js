var runicTable = [
    {
        rune: 'El',
        power: 28,
        excludes: 'Ort'
    },
    {
        rune: 'Eld',
        power: 33,
        excludes: 'Sur'
    },
    {
        rune: 'Tir',
        power: 9,
        excludes: 'Eth'
    },
    {
        rune: 'Nef',
        power: 7,
        excludes: 'Ist'
    },
    {
        rune: 'Eth',
        power: 31,
        excludes: 'Tir'
    },
    {
        rune: 'Ith',
        power: 22,
        excludes: 'Pul'
    },
    {
        rune: 'Tal',
        power: 8,
        excludes: 'Io'
    },
    {
        rune: 'Ral',
        power: 25,
        excludes: 'Um'
    },
    {
        rune: 'Ort',
        power: 18,
        excludes: 'El'
    },
    {
        rune: 'Thul',
        power: 13,
        excludes: 'Sol'
    },
    {
        rune: 'Amn',
        power: 6,
        excludes: 'Fal'
    },
    {
        rune: 'Sol',
        power: 10,
        excludes: 'Thul'
    },
    {
        rune: 'Shael',
        power: 17,
        excludes: 'Lem'
    },
    {
        rune: 'Dol',
        power: 11,
        excludes: 'Hel'
    },
    {
        rune: 'Hel',
        power: 12,
        excludes: 'Dol'
    },
    {
        rune: 'Io',
        power: 20,
        excludes: 'Tal'
    },
    {
        rune: 'Lum',
        power:32,
        excludes: 'Gul'
    },
    {
        rune: 'Ko',
        power: 27,
        excludes: 'Mal'
    },
    {
        rune: 'Fal',
        power: 14,
        excludes: 'Amn'
    },
    {
        rune: 'Lem',
        power: 26,
        excludes: 'Shall'
    },
    {
        rune: 'Pul',
        power: 15,
        excludes: 'Ith'
    },
    {
        rune: 'Um',
        power: 16,
        excludes: 'Ral'
    },
    {
        rune: 'Mal',
        power: 21,
        excludes: 'Ko'
    },
    {
        rune: 'Ist',
        power: 4,
        excludes: 'Nef'
    },
    {
        rune: 'Gul',
        power: 23,
        excludes: 'Lum'
    },
    {
        rune: 'Vex',
        power: 24,
        excludes: 'Ohm'
    },
    {
        rune: 'Ohm',
        power: 1,
        excludes: 'Vex'
    },
    {
        rune: 'Lo',
        power: 2,
        excludes: 'Cham'
    },{
        rune: 'Sur',
        power: 30,
        excludes: 'Eld'
    },{
        rune: 'Ber',
        power: 3,
        excludes: null
    },{
        rune: 'Jah',
        power: 5,
        excludes: 'Zod'
    },{
        rune: 'Cham',
        power: 29,
        excludes: 'Lo'
    },{
        rune: 'Zod',
        power: 19,
        excludes: 'Jah'
    }
]
.sort(sortByPower);

/**
 * Sorts by power property.
 * @param {Object} a 
 * @param {Object} b 
 * @return {number}
 */
function sortByPower(a, b) {
    return b.power - a.power;
}

var powerLookup = runicTable.reduce(function(lookup, item) {
    lookup[item.rune] = {
        power: item.power,
        excludes: item.excludes
    };

    return lookup;
}, {});

/**
 * Calculates runic word power.
 * @param {string} runicWord
 * @return {number} 
 */
function checkRunicWord(runicWord) {
    if (typeof runicWord !== 'string') {
        throw new Error('Runic word should be string');
    }

    if (!runicWord.length) {
        throw new Error('Runic word should not be empty');
    }

    var runeList = runicWord.split('-');
    var powers = runeList.reduce(function(summ, rune) {
        if (!rune in powerLookup) {
            throw new Error('Rune called' + rune + 'does not exist');
        }

        if (runeList.indexOf(powerLookup[rune].excludes) !== -1) {
            throw new Error('Runic word should not contain incompatable runes');
        }

        if (runeList.indexOf(rune) !== runeList.lastIndexOf(rune)) {
            throw new Error('Runes should not duplicate');
        }
        
        return summ + powerLookup[rune].power;
    }, 0);

    return powers - runeList.length;
};

exports.checkRunicWord = checkRunicWord;

/**
 * Generates up to 10 runic words of giver length.
 * @param {number} length 
 * @retrun {Array}
 */
function generateRunicWords(length) {
    if (isNaN(length) || !isFinite(length) || length <= 0) {
        throw new Error('Length should be a number greater then zero');
    }

    if (length === 1) {
        return runicTable.slice(0, 10).map(function(item) {
            return {
                word: item.rune,
                power: item.power
            };
        });
    }

    var runicWords = [];

    for (var i = 0; i < runicTable.length; i++) {
        var runes = [runicTable[i].rune];
        var pointer = i + 1;

        for (var j = pointer; j < runicTable.length - pointer; j++) {
            if (runes.indexOf(runicTable[j].excludes) === -1) {
                runes.push(runicTable[j].rune);
            }

            if (runes.length === length) {
                var word = runes.join('-');
    
                runicWords.push({
                    word: word,
                    power: checkRunicWord(word)
                });

                runes.pop();
            }
        }
    }

    if (!runicWords.length) {
        return 'Not possible to create runic word of given length';
    }

    runicWords = runicWords.slice(0, 10).sort(sortByPower);

    return runicWords; 
}

exports.generateRunicWords = generateRunicWords;
