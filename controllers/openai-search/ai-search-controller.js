// configure dotenv
import { config as configDotenv } from 'dotenv';
configDotenv();

// import modules from OpenAI library
import OpenAI from "openai";
const key = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
    apiKey: key // defaults to process.env["OPENAI_API_KEY"]
});
const AiSearchController = (app) => {
    app.post("/api/ai-search", aiSearch)
    app.post("/api/ai-search/chat", aiSearchConversation)
}
const prompt = `Your job is to help users find a movie to watch. They may ask for recommendations based on a certain genre or they may need your help remembering the name of a movie they are thinking of and will provide you with some details they remember from the movie. When you return movie suggestions, please wrap them in quotations followed by the year that the movie came out. Do not recommend more than 20 movies in any given response. If they're simply trying to uncover the name of one particular movie they are trying to remember, no need to provide additional suggestions.`;

// POST request endpoint
const aiSearch =  async (req, res) => {
    // getting prompt question from request
    console.log('called aiSearch function')
    console.log('req body is ',req.body);
    const prompt = req.body.prompt;
    try {
        if (prompt == null) {
            throw new Error("Uh oh, no prompt was provided");
        }
        // return the result
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{"role": "system", "content": "Your job is to help this user find the name of the movie they are thinking of. They are about to give you some details they remember."},
                        {"role": "user", "content": prompt}],
        });
        console.log(response);
        const completion = response.choices[0].message.content;
        console.log(response.choices[0].message);
        return res.status(200).json({
            success: true,
            message: completion,
        });
    } catch (error) {
        console.log(error.message);
    }
};


const aiSearchConversation =  async (req, res) => {
    // getting prompt question from request
    try {
        if (req.body == null) {
            throw new Error("Uh oh, no prompt was provided");
        }
        // grab conversation history from post req
        const conversation = req.body.conversation;
        const basePrompt = [{"role": "system", "content": prompt}]
        const combined = [...basePrompt, ...conversation];

        // return the result
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-16k-0613',
            messages: combined,
        });

        const completion = response.choices[0].message.content;
        console.log(response.choices[0].message);
        return res.status(200).json({
            success: true,
            message: completion,
        });
    } catch (error) {
        console.log(error.message);
    }
};
export default AiSearchController;