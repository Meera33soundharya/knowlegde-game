# Instructions to set up your Google API Key

To use the generative AI features of this application, you need to provide a Google API Key.

## 1. Get your API Key

1.  Go to [Google AI Studio](https://aistudio.google.com/).
2.  Log in with your Google account.
3.  Click on the "Get API Key" button.
4.  Copy the generated API key.

## 2. Set up the .env file

1.  Create a new file named `.env` inside the `server` directory of this project.
2.  Open the `.env` file and add the following line:

    ```
    GOOGLE_API_KEY=YOUR_API_KEY
    ```

3.  Replace `YOUR_API_KEY` with the API key you copied from Google AI Studio.

Now you can run the application, and it will use the generative AI features to create questions and notes for you.
