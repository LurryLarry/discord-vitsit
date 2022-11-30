require('dotenv').config();
const express = require('express');
const { Joke } = require('./database');

const { botToken } = process.env;
const { Client, GatewayIntentBits } = require('discord.js');

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Ok');
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on("ready", () => {
	console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.on("messageCreate", msg => {
  if (msg.author == client.user) return;

  if (msg.content.toLowerCase() === "!vitsi") {
    let joke;
    let author;

    Joke.find({}).then(jokes => {
      const keys = Object.keys(jokes);
      const randIndex = Math.floor(Math.random() * keys.length);
      const randKey = keys[randIndex];
      joke = jokes[randKey].joke;
      author = jokes[randKey].author || "Tuntematon";
      msg.channel.send("Melekone vitsi käyttäjältä " + author + " :joy:: \n" + joke);
    })
  }
})

client.on("messageCreate", msg => {
  if (msg.author == client.user) return;

  if (msg.content.toLowerCase().startsWith("!lisää")) {
    if (msg.content.length < 10) {
      return msg.channel.send("Liian lyhyt vitsi?!? En tallentanut :poop:");
    }

    const approvedJoke = msg.content.slice(7);

    const joke = new Joke({
      joke: approvedJoke,
      date: new Date(),
      author: msg.author.username
    })

    joke.save().then((result) => {
      console.log('Joke saved!');
    });
    msg.channel.send("Kiitos " + msg.author.username + "!" +  " Vitsi tallennettu, huhhuh :joy:. Arvosana: " + Math.floor(Math.random() * (5 - 1) + 1) + "/5 :ok_hand:");
  }
})

client.on("messageCreate", msg => {
  if (msg.author == client.user) return;

  if (msg.content === "!montako") {
    Joke.find({}).then(jokes => {
      const jokesAmount = Object.keys(jokes).length;
      msg.channel.send("Vitsejä yhteensä " + jokesAmount);
    })
  }
})

client.on("messageCreate", msg => {
  if (msg.author == client.user) return;

  if (msg.content === "sii see salmon") {
    msg.channel.send(":+1: :eyes: :fish:");
  }
})

client.login(botToken);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})