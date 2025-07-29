# from apscheduler.schedulers.asyncio import AsyncIOScheduler
# from fastapi import FastAPI
# from loguru import logger
# from typing import Annotated, List
# from fastapi import Depends


# class MediaCleanupScheduler:
#     def __init__(self, media_repo, storage):
#         self.scheduler = AsyncIOScheduler()
#         self.media_repo = media_repo
#         self.storage = storage

#     def start(self):
#         logger.info("📅 Starting media cleanup scheduler...")
#         self.scheduler.add_job(self.cleanup_orphan_media, 'interval', hours=24)
#         self.scheduler.start()

#     async def cleanup_orphan_media(self):
#         logger.info("🔍 Running orphan media cleanup...")

#         all_media = await self.media_repo.get_all_media()
#         referenced_ids = await self.media_repo.get_all_referenced_media_ids()

#         orphan_media = [m for m in all_media if str(m.id) not in referenced_ids]

#         for media in orphan_media:
#             try:
#                 logger.info(f"🗑 Removing orphan media: {media.filename}")
#                 await self.storage.delete_file(media.storage_id)
#                 await self.media_repo.delete_media(media.id)
#             except Exception as e:
#                 logger.warning(f"⚠️ Failed to remove media {media.id}: {e}")

#         logger.info(f"✅ Cleanup complete. Removed {len(orphan_media)} orphan files.")