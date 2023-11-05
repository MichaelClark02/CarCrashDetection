import cv2
import time




# Access the webcam
cap = cv2.VideoCapture(0)  # 0 represents the default webcam, change to 1 or 2 for additional webcams

# Check if the webcam is opened successfully
if not cap.isOpened():
    print("Error opening video stream or file")

# Define the codec and create a VideoWriter object
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
name = str(time.time())+"output.mp4"

out = cv2.VideoWriter(name, fourcc, 30.0, (640, 480))

frameCount = 0

# Record and save the last 30 seconds
start_time = time.time()
while cap.isOpened():
    ret, frame = cap.read()  # Read a frame from the video capture

    if ret:
        frameCount+=1
        out.write(frame)  # Write the frame to the video file

        # Display the frame
        cv2.imshow('Frame', frame)

        if cv2.waitKey(1) & 0xFF == ord('x'):
            break

        # Press 'q' to exit the video stream
        if cv2.waitKey(1) & 0xFF == ord('q'):
            out.release()

            # Input video file path
            input_video_path = name

            # Output video file path
            output_video_path = 'trimmed' + name

            # Duration of the last 30 seconds (in seconds)
            last_30_seconds = 30

            # Open the video file
            cap = cv2.VideoCapture(input_video_path)

            # Get the frames per second (fps) and total number of frames
            fps = int(cap.get(cv2.CAP_PROP_FPS))
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

            # Calculate the frame number to start trimming from
            start_frame = max(0, total_frames - (fps * last_30_seconds))

            # Create a VideoWriter object for the output video
            outTrim = cv2.VideoWriter(output_video_path, fourcc, fps, (int(cap.get(3)), int(cap.get(4))))

            # Read and write the frames to create the trimmed video
            cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                outTrim.write(frame)


        
            name = str(time.time())+"output.mp4"
            out = cv2.VideoWriter(name, fourcc, 30.0, (640, 480))
            

        # Check if 30 seconds have elapsed
        # current_time = time.time()
        # if current_time - start_time >= 30:
        #     start_time = current_time
        #     out.release()
        #     out = cv2.VideoWriter('output.mp4', fourcc, 30.0, (640, 480))
    else:
        break

# Release the video capture object and close the OpenCV window

cap.release()
out.release()
cv2.destroyAllWindows()
