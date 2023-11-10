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
}

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
        return res.status(200).json({
            success: true,
            message: completion,
        });
    } catch (error) {
        console.log(error.message);
    }
};
export default AiSearchController;