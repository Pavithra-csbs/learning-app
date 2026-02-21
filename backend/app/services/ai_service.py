from app.models.quiz import QuizAttempt, Question
from app.models.academics import Topic
from app.models.ai_learning import AIRecommendation
from app import db
from sqlalchemy import func

class AIService:
    @staticmethod
    def analyze_student_performance(student_id):
        # Fetch all quiz attempts for the student
        attempts = QuizAttempt.query.filter_by(student_id=student_id).all()
        
        if not attempts:
            return []

        performance_map = {}
        for attempt in attempts:
            # We need to link QuizAttempt -> GameLevel -> Topic
            # But the requirement says analyze scores per chapter/topic
            # Let's group by game_level for now or join with Topic
            from app.models.game_level import GameLevel
            level = GameLevel.query.get(attempt.game_level_id)
            if not level: continue
            
            topic = Topic.query.get(level.topic_id)
            if not topic: continue
            
            if topic.topic_name not in performance_map:
                performance_map[topic.topic_name] = {
                    "total_score": 0,
                    "count": 0,
                    "max_possible": 0,
                    "topic_id": topic.id
                }
            
            performance_map[topic.topic_name]["total_score"] += attempt.score
            performance_map[topic.topic_name]["count"] += 1
            # Assuming score is out of 100 for percentage calculation
            # If not, we might need a dynamic max score per quiz
            performance_map[topic.topic_name]["max_possible"] += 100 

        analysis = []
        for topic_name, stats in performance_map.items():
            avg_score = (stats["total_score"] / stats["max_possible"]) * 100
            
            status = "STRONG"
            difficulty = "Hard"
            if avg_score < 50:
                status = "WEAK"
                difficulty = "Easy"
            elif avg_score < 80:
                status = "IMPROVING"
                difficulty = "Medium"

            analysis.append({
                "topic": topic_name,
                "topic_id": stats["topic_id"],
                "avg_score": avg_score,
                "status": status,
                "suggested_difficulty": difficulty
            })
            
        return analysis

    @staticmethod
    def get_recommendations(student_id):
        analysis = AIService.analyze_student_performance(student_id)
        if isinstance(analysis, dict): return [] # No data

        recommendations = []
        for item in analysis:
            chapter = item["topic"]
            status = item["status"]
            
            # Logic:
            # If student_score(chapter) < 50%: mark chapter as WEAK, recommend extra mini-games and videos
            # Else if student_score(chapter) between 50–80%: recommend medium-level quizzes
            # Else: unlock advanced boss challenges
            
            rec_game = None
            reason = ""
            difficulty = item["suggested_difficulty"]

            if status == "WEAK":
                rec_game = "Interactive Lesson & Puzzle"
                reason = f"You struggled in {chapter}. Try this puzzle game and review the lesson!"
            elif status == "IMPROVING":
                rec_game = "Medium Battle Quiz"
                reason = f"Getting better at {chapter}! Let's try some medium level questions."
            else:
                rec_game = "Elite Boss Challenge"
                reason = f"Mastered {chapter}! Time for the ultimate challenge."

            # Save recommendation to DB
            existing = AIRecommendation.query.filter_by(student_id=student_id, chapter=chapter).first()
            if existing:
                existing.recommended_game = rec_game
                existing.difficulty_level = difficulty
                existing.reason = reason
            else:
                new_rec = AIRecommendation(
                    student_id=student_id,
                    chapter=chapter,
                    recommended_game=rec_game,
                    difficulty_level=difficulty,
                    reason=reason
                )
                db.session.add(new_rec)
        
        db.session.commit()
        return AIRecommendation.query.filter_by(student_id=student_id).all()

    @staticmethod
    def generate_adaptive_quiz(student_id):
        analysis = AIService.analyze_student_performance(student_id)
        if isinstance(analysis, dict): return []

        # Find weak topics
        weak_topics = [a["topic_id"] for a in analysis if a["status"] == "WEAK"]
        if not weak_topics:
            # If no weak topics, take improving ones
            weak_topics = [a["topic_id"] for a in analysis if a["status"] == "IMPROVING"]
        
        if not weak_topics:
            # Default to all attempted topics if somehow nothing is weak/improving
            weak_topics = [a["topic_id"] for a in analysis]

        # Fetch questions for these topics
        # Join with GameLevel to get topic_id
        from app.models.game_level import GameLevel
        questions = db.session.query(Question).join(GameLevel, Question.game_level_id == GameLevel.id).filter(GameLevel.topic_id.in_(weak_topics)).order_by(func.random()).limit(10).all()
        
        return [q.to_dict() for q in questions]
