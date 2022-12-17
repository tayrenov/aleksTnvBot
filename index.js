const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options.js');

const token = '';

const bot = new TelegramApi(token, {polling:true});

let chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю число от 0 до 9, а ты должен её угадать!');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    console.log(randomNumber);
    await bot.sendMessage(chatId,'Отгадывай!', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Инфо'},
        {command: '/game', description: 'Игра'}
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
            return bot.sendMessage(chatId,'Добро пожаловать');
        }
        if (text === '/info') {
            return bot.sendMessage(chatId,'Инфо');
        }
        if (text === '/game') {
            return startGame(chatId);
        }
    
        return bot.sendMessage(chatId, 'Я тебя не понимаю');
    
        console.log(msg);
    });

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/game') {
            return startGame(chatId);
        }
        if (data == chats[chatId]) {
            return await bot.sendMessage(chatId, `Вы угадали, это число ${data}`, againGameOptions);
        } else {
            return  bot.sendMessage(chatId, `Вы не угадали, это число ${chats[chatId]}`, againGameOptions);
        }
    })
}


start();


