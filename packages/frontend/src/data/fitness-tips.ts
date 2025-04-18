export const fitnessTips = [
    "Stay hydrated by drinking water throughout the day.",
    "Try adding a short walk after each meal to boost digestion.",
    "Focus on compound exercises for efficient full-body workouts.",
    "Prioritize sleep for optimal muscle recovery and growth.",
    "Warm up before every workout and cool down afterwards.",
    "Research shows protein intake of 1.6-2.2g per kg of bodyweight optimizes muscle growth.",
    "Studies indicate that 7-9 hours of quality sleep can improve athletic performance by up to 10%.",
    "Taking 3-5 minute rest breaks between heavy strength sets maximizes power output, according to research.",
    "Scientific evidence suggests varying workout intensity throughout the week prevents plateaus and overtraining.",
    "Research shows static stretching is most effective after workouts, not before.",
    "Studies show consuming 20-40g of protein within 2 hours post-workout enhances muscle recovery.",
    "Regular resistance training has been shown to increase bone density and prevent osteoporosis.",
    "Research confirms interval training burns more calories in less time than steady-state cardio.",
    "Studies show keeping a workout journal increases exercise adherence by up to 40%.",
    "Research indicates that standing for just 30 minutes throughout your workday can burn an extra 150 calories.",
    "According to studies, caffeine consumed 30-60 minutes pre-workout can improve endurance by up to 12%.",
    "Research shows that listening to music while exercising can reduce perceived exertion by up to 10%.",
    "Studies indicate exercising outdoors improves mood more effectively than indoor workouts.",
    "Research shows walking 8,000-10,000 steps daily significantly reduces cardiovascular disease risk.",
    "Studies suggest that deloading (reducing intensity) for one week every 4-8 weeks improves long-term gains.",
    "Research confirms breathing through your nose during low to moderate exercise improves oxygen efficiency.",
    "Studies show resistance training can reduce depression symptoms as effectively as medication in some cases.",
    "Research indicates that consuming carbohydrates within 30 minutes after endurance training replenishes glycogen stores faster.",
    "Studies show vitamin D supplementation may improve muscle strength and athletic performance.",
    "Research confirms that varying rep ranges (1-5, 6-12, 15+) targets different muscle fiber types.",
    "Studies show frequency matters more than duration—three 10-minute walks provide similar benefits to one 30-minute walk.",
    "According to research, foam rolling for 60-90 seconds per muscle group reduces soreness and improves range of motion.",
    "Studies indicate that active recovery (light activity on rest days) accelerates muscle recovery.",
    "Research shows training to technical failure (form breakdown) rather than absolute failure reduces injury risk while maintaining gains.",
    "Studies confirm that eccentric movements (lowering weights slowly) create more muscle damage and growth stimulus than concentric movements.",
    "Research indicates consuming omega-3 fatty acids reduces exercise-induced inflammation.",
    "Studies show that tracking heart rate variability can help optimize training intensity and recovery needs.",
    "Research confirms exercising in a fasted state may increase fat oxidation but can reduce performance in high-intensity workouts.",
    "Studies show core temperature rises for 15-20 minutes post-workout, making this an optimal time for stretching.",
    "Research indicates that creatine supplementation increases power output and muscle mass in strength training.",
    "Studies show that drinking cold water during exercise can help maintain performance in hot environments.",
    "According to research, alternating between sitting and standing throughout the day improves metabolic health.",
    "Studies confirm that proper breathing during strength exercises stabilizes your core and increases power.",
    "Research shows periodized training programs produce superior results compared to consistent intensity programs.",
    "Studies indicate that morning exercise may improve sleep quality compared to evening workouts for some people.",
    "Research confirms that grip strength is a strong predictor of overall health and longevity.",
    "Studies show that maintaining a slight caloric deficit of 300-500 calories optimizes fat loss while preserving muscle.",
    "Research indicates that antioxidant-rich foods help reduce exercise-induced oxidative stress.",
    "Studies show that training the same muscle groups 2-3 times weekly leads to better hypertrophy than once-weekly sessions.",
    "According to research, having a workout partner increases exercise adherence by up to 65%.",
    "Studies confirm that performing mobility exercises daily improves joint health and reduces injury risk.",
    "Research shows that consuming beetroot juice 2-3 hours before endurance exercise can improve performance by increasing nitric oxide production.",
    "Studies indicate that proper hydration improves performance by up to 25% during intense exercise.",
    "Research confirms that unilateral exercises (single-limb) improve muscular imbalances and core stability.",
    "Studies show that 5 minutes of meditation before workouts can improve focus and mind-muscle connection.",
    "Research indicates that zinc and magnesium supplementation may enhance recovery in deficient individuals.",
    "Studies confirm that varying exercise selection for the same muscle group prevents adaptation plateaus.",
    "Research shows that post-activation potentiation (doing heavy sets before explosive movements) increases power output.",
    "Studies indicate that proper breathing techniques during exercise reduce blood pressure spikes during lifting.",
    "Research confirms that even 10 minutes of daily movement significantly improves health markers compared to being sedentary.",
    "Studies show that consuming tart cherry juice reduces muscle soreness and inflammation after intense workouts.",
    "Research indicates that 30-60 seconds of rest between sets optimizes hypertrophy, while 2-5 minutes maximizes strength.",
    "Studies confirm that cognitive training (visualization) improves physical performance by enhancing neural pathways.",
    "Research shows that barefoot training improves foot proprioception and can strengthen intrinsic foot muscles.",
    "Studies indicate that sauna use after workouts may increase growth hormone production and aid recovery.",
];

