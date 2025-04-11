# ASK-FYEO

This repository contains the frontend interface for the TMU First Year Engineering Office chatbot and is accessible [here](https://ask-fyeo.netlify.app/). This interface communicates with the [Backend API](https://github.com/Panchofdez/ask-fyeo-chatbot) to support staff management features such as managing student/staff FAQs, managing conversation history, and analysing chatbot statistics. It also contains the embedded [ASK-FYEO Chatbot](https://github.com/Panchofdez/ask-fyeo-chatbot-streamlit) hosted on Streamlit. At the time of writing, this frontend component is shared with students on the FYEO website. 


## Usage
1. Run `npm install`
2. Change URL in [api.js](src/api/api.js) to point to your development backend URL or keep it as the production backend URL
3. Run `npm start` to run the app in development mode
4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
