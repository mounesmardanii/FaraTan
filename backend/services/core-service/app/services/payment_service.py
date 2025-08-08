import httpx
from loguru import logger
from uuid import UUID
from decimal import Decimal


class PaymentService:
    def __init__(self):
        self.merchant_id = "123e4567-e89b-12d3-a456-426614174000"  
        self.sandbox_request_url = "https://sandbox.zarinpal.com/pg/v4/payment/request.json"
        self.sandbox_verify_url = "https://sandbox.zarinpal.com/pg/v4/payment/verify.json"
        self.sandbox_startpay_url = "https://sandbox.zarinpal.com/pg/StartPay/"

    def create_callback_url(self, purchase_id: UUID) -> str:
        """
        This method constructs the Callback URL based on the purchase_id.
        You can modify this URL depending on your server's structure.
        """
        base_url = "http://127.0.0.1:8002/api/v1/payment/callback"
        return f"{base_url}/{purchase_id}"

    async def request_payment(self, purchase_id: UUID, amount: Decimal) -> str:

        payload = {
            "merchant_id": self.merchant_id,
            "amount": float(amount),
            "callback_url": self.create_callback_url(purchase_id),
            "description": f"پرداخت برای دوره {purchase_id}",
            "metadata": {}
        }
        async with httpx.AsyncClient(timeout=httpx.Timeout(30.0, connect=10.0)) as client:
            response = await client.post(self.sandbox_request_url, json=payload)
            data = response.json()
            logger.info(f"Payment request response: {data}")

            if data.get("data") and data["data"].get("authority"):
                authority = data["data"]["authority"]
                payment_url = f"{self.sandbox_startpay_url}{authority}"
                return payment_url
            else:
                raise Exception(f"Payment request failed: {data}")

    async def verify_payment(self, amount: float, authority: str) -> bool:

        payload = {
            "merchant_id": self.merchant_id,
            "amount": float(amount) ,
            "authority": authority
        }
        async with httpx.AsyncClient(timeout=httpx.Timeout(30.0, connect=10.0)) as client:
            response = await client.post(self.sandbox_verify_url, json=payload)
            data = response.json()
            logger.info(f"Payment verify response: {data}")

            status = data.get("data", {}).get("code")
            logger.info("status",status)
            if status == 100 or status == 101:
                return True
            else:
                return False
            