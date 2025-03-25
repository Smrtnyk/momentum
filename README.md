# Momentum Fitness

A comprehensive fitness tracking application built out of frustration with existing solutions.

## Why This Exists

After trying numerous fitness apps that offered minimal features behind paywalls and subscription models, I decided to build my own solution. Momentum combines workout tracking, nutrition monitoring, and health metrics in a single application without the premium-feature-paywall approach.

## Try It Out

The app is live at: [https://momentum-fit-app.web.app/](https://momentum-fit-app.web.app/)

## Current Features

- **Workout Logging**: Track workouts with detailed exercise tracking
- **Nutrition Tracking**: Monitor daily calorie intake and macronutrient breakdown
    - Food label scanning with Vertex AI analysis
    - Barcode scanning for quick food logging
    - Raw ingredient search using natural language and Nutritionix API
    - Manual macro logging for custom entries
- **Custom Foods**: Create and save your frequently used food items
- **Recipe Collection**: Browse fitness-focused recipes with nutritional information
- **Health Metrics**: Track weight, body fat, water intake, and steps
- **Training Programs**: Access predefined workout plans for various fitness goals, or create your own ones
- **Analytics Dashboard**: Visualize your progress with comprehensive fitness and nutrition analytics

## Tech Stack

- Vue.js with TypeScript
- Vuetify for UI components
- Firebase for authentication and database
- Vertex AI for nutrition label analysis
- Nutritionix API, OpenFoodRepo and OpenFoodFacts for food database access

## Future Development

- **AI Personal Trainer**: Integrate an AI agent to provide personalized workout recommendations and form guidance
- **Workout Plan Generator**: Create custom workout plans based on user goals and available equipment
- **Social Features**: Share workouts and achievements with friends

## Installation for Development

```bash
# Clone the repository
git clone https://github.com/Smrtnyk/momentum.git

# Install dependencies
pnpm install

# Set up Firebase configuration in packages/frontend .env file (rename .env-example to .env)

# Run development server
pnpm run start:emulators
cd packages/frontend
pnpm run dev
```

## Local Development

This section covers how to set up and use the local development environment, including Firebase emulators and data seeding.

### Firebase Emulators

The application uses Firebase emulators for local development, which allows you to work offline and without affecting production data.

```bash
# Start all emulators
pnpm run start:emulators

# This will start the following emulators:
# - Firebase Auth (port 9099)
# - Firestore (port 8080)
# - Functions (port 5001)
# - Hosting (port 5000)
```

### Data Seeding

To make development easier, the project includes a seeder script that populates the Firestore emulator with realistic test data.

#### What the Seeder Creates

- User profile with realistic data
- Custom foods for the user
- Custom training plans based on the predefined plans
- 60 days of historical data including:
    - Daily health metrics (weight, body fat, water intake, steps)
    - Meals with nutritional information
    - Workouts following proper training schedules
    - Calorie tracking that matches the logged meals

#### Setting Up the Seeder

1. **Create a `cert.json` file in the `packages/functions/seeder` directory**

   This file is required for the seeder to authenticate with the Firebase emulators. For local development, you can create a dummy service account file with the following structure:

   ```json
   {
     "type": "service_account",
     "project_id": "dummy-id",
     "private_key_id": "dummy-key-id",
     "private_key": "-----BEGIN PRIVATE KEY-----\ndummykey\n-----END PRIVATE KEY-----\n",
     "client_email": "firebase-adminsdk@your-app-app.iam.gserviceaccount.com",
     "client_id": "dummy-client-id",
     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
     "token_uri": "https://oauth2.googleapis.com/token",
     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
     "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk%40your-app-app.iam.gserviceaccount.com",
     "universe_domain": "googleapis.com"
   }
   ```

   Note: The file content doesn't matter for emulator use, but the file must exist and be properly formatted.

2. **Create a test user in the Auth emulator**

   The seeder will use the first user it finds in the Auth emulator database. You can create a user through the Firebase Emulator UI (typically at http://localhost:4000/auth) or via the app's sign-up process while running against emulators.

#### Running the Seeder

```bash
# Navigate to the functions package
cd packages/functions

# Run the seeder
pnpm run seed-firestore
```

The seeder will:
1. Connect to your local Firebase emulators
2. Find the first user in the Auth emulator
3. Generate and seed 60 days of data for that user
4. Skip days that already have data (to avoid duplicate entries)

#### Customizing the Seeder

You can modify the seeder's behavior by editing the constants at the top of `packages/functions/seeder/seed-firestore.ts`:

```typescript
const DAYS_TO_SEED = 60;            // Number of days to seed
const MEALS_PER_DAY_MIN = 2;        // Minimum meals per day
const MEALS_PER_DAY_MAX = 5;        // Maximum meals per day
const WORKOUT_DAYS_PER_WEEK = 4;    // Approximate workout frequency
const WORKOUT_PLAN_COUNT = 3;       // Number of custom workout plans to create
const CUSTOM_FOODS_COUNT = 10;      // Number of custom foods to create
```

### Testing with Seeded Data

Once the seeder has run successfully, you can:

1. Log in to the application using the test user's credentials
2. Browse through the seeded health metrics, workout logs, and nutrition data
3. Add new data that will be stored only in your local emulator
4. Reset the emulators anytime for a fresh start

## Contributing

Contributions are welcome. Feel free to open issues or submit pull requests.

## License

MIT
