const fs = require('fs')
const path = require('path')

const { EnumPaymentSystem, EnumTransactionType, PrismaClient } = require('@prisma/client')
const { hash } = require('argon2')

function loadEnvFile() {
	const envPath = path.resolve(__dirname, '../.env')
	const envContent = fs.readFileSync(envPath, 'utf8')

	for (const rawLine of envContent.split('\n')) {
		const line = rawLine.trim()
		if (!line || line.startsWith('#')) continue

		const separatorIndex = line.indexOf('=')
		if (separatorIndex === -1) continue

		const key = line.slice(0, separatorIndex).trim()
		let value = line.slice(separatorIndex + 1).trim()

		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1)
		}

		if (!process.env[key]) {
			process.env[key] = value
		}
	}
}

loadEnvFile()

const prisma = new PrismaClient()

const users = [
	{
		email: 'demo@example.com',
		password: '123456',
		name: 'Demo User',
		avatarPath: '/uploads/default-avatar.png',
		card: {
			number: '4615403810381693',
			expireDate: '10/27',
			cvc: 318,
			paymentSystem: EnumPaymentSystem.VISA,
			balance: 157600
		},
		transactions: [
			{ amount: 150000, type: EnumTransactionType.TOP_UP },
			{ amount: 50000, type: EnumTransactionType.TOP_UP },
			{ amount: 15000, type: EnumTransactionType.WITHDRAWAL },
			{ amount: 7400, type: EnumTransactionType.WITHDRAWAL },
			{ amount: 20000, type: EnumTransactionType.WITHDRAWAL }
		]
	},
	{
		email: 'anna@example.com',
		password: '123456',
		name: 'Anna Petrova',
		avatarPath: '/uploads/default-avatar.png',
		card: {
			number: '2204123412341234',
			expireDate: '08/28',
			cvc: 512,
			paymentSystem: EnumPaymentSystem.MIR,
			balance: 92600
		},
		transactions: [
			{ amount: 100000, type: EnumTransactionType.TOP_UP },
			{ amount: 7400, type: EnumTransactionType.WITHDRAWAL }
		]
	},
	{
		email: 'sergey@example.com',
		password: '123456',
		name: 'Sergey Ivanov',
		avatarPath: '/uploads/default-avatar.png',
		card: {
			number: '5469380012345678',
			expireDate: '01/29',
			cvc: 901,
			paymentSystem: EnumPaymentSystem.MASTERCARD,
			balance: 235000
		},
		transactions: [
			{ amount: 250000, type: EnumTransactionType.TOP_UP },
			{ amount: 15000, type: EnumTransactionType.WITHDRAWAL }
		]
	}
]

async function upsertUser(userData) {
	const password = await hash(userData.password)

	const user = await prisma.user.upsert({
		where: { email: userData.email },
		update: {
			name: userData.name,
			password,
			avatarPath: userData.avatarPath
		},
		create: {
			email: userData.email,
			name: userData.name,
			password,
			avatarPath: userData.avatarPath
		}
	})

	const card = await prisma.card.upsert({
		where: { userId: user.id },
		update: userData.card,
		create: {
			...userData.card,
			user: {
				connect: { id: user.id }
			}
		}
	})

	await prisma.transaction.deleteMany({
		where: { cardId: card.id }
	})

	if (userData.transactions.length) {
		await prisma.transaction.createMany({
			data: userData.transactions.map(transaction => ({
				...transaction,
				cardId: card.id
			}))
		})
	}
}

async function main() {
	for (const user of users) {
		await upsertUser(user)
	}

	console.log('Seed completed. Demo account: demo@example.com / 123456')
}

main()
	.catch(error => {
		console.error(error)
		process.exitCode = 1
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
