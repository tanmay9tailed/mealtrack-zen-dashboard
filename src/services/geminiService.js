/**
 * Generates a complaint email draft using the Gemini API.
 * @param {string} formattedDate - The formatted date of the missed delivery.
 * @param {string} missedMeals - A comma-separated string of missed meals.
 * @param {string} notes - The user's notes about the issue.
 * @returns {Promise<string>} The generated text from the API.
 */
export const generateComplaintDraft = async (formattedDate, missedMeals, notes) => {
    const prompt = `A customer's meal delivery was missed.
    Date: ${formattedDate}
    Missed meals: ${missedMeals}
    Customer's notes: "${notes}"
    
    Based on these details, please draft a polite but firm complaint email to the customer support of a meal delivery service. The email should clearly state the problem, reference the date and missed meals, and request a resolution (like a refund or credit). Keep it concise and professional. Address it to "Customer Support Team".`;

    try {
        const apiKey = ""; // Provided by the environment
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] })
        });
        const result = await response.json();
        if (result.candidates && result.candidates.length > 0 && result.candidates[0].content.parts[0].text) {
            return result.candidates[0].content.parts[0].text;
        } else {
            return "Sorry, I couldn't generate a draft at this moment. Please try again.";
        }
    } catch (error) {
        console.error("Gemini API call failed:", error);
        return "An error occurred while contacting the AI assistant.";
    }
};

/**
 * Generates a weekly insights report using the Gemini API.
 * @param {Array} last7DaysData - An array of meal data objects from the last 7 days.
 * @returns {Promise<string>} The generated report text from the API.
 */
export const generateWeeklyReport = async (last7DaysData) => {
    const prompt = `Here is a user's meal delivery log for the last 7 days:
    ${JSON.stringify(last7DaysData, null, 2)}

    Based on this data, provide a friendly, insightful summary for the user.
    1. Start with a positive opening.
    2. Calculate and state the total number of delivered vs. missed meals.
    3. Identify any patterns or trends (e.g., "It looks like Wednesdays were a bit problematic for deliveries.").
    4. Offer one actionable tip or piece of encouragement for staying on track with their meal plan.
    5. Keep the tone encouraging and helpful. Format the output clearly.`;

    try {
        const apiKey = ""; // Provided by the environment
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] })
        });
        const result = await response.json();
        if (result.candidates && result.candidates.length > 0 && result.candidates[0].content.parts[0].text) {
            return result.candidates[0].content.parts[0].text;
        } else {
            return "Sorry, I couldn't generate a report at this moment.";
        }
    } catch (error) {
        console.error("Gemini API call failed:", error);
        return "An error occurred while contacting the AI assistant.";
    }
};