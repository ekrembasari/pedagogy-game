# **App Name**: VisuEquation Growth

## Core Features:

- Interactive Visual Equations: Presents various types of visual equations including classic shape equations, Nonogram-based visual inference, and Killer Sudoku-inspired hybrid structures.
- Adaptive Hint System: Offers a tiered hint system with three levels: Awareness, Strategy, and Action Focus, to guide students through problem-solving without giving away the answer directly.
- Personalized Learning Paths: Adapts the difficulty and type of problems based on the student's performance. This is determined by tracking progress using localStorage and Cloud SQL database to manage levels, scores, and error rates, utilizing a hybrid storage management system where guest user data is local, and upon login, local data is merged with cloud data using an upsert strategy.
- Checkpoint Assessments: Implements mandatory 'Evaluation Mode' at regular intervals (e.g., Levels 3, 6, 9) where hint buttons are disabled, requiring students to solve problems independently.
- Dynamic Scoring Algorithm: Calculates scores based on correctness, hint usage, and number of attempts, rewarding persistence and penalizing excessive help. Incentivizes independent solutions and efficiency rather than penalizing hint usage, and includes bonuses for solving problems without hints or with high efficiency.
- Automated Struggle Analysis: The system identifies when a student is struggling, not just by incorrect attempts but also by 'Idle Time', and offers advice and helpful resources.
- Progress and Insights Report: Generates skill summaries that indicate strengths and struggles within a certain amount of attempts. Includes challenges completed and other helpful information, presenting metrics focused on patience, strategy adaptation, and focus, derived from Cloud SQL data for parental insights.
- Enhanced Mobile UX for Complex Structures: Adds 'Zoom & Pan' or a 'Focused View' feature to the architecture to manage complex structures like Nonograms and Killer Sudoku on mobile screens.
- Inclusive Design for Accessibility: Uses 'Color + Pattern/Symbol' combinations in shapes for color-blind students and includes a 'Dyslexia-Friendly Font' option in settings.
- Real-Life Transfer Bridge: Dynamically displays examples of the puzzle logic in digital economies like Roblox or Minecraft at the end of each level block.
- Metadata-Driven Problem Selection: The JSON CONFIG object includes metadata fields for each question, such as difficulty level, targeted cognitive skill, and estimated solution time.
- Interactive Animations for Learning Reinforcement: Provides physical animations when a correct answer is given, showing shapes transforming into numbers (Abstract → Concrete transition).

## Style Guidelines:

- Primary color: Emerald green (#50C878) to represent growth and freshness, aligning with the educational focus.
- Background color: Very light desaturated indigo (#F0F8FF) to provide a calming, learning-focused backdrop.
- Accent color: Soft purple (#D8BFD8) for interactive elements and highlights, complementing the primary and background colors with a touch of creativity.
- Body and headline font: 'PT Sans', a humanist sans-serif font, for a modern yet accessible and friendly feel suitable for children.
- Use a geometric sans-serif font (e.g., Montserrat or Inter) for numbers and equations to improve readability.
- Code font: 'Source Code Pro' for displaying any code snippets within the app.
- Use clean, modern icons suitable for a child audience and aligned with the educational context.
- Employs CSS Grid and Flexbox for a responsive, layered architecture. Content is centrally managed via a CONFIG object (JSON), facilitating updates and scalability. Mobile-first responsive design is mandatory, ensuring a seamless experience across tablets and phones.
- Use subtle animations to enhance user engagement and provide feedback on interactions.