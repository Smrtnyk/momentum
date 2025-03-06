export interface Ingredient {
    amount: string;
    name: string;
    unit: string;
}

export interface Macros {
    carbs: number;
    fat: number;
    protein: number;
}

export interface Recipe {
    calories: number;
    category: RecipeCategory;
    cookTime: number;
    description: string;
    difficulty: "easy" | "hard" | "medium";
    id: string;
    imageUrl?: string;
    ingredients: Ingredient[];
    instructions: string[];
    macros: Macros;
    name: string;
    notes?: string;
    prepTime: number;
    servings: number;
    tags: RecipeTag[];
}

type RecipeCategory = "bulking" | "cutting" | "maintenance";

type RecipeTag =
    | "budget-friendly"
    | "calorie-friendly"
    | "dairy-free"
    | "dessert"
    | "gluten-free"
    | "high-protein"
    | "low-carb"
    | "meal-prep"
    | "no-cook"
    | "quick"
    | "vegan"
    | "vegetarian";
