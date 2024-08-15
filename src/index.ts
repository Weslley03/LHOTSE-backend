import express, { Request, Response }  from "express";
import { createAudioStreamFromText } from "./services/elevenLabs/text_to_speech_file";
import cors from "cors"

const app = express()
app.use(cors())
const PORT = process.env.PORT || 3000

app.use('/text-to-speech/:text', async (req: Request, res: Response) => {
    try{
        const text: any = req.params.text
        const audioBuffer  = await createAudioStreamFromText(text)
        res.setHeader("Content-Type", "audio/mpeg");
        return res.send(audioBuffer);
    }catch(err){
        console.log('houve um erro, ' + err)
    }
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });