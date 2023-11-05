from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse
from typing import List
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
from gridfs.errors import NoFile
from bson import ObjectId
from dotenv import load_dotenv
import os
from datetime import datetime


load_dotenv()

app = FastAPI()

# MongoDB setup
# MongoDB setup using environment variables
mongo_details = os.getenv("MONGO_DETAILS", "mongodb://localhost:27017")
client = AsyncIOMotorClient(mongo_details)
db = client[os.getenv("MONGO_DB_NAME", "video_db")]
grid_fs_bucket = AsyncIOMotorGridFSBucket(db)
# Directory for uploaded videos
upload_directory = "uploads/"
os.makedirs(upload_directory, exist_ok=True)


@app.post("/upload/")
async def upload_video(video: UploadFile = File(...), location: str = Form(...)):
    try:
        video_filename = f"{datetime.now().timestamp()}-{video.filename}"
        grid_fs_upload_stream = grid_fs_bucket.open_upload_stream(video_filename)

        # Read file in chunks and upload to GridFS
        while contents := await video.read(8192):  # Read in chunks of 8KB
            await grid_fs_upload_stream.write(contents)

        await grid_fs_upload_stream.close()

        # Save video information and location to MongoDB
        video_info = {
            "file_id": grid_fs_upload_stream._id,
            "filename": video_filename,
            "location": location,
            "upload_date": datetime.now(),
        }
        await db.videos.insert_one(video_info)

        return {
            "message": "Video uploaded successfully",
            "file_id": str(grid_fs_upload_stream._id),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/watch/{file_id}")
async def watch_video(file_id: str):
    try:
        # Open the download stream
        grid_out = await grid_fs_bucket.open_download_stream(ObjectId(file_id))

        # Define an async generator
        async def video_streamer(grid_out):
            while True:
                chunk = await grid_out.read(8192)  # Read in chunks of 8KB
                if not chunk:
                    break
                yield chunk

        # Call the generator function and pass it to StreamingResponse
        return StreamingResponse(video_streamer(grid_out), media_type="video/mp4")
    except NoFile:
        raise HTTPException(status_code=404, detail="Video not found")


@app.get("/videos/location/{location}")
async def get_videos_by_location(location: str) -> List[dict]:
    try:
        # Query the database for videos with the specified location
        videos_cursor = db.videos.find({"location": location})
        videos_list = await videos_cursor.to_list(length=None)

        # Convert the ObjectId to string to make it JSON serializable
        for video in videos_list:
            video["_id"] = str(video["_id"])
            if "file_id" in video:
                video["file_id"] = str(video["file_id"])

        return videos_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Run the server
if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
