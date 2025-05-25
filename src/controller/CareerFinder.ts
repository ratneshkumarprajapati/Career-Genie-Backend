import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai"
import { CareerFinderRequest, CareerTimeTravelRequest, TimeTravelResponse } from "../types/carrerTypes";
import CareerChartModel from "../model/CareerModel";


export const findCareer = async (req: Request, res: Response) => {
  try {
  
    const {
      educationLevel,
      skills,
      interests,
      preferredIndustries,
      location,
      workStyle,
      experienceYears,
    }: CareerFinderRequest = req.body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


    // Build a prompt for Gemini
    const prompt = `
        Based on the following user profile, suggest suitable career paths.

        User Profile:
        - Education Level: ${educationLevel}
        - Skills: ${skills.join(", ")}
        - Interests: ${interests.join(", ")}
        - Preferred Industries: ${preferredIndustries.join(", ")}
        - Location: ${location}
        - Work Style: ${workStyle}
        - Years of Experience: ${experienceYears}

        Return the output as a JSON structure **strictly matching** this format:

        {
          "name": "Career Advice",
           "children": [
              {
               "name": "Career Title",
                 "attributes": {
                "why": "Why this is a good fit"
         },
      "children": [
        {
          "name": "Description",
          "attributes": {
            "description": "Career description"
          }
        },
        {
          "name": "Potential Roles",
          "attributes": {
            "description": "List of roles"
          }
        }
        ]
        }
        ]
        }

         ONLY return valid JSON. Do not include explanations or any text outside the JSON block.
        `;


    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();
    console.log("result", rawText)

    const cleanText = rawText
      .replace(/```json\s*/g, '')
      .replace(/```/g, '')
      .trim();


    const orgChart = JSON.parse(cleanText);
    const data = await CareerChartModel.create(orgChart)
 

    res.json({ success: true, orgChart });



  } catch (error) {
    res.status(500).json(
      {
        success: false,
        message: "Gemini API error", error
      });

  }



}


// controllers/timeTravelController.ts


export const simulateCareerTimeTravel = async (req: Request, res: Response): Promise<void>  => {
  try {
    const {
      currentRole,
      experienceYears,
      location,
      timelineSteps,
    }: CareerTimeTravelRequest = req.body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const timelineText = timelineSteps
      .map(step => `- In ${step.yearOffset} years: ${step.goal}`)
      .join("\n");

    const prompt = `
You are a career path forecasting AI.

A user is currently a ${currentRole} with ${experienceYears} years of experience, based in ${location}.
They are considering the following timeline of future goals:

${timelineText}

Simulate their career progression with a hierarchical structure suitable for rendering in a React D3 Tree.

Use the following format:

- Each role should be represented as a node.
- The root node should be the user's current role.
- Each career goal should be a child node, in chronological order.
- For each child node, include an "attributes" object containing:
  - yearOffset (years from now)
  - description of the role
  - requiredSkills (list of skills)
  - estimatedSalary (USD salary range)
  - transitionReason (why this step makes sense)

Respond in clean JSON format like this:

{
  "name": "Frontend Developer",
  "attributes": {
    "yearOffset": 0
  },
  "children": [
    {
      "name": "Full Stack Developer",
      "attributes": {
        "yearOffset": 2,
        "description": "...",
        "requiredSkills": ["..."],
        "estimatedSalary": "$85,000 - $100,000",
        "transitionReason": "..."
      },
      "children": [
        {
          "name": "Tech Lead",
          "attributes": {
            "yearOffset": 4,
            "description": "...",
            "requiredSkills": ["..."],
            "estimatedSalary": "$120,000 - $150,000",
            "transitionReason": "..."
          }
        }
      ]
    }
  ]
}
`;


    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanText = text
      .replace(/```json\s*/g, '')
      .replace(/```/g, '')
      .trim();


    const orgChart = JSON.parse(cleanText);

    res.json({ success: true, orgChart });
  } catch (error) {
    console.error("Career Time Travel Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while simulating career time travel.",
    });
  }
};
