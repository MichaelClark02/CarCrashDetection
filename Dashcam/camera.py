import cv2
import time

# Access the webcam
cap = cv2.VideoCapture(0)  # 0 represents the default webcam, change to 1 or 2 for additional webcams

# Check if the webcam is opened successfully
if not cap.isOpened():
    print("Error opening video stream or file")

# Define the codec and create a VideoWriter object
fourcc = cv2.VideoWriter_fourcc(*'XVID')
out = cv2.VideoWriter('output.avi', fourcc, 20.0, (640, 480))

# Record and save the last 30 seconds
start_time = time.time()
print(start_time)
while cap.isOpened():
    ret, frame = cap.read()  # Read a frame from the video capture

    if ret:
        out.write(frame)  # Write the frame to the video file

        # Display the frame
        cv2.imshow('Frame', frame)

        # Press 'q' to exit the video stream
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

        # Check if 30 seconds have elapsed
        current_time = time.time()
        print(current_time)
        if current_time - start_time >= 30:
            start_time = current_time
            out.release()
            out = cv2.VideoWriter('output.avi', fourcc, 20.0, (640, 480))


            cv2.destroyAllWindows()
    else:
        break

# Release the video capture object and close the OpenCV window
cap.release()
out.release()
cv2.destroyAllWindows()
