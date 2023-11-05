import cv2
import os
import requests
import time


output_directory = "video_storage"
max_files_to_keep = 1
video_duration = 30  # Duration in seconds
url = "http://127.0.0.1:8000/upload"

os.makedirs(output_directory, exist_ok=True)
flag = False

cap = cv2.VideoCapture(1)  # 0 represents the default webcam

while True:
    start_time = time.time()
    frames = []
    if cv2.waitKey(1) & 0xFF == ord("x"):
        break
    while (time.time() - start_time) < video_duration:
        ret, frame = cap.read()
        if ret:
            frames.append(frame)
            cv2.imshow("Live Preview", frame)  # Display live video

        if cv2.waitKey(1) & 0xFF == ord("x"):
            break
            flag = True
            print("yo")

        if cv2.waitKey(1) & 0xFF == ord("q"):
            lat = "33.00382358994163"
            long = "-96.70807521810619"

            try:
                with open("video_storage/footage.mp4", "rb") as file:
                    files = {"video": ("video_storage/footage.mp4", file, "video/mp4")}
                    data = {
                        "video": ("video_storage/footage.mp4", file, "video/mp4"),
                        "latitude": lat,
                        "longitude": long,
                    }
                    response = requests.post(
                        url + f"/?latitude={lat}&longtitude={long}",
                        files=files,
                        data=data,
                    )

                #         # Check the response
                if response.status_code == 200:
                    print("Upload succeded")
                else:
                    print(f"Failed to upload video. Status code: {response}")
            except Exception as e:
                print(f"An error occurred: {str(e)}")
    if flag:
        break

    cv2.destroyWindow("Live Preview")  # Close the live preview window

    if frames:
        # Save the frames as a video file in the output directory
        video_filename = os.path.join(output_directory, f"footage.mp4")
        out = cv2.VideoWriter(
            video_filename, cv2.VideoWriter_fourcc(*"mp4v"), 30.0, (640, 480)
        )
        for frame in frames:
            out.write(frame)
        out.release()

        # # send post request to server

        # Remove older files to maintain the rolling storage
        video_files = os.listdir(output_directory)
        if len(video_files) > max_files_to_keep:
            video_files.sort()
            for file in video_files[:-max_files_to_keep]:
                os.remove(os.path.join(output_directory, file))
    else:
        break

cap.release()
cv2.destroyAllWindows()
