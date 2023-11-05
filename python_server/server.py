from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Request
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
from fastapi.middleware.cors import CORSMiddleware
import time
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, FileResponse


load_dotenv()
templates = Jinja2Templates(directory="templates")
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

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
async def upload_video(
    longtitude: str,
    latitude: str,
    video: UploadFile = File(...),
):
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
            "location": {"lat": latitude, "lon": longtitude},
            "upload_date": datetime.now(),
        }
        await db.videos.insert_one(video_info)

        return {
            "message": "Video uploaded successfully",
            "file_id": str(grid_fs_upload_stream._id),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/watch/{fileName}", response_class=HTMLResponse)
async def watch_video(request: Request, fileName: str):
    video_url = f"/video/{fileName}"  # Endpoint that will serve the video file
    return templates.TemplateResponse(
        "watch_video.html", {"request": request, "video_url": video_url}
    )


@app.get("/video/{fileName}")
async def video(fileName: str):
    file_path = "uploads/" + fileName
    return FileResponse(file_path, media_type="video/mp4", filename=fileName)


@app.get("/videos/")
async def get_videos_by_location() -> List[dict]:
    try:
        # Query the database for videos with the specified location
        videos_cursor = db.videos.find()
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
