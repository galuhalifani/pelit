const faker = require('faker')
const fs = require('fs')

const targets = []

for (let i = 0; i < 10; i++) {
    const target = {}
    target.UserId = faker.datatype.number(9)+1
    target.startDate = faker.date.recent()
    const startDate = new Date(target.startDate.toString())
    const endDate = startDate.setMonth(startDate.getMonth() + 1)
    target.endDate = new Date(endDate)
    target.monthlyTarget = faker.finance.amount(5e3, 5e6)
    target.isActive = faker.datatype.boolean()
    targets.push(target)
}

console.log(targets)
fs.writeFileSync('../data/targets.json', JSON.stringify(targets, null, 2))