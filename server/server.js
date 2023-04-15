import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

// console.log(process.env.OPEN_API_KEY);

const configuration = new Configuration({
    apiKey: process.env.OPEN_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from Codex',
    })
});


app.post('/', async (req, res) => {
    try {
        // data from frontend
        const prompt = req.body.prompt;


        // this is basically the specific openAI-Model, copied from openAI docs and edited
        const response = await openai.createCompletion({
            model:"text-davinci-003",
            prompt:`${prompt}`,
            temperature:0, 
            max_tokens:3000,
            top_p:1,
            frequency_penalty:0.5,
            presence_penalty:0,
            // stop:["\"\"\""]
            // temperature means how much risk
            // max_tokens = how long
            // frequency_penalty = probability of repeating same answers, higher less means less likely
            // stop is not needed in our case
        })

        res.status(200).send({
            bot: response.data.choices[0].text
        })
    }catch (error){
        console.log(error);
        res.status(500).send({ error })

    }

})

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));
