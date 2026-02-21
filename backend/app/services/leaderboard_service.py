from app.models.leaderboard_ext import LeaderboardExtScore, LeaderboardExtRank
from app.models.user import User
from app import db
from sqlalchemy import func

class LeaderboardService:
    @staticmethod
    def update_score(student_id, data):
        """
        Updates or creates a score entry for a student.
        data: { class, subject, chapter, stars_earned, quiz_score }
        """
        student_class = str(data.get('class'))
        subject = data.get('subject')
        chapter = data.get('chapter')
        stars_earned = data.get('stars_earned', 0)
        quiz_score = data.get('quiz_score', 0)
        
        # Scoring logic: total_score = (stars_earned * 10) + quiz_score
        new_total_score = (stars_earned * 10) + quiz_score
        
        # Check for existing entry for this specific chapter
        entry = LeaderboardExtScore.query.filter_by(
            student_id=student_id,
            student_class=student_class,
            subject=subject,
            chapter=chapter
        ).first()
        
        if entry:
            # Update if the new score is higher or if we want to accumulate?
            # Requirement says "Update leaderboard after quiz/game"
            # Usually we store the best score per chapter
            if new_total_score > entry.total_score:
                entry.stars_earned = stars_earned
                entry.quiz_score = quiz_score
                entry.total_score = new_total_score
        else:
            entry = LeaderboardExtScore(
                student_id=student_id,
                student_class=student_class,
                subject=subject,
                chapter=chapter,
                stars_earned=stars_earned,
                quiz_score=quiz_score,
                total_score=new_total_score
            )
            db.session.add(entry)
        
        db.session.commit()
        
        # Recalculate global ranks after update
        LeaderboardService.recalculate_ranks()
        
        return entry

    @staticmethod
    def recalculate_ranks():
        """
        Calculates global rankings based on cumulative total_score across all chapters.
        Ranking Rules:
        - Higher total_score -> higher rank
        - Tie-breaker: Higher quiz_score
        - If tie again: Earlier completion time wins
        """
        # Get cumulative scores per student
        # We sum total_score and quiz_score (for tie-breaking)
        # And get the latest update time (for tie-breaking - although requirement says earlier wins)
        # Wait, requirement says "Earlier completion time wins" for tie-breaker.
        # But our updated_at is the LATEST. Let's assume we want the first achievement if scores are equal?
        # Actually, usually "Earlier" means the one who reached that score first.
        # But since it's cumulative, "Earlier" might be hard to define perfectly without a history table.
        # Let's use MIN(updated_at) as a proxy for seniority in that score bracket.
        
        results = db.session.query(
            LeaderboardExtScore.student_id,
            func.sum(LeaderboardExtScore.total_score).label('sum_total'),
            func.sum(LeaderboardExtScore.quiz_score).label('sum_quiz'),
            func.min(LeaderboardExtScore.updated_at).label('first_at')
        ).group_by(LeaderboardExtScore.student_id)\
         .order_by(
             func.sum(LeaderboardExtScore.total_score).desc(),
             func.sum(LeaderboardExtScore.quiz_score).desc(),
             func.min(LeaderboardExtScore.updated_at).asc()
         ).all()
        
        # Clear existing ranks
        LeaderboardExtRank.query.delete()
        
        for index, r in enumerate(results):
            rank_entry = LeaderboardExtRank(
                student_id=r.student_id,
                rank_position=index + 1,
                total_score=r.sum_total
            )
            db.session.add(rank_entry)
        
        db.session.commit()

    @staticmethod
    def get_global_leaderboard(limit=10):
        ranks = LeaderboardExtRank.query.order_by(LeaderboardExtRank.rank_position).limit(limit).all()
        result = []
        for r in ranks:
            user = User.query.get(r.student_id)
            if user:
                result.append({
                    "rank": r.rank_position,
                    "name": user.name,
                    "avatar": LeaderboardService._get_avatar(user),
                    "total_score": r.total_score,
                    "stars": sum([s.stars_earned for s in user.extended_scores]) if user.extended_scores else 0
                })
        return result

    @staticmethod
    def get_filtered_leaderboard(class_name=None, subject=None, chapter=None):
        query = db.session.query(
            LeaderboardExtScore.student_id,
            func.sum(LeaderboardExtScore.total_score).label('total'),
            func.sum(LeaderboardExtScore.stars_earned).label('stars'),
            func.sum(LeaderboardExtScore.quiz_score).label('quiz')
        )
        
        if class_name:
            query = query.filter(LeaderboardExtScore.student_class == class_name)
        if subject:
            query = query.filter(LeaderboardExtScore.subject == subject)
        if chapter:
            query = query.filter(LeaderboardExtScore.chapter == chapter)
            
        results = query.group_by(LeaderboardExtScore.student_id)\
                       .order_by(func.sum(LeaderboardExtScore.total_score).desc()).limit(20).all()
                       
        result = []
        for index, r in enumerate(results):
            user = User.query.get(r.student_id)
            if user:
                result.append({
                    "rank": index + 1,
                    "name": user.name,
                    "avatar": LeaderboardService._get_avatar(user),
                    "total_score": int(r.total),
                    "stars": int(r.stars),
                    "quiz_score": int(r.quiz)
                })
        return result
