const faker = require('faker')
const fs = require('fs')

const transactions = []
const typeChoices = ['Expense', 'Income']
const expenseChoices = ['Housing', 'Transportation', 'Food & Beverage', 'Utilities', 'Insurance', 'Medical & Healthcare', 'Saving, Investing, & Debt Payments', 'Personal Spending', 'Other Expense']
const incomeChoices = ['Salary', 'Wages', 'Commission', 'Interest', 'Investments', 'Gifts', 'Allowance', 'Other Income']

for (let i = 0; i < 10; i++) {
    const transaction = {}
    transaction.UserId = faker.datatype.number(9) + 1
    transaction.title = `Record title no. ${i}`
    transaction.type = typeChoices[Math.floor(Math.random() * typeChoices.length)]
    transaction.amount = faker.finance.amount(5e3, 1e6)
    transaction.fullDate = faker.date.soon(5)
    transaction.date = transaction.fullDate.getDate()
    transaction.month = transaction.fullDate.getMonth() + 1
    transaction.year = transaction.fullDate.getFullYear()
    transaction.receiptImage = 'https://image.freepik.com/free-vector/realistic-receipt-template_23-2147938550.jpg'
    transaction.category = transaction.type === 'Expense' ? expenseChoices[Math.floor(Math.random() * expenseChoices.length)] : incomeChoices[Math.floor(Math.random() * incomeChoices.length)]
    transaction.note = faker.lorem.sentences(3)
    transactions.push(transaction)
}

console.log(transactions)
fs.writeFileSync('../data/transactions.json', JSON.stringify(transactions, null, 2))