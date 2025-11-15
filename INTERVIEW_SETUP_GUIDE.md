# AI Mock Interview Setup Guide

## Environment Variables Required

Create a `.env` file in the root directory with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Google Gemini API
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## How to Get These Keys

### Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Go to Project Settings → General → Your apps
4. Click on the web app icon (</>)
5. Copy the configuration values

### Google Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

## Interview Flow

The interview functionality works as follows:

1. **Home Page**: User clicks "Take an Interview" → Redirects to Sign In
2. **Sign In**: User authenticates → Redirects to Dashboard
3. **Dashboard**: User sees existing interviews or creates new one
4. **Create Interview**: User fills out job details → AI generates questions
5. **Start Interview**: User practices with AI-generated questions
6. **Record Answers**: Speech-to-text captures answers → AI provides feedback

## Troubleshooting

### Common Issues

1. **"Take an Interview" button not working**
   - Check if user is authenticated
   - Verify Firebase configuration
   - Check browser console for errors

2. **AI questions not generating**
   - Verify Gemini API key is valid
   - Check network requests in browser dev tools
   - Ensure API key has proper permissions

3. **Speech-to-text not working**
   - Check browser microphone permissions
   - Ensure HTTPS connection (required for speech recognition)
   - Test in supported browsers (Chrome, Edge, Safari)

4. **Interview not saving**
   - Verify Firebase Firestore rules
   - Check user authentication state
   - Monitor Firebase console for errors

### Testing the Flow

1. **Test Authentication**: Try signing up/in with different accounts
2. **Test Interview Creation**: Create a mock interview with sample job details
3. **Test Question Generation**: Verify AI generates 5 relevant questions
4. **Test Recording**: Record answers and check speech-to-text accuracy
5. **Test Feedback**: Submit answers and verify AI feedback is generated

## Development Tips

- Use browser dev tools to monitor network requests
- Check Firebase console for real-time database updates
- Test with different job positions and experience levels
- Monitor console logs for AI response parsing errors