const faker = require('faker')
const fs = require('fs')

const achievements = []
// const typeChoices = ['Expense', 'Income']

for (let i = 0; i < 10; i++) {
    const achievement = {}
    const randomDate = faker.date.recent(90)
    achievement.UserId = faker.datatype.number(9)+1
    achievement.BadgeId = faker.datatype.number(4)+1
    achievement.date = randomDate.getDate()
    achievement.month = randomDate.getMonth() + 1
    achievement.year = randomDate.getFullYear()
    achievements.push(achievement)
}

console.log(achievements)
fs.writeFileSync('../data/achievements.json', JSON.stringify(achievements, null, 2))