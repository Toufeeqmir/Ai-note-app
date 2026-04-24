const API_KEY = import.meta.env.VITE_GROK_API_KEY;
// console.log("Api Key", API_KEY);
const API_URL = "https://api.x.ai/v1/chat/completions";

const callGrok = async (prompt) => {
     const response = await fetch (API_URL, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`,
         },
         body: JSON.stringify({
            model: "grok-4.20",
            max_tokens: 1000,
            messages: [{ role: "user", content: prompt}],
         }),
     });

     if(!response.ok){
        const errorData = await response.json();
        console.log("Error details:", errorData);
        throw new Error(`API Error: ${response.status}`);

     }

     const data = await response.json();
     return data.choices[0].message.content;
};

//Summarize note into bullet points

export const summarizeNote = async (content) =>{
    if(!content.trim()) throw new Error("Note is empty");

    const prompt = `Summarize the following note into clear, concise bullet points. Keep it short and highligh only the most important points.
     
    Note:
    ${content}
    Respond with only the bullet points, nothing else.;
    `
    return await callGrok(prompt);
};

// clean up messy note

export const cleanupNote = async (content) =>{
    if(!content.trim()) throw new Error("Note is empty!");

    const prompt = `Clean up adn improve the following note.
    Fix grammar, fix structure , make it more readable.
    Kee the original meaning and all information intact.
    
    Note: 
    ${content}

    Respond with only the cleaned up note , nothing else.
    `;

    return await callGrok(prompt);


};

//Auto generate tags

export const generateTags = async (content) =>{
    if(!content.trim()) throw new Error("Note is empty!");

    const prompt = `Based on the following note, generate 3-5 relevant short tags/keywords.
    
    Note:
    ${content}

    Respond with only a JSON  array of tag strings like: ["tag1" , "tag2", "tag3"]
    Nothing else , no explanation.
    `;

    const result = await callGrok(prompt);

    try{
            const cleaned = result.replace(/```json|```/g, "").trim();
            return  JSON.parse(cleaned);
    } catch{
        return [];
    }
};

//Generate a smart title for content

export const generateTitle = async (content) =>{
    if(!content.trim()) throw new Error("Note is empty!");

    const prompt = `Generate a short, smart title (max 6 words) for the following note. 
    Note:
     ${content}
     
     Respond with only  the title , nothing else.
     `;

     return await callGrok(prompt);
};