const faker = require('faker')
const fs = require('fs')

const users = []

for (let i = 0; i < 10; i++) {
    const user = {}
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()
    user.email = faker.internet.email(firstName, lastName)
    user.password = faker.internet.password(8, true)
    user.fullName = `${firstName} ${lastName}`
    user.photoProfile = faker.internet.avatar()
    user.balance = faker.finance.amount(5e4, 5e7)
    users.push(user)
}

console.log(users)
fs.writeFileSync('../data/users.json', JSON.stringify(users, null, 2))