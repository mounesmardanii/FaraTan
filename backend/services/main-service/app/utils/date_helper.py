from datetime import datetime, timedelta

def get_start_and_end_of_week():
    today = datetime.utcnow()
    
    today = today + timedelta(hours=3.5) 
    start_of_week = today - timedelta(days=today.weekday() + 1)  # (weekday() == 0 for Monday, so we add 1)
    end_of_week = start_of_week + timedelta(days=6) 

    start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_week = end_of_week.replace(hour=23, minute=59, second=59, microsecond=999999)

    return start_of_week, end_of_week


def get_start_and_end_of_month():
    today = datetime.utcnow()
    today = today + timedelta(hours=3.5) 
    start_of_month = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    if today.month == 12:
        end_of_month = start_of_month.replace(year=today.year + 1, month=1) - timedelta(seconds=1)
    else:
        end_of_month = start_of_month.replace(month=today.month + 1) - timedelta(seconds=1)

    return start_of_month, end_of_month


def to_jalali_month_str(dt):
    if not dt:
        return ""
    jalali = jdatetime.datetime.fromgregorian(datetime=dt)
    months = [
        "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
        "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
    ]
    return f"{months[jalali.month - 1]} {jalali.year}"