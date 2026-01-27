
class QuizService:
    @staticmethod
    def calculate_results(score, total_questions=8):
        # User requirements:
        # Low Level: 2 questions
        # Moderate Level: 5 questions
        # Full Score: All questions (8)

        if score >= total_questions:
            level = "GOOD" # Full Score
            stars = 3
            message = "Hurray 🎉 Woohoo! You got full score!"
        elif score >= 5:
            level = "MODERATE"
            stars = 2
            message = "Good job 👍 Try for full score!"
        elif score >= 2:
            level = "LOW"
            stars = 1
            message = "Don’t feel bad 😊 Try again!"
        else:
            level = "POOR"
            stars = 0
            message = "Let's try again! You can do it! 💪"

        return {
            "score": score,
            "total_questions": total_questions,
            "level": level,
            "stars": stars,
            "message": message
        }
