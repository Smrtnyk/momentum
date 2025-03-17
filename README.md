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
- **Training Programs**: Access predefined workout plans for various fitness goals
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

## Contributing

Contributions are welcome. Feel free to open issues or submit pull requests.

## License

MIT
