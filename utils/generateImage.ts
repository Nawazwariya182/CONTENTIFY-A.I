// utils/generateImage.ts

const API_KEY = process.env.NEXT_PUBLIC_AIXPLAIN_API_KEY_2 || '';
const MODEL_ID = '663bc4f76eb5637aa56d6d31';

export async function generateImage(prompt: string, size: string): Promise<string | null> {
  try {
    const response = await fetch(`https://models.aixplain.com/api/v1/execute/${MODEL_ID}`, {
      method: 'POST',
      body: JSON.stringify({ data: prompt, size: size }),
      headers: {
        'x-api-key': API_KEY,
        'content-type': 'application/json'
      }
    });

    const results = await response.json();
    const urlToPoll = results.data;

    return new Promise((resolve, reject) => {
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(urlToPoll, {
            method: 'GET',
            headers: {
              'x-api-key': API_KEY,
              'content-type': 'application/json'
            }
          });
          const results = await statusResponse.json();
          if (results.completed) {
            clearInterval(pollInterval);
            resolve(results.data);
          }
        } catch (error) {
          clearInterval(pollInterval);
          reject(error);
        }
      }, 5000);
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}