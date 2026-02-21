import random
from datetime import datetime, timedelta
from app import db
from app.models.user import EmailOTP

class OTPService:
    @staticmethod
    def generate_otp():
        return str(random.randint(100000, 999999))
    
    @staticmethod
    def create_otp(email):
        otp = OTPService.generate_otp()
        expires_at = datetime.utcnow() + timedelta(minutes=5)
        
        # Check if exists
        existing_otp = EmailOTP.query.filter_by(email=email).first()
        if existing_otp:
            existing_otp.otp = otp
            existing_otp.expires_at = expires_at
        else:
            new_otp = EmailOTP(email=email, otp=otp, expires_at=expires_at)
            db.session.add(new_otp)
        
        db.session.commit()
        return otp # In production, send this via Email
    
    @staticmethod
    def verify_otp(email, otp_input):
        record = EmailOTP.query.filter_by(email=email).first()
        print(f"DEBUG: Verifying OTP for {email}. Input: '{otp_input}'")
        if not record:
            print(f"DEBUG: No OTP record found for {email}")
            return False, "OTP not sent"
        
        print(f"DEBUG: Record found. Stored OTP: '{record.otp}', Expires: {record.expires_at}")
        
        if datetime.utcnow() > record.expires_at:
            return False, "OTP expired"
        
        if record.otp != otp_input:
            return False, "Invalid OTP"
            
        # Clean up
        db.session.delete(record)
        db.session.commit()
        return True, "Verified"