const tipCategoryMap: { category: string; keywords: string[] }[] = [
    { category: "NUTRITION", keywords: ["protein", "diet", "eat", "food", "meal", "nutrition"] },
    { category: "RECOVERY", keywords: ["sleep", "rest", "recovery"] },
    { category: "HYDRATION", keywords: ["water", "hydrat"] },
    { category: "CARDIO", keywords: ["cardio", "walk", "run"] },
    { category: "STRENGTH", keywords: ["weight", "strength", "muscle"] },
    { category: "MOBILITY", keywords: ["stretch", "flexib", "mobility"] },
    { category: "SUPPLEMENTS", keywords: ["supplement", "vitamin"] },
    { category: "MINDSET", keywords: ["mental", "habit", "consist"] },
];

export function getTipCategory(tip: string): string {
    const tipLower = tip.toLowerCase();
    for (const mapping of tipCategoryMap) {
        if (mapping.keywords.some((keyword) => tipLower.includes(keyword))) {
            return mapping.category;
        }
    }
    return "FITNESS";
}

const tipIconMap: { color: string; icon: string; keywords: string[] }[] = [
    {
        color: "#4CAF50",
        icon: "mdi-food-apple",
        keywords: [
            "protein",
            "diet",
            "eat",
            "food",
            "meal",
            "nutrition",
            "carbohydrate",
            "caloric",
        ],
    },
    { color: "#3F51B5", icon: "mdi-sleep", keywords: ["sleep", "rest", "recovery", "nap"] },
    { color: "#2196F3", icon: "mdi-water", keywords: ["water", "hydrat"] },
    { color: "#FF5722", icon: "mdi-run", keywords: ["walk", "cardio", "steps", "running", "jog"] },
    {
        color: "#607D8B",
        icon: "mdi-dumbbell",
        keywords: [
            "weight",
            "strength",
            "muscle",
            "lift",
            "resistance",
            "dumbbell",
            "barbell",
            "rep",
        ],
    },
    {
        color: "#9C27B0",
        icon: "mdi-human-handsup",
        keywords: ["stretch", "flexib", "mobility", "range of motion", "foam roll"],
    },
    {
        color: "#FFC107",
        icon: "mdi-pill",
        keywords: ["supplement", "vitamin", "creatine", "protein powder", "omega-3"],
    },
    {
        color: "#9C27B0",
        icon: "mdi-brain",
        keywords: ["focus", "mental", "motivation", "habit", "consist", "journal", "track"],
    },
];

export function getTipIcon(tip: string): { color: string; icon: string } {
    const tipLower = tip.toLowerCase();
    for (const mapping of tipIconMap) {
        if (mapping.keywords.some((keyword) => tipLower.includes(keyword))) {
            return { color: mapping.color, icon: mapping.icon };
        }
    }
    return { color: "#FFC107", icon: "mdi-lightbulb-on" };
}
