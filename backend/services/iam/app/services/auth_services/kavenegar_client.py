# services/otp/kavenegar_client.py
from kavenegar import KavenegarAPI, APIException, HTTPException
from fastapi import HTTPException as FastAPIHTTPException
import random

class KavenegarOTPClient:
    def __init__(self, api_key: str, sender: str):
        self.api = KavenegarAPI(api_key)
        self.sender = sender

    def generate_otp(self) -> str:
        return str(random.randint(100000, 999999))

    def send_otp(self, phone: str, otp: str):
        try:
            params = {
                'sender': self.sender,
                'receptor': '09380403877',
                'message': f'کد تایید شما: {otp}'
            }
            self.api.sms_send(params)
        except (APIException, HTTPException) as e:
            raise FastAPIHTTPException(status_code=500, detail="Failed to send OTP via Kavenegar")
