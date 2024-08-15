import request from 'supertest';
import express, { Request, Response } from 'express';
import { createAudioStreamFromText } from '../services/elevenLabs/text_to_speech_file';
import { describe } from 'node:test';
import { buffer } from 'stream/consumers';
import { get } from 'node:http';

const app = express();

jest.mock('../services/elevenLabs/text_to_speech_file', () => ({
    createAudioStreamFromText: jest.fn(),
}));

app.use('/text-to-speech/:text', async (req: Request, res: Response) => {
    try{
        const text = req.params.text;
        const audioBuffer = await createAudioStreamFromText(text);
        res.setHeader('Content-Type', 'audio/mpeg');
        return res.send(audioBuffer);
    }catch(err){
        console.error('houve um erro na req de /text-to-speech/:text ' + err);
        res.status(500).send('Internal Server Error');
    } 
})

describe('GET /text-to-speech/:text', () => {
    it('should return audio buffer with content-type audio/mpeg', async () =>{
        const mockAudioBuffer = Buffer.from('dummy audio data'); //cria o mock (fake) do audio transcrito 
        (createAudioStreamFromText as jest.Mock).mockResolvedValue(mockAudioBuffer);

        const response = await request(app).get('/text-to-speech/hello');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('audio/mpeg');
        expect(response.body).toEqual(mockAudioBuffer);

    })

    it('should return a error', async ()=> {
        (createAudioStreamFromText as jest.Mock).mockRejectedValue(new Error('something went wrong'))
        const response = await request(app).get('/text-to-speech/hello')

        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error')
    })
})