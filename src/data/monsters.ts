export const monsters = [
    {
        id: 1,
        name: 'Goblin',
        sprite: 'goblin',
        stats: {
            hp: 10,
            mp: 0,
            atk: 5,
            def: 0,
            spd: 5,
            exp: 10
        },
        skills: [
            {
                id: 1,
                name: 'Attack',
                description: 'Attack the enemy with your equipped weapon.',
                type: 'physical',
                power: 1,
                cost: 0
            }
        ]
    },
]