const faker = require('faker')
const fs = require('fs')

const badges = []
// const typeChoices = ['Expense', 'Income']

for (let i = 0; i < 10; i++) {
    const badge = {}
    badge.name = faker.lorem.sentence(2)
    badge.description = faker.lorem.sentence(3)
    badge.imgUrl = faker.image.imageUrl(300,300,null,true)
    badges.push(badge)
}

console.log(badges)
fs.writeFileSync('../data/badges.json', JSON.stringify(badges, null, 2))