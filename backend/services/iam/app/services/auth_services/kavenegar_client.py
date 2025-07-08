from kavenegar import KavenegarAPI, APIException, HTTPException
from fastapi import HTTPException as FastAPIHTTPException
import random
from  app.services.base_service import BaseService

class KavenegarOTPClient(BaseService):
    def __init__(self):
        self.api = KavenegarAPI(self.config.KAVENEGAR_API_KEY)
        self.sender = self.config.KAVENEGAR_SENDER

    def generate_otp(self) -> str:
        return str(random.randint(100000, 999999))

    def send_otp(self, phone: str, otp: str):
        try:
            params = {
                'sender': self.sender,
                # 'receptor': phone,
                'receptor': '09380403877',
                'message': f'کد تایید شما: {otp}'
            }
            self.api.sms_send(params)
        except (APIException, HTTPException) as e:
            raise FastAPIHTTPException(status_code=500, detail="Failed to send OTP via Kavenegar")
