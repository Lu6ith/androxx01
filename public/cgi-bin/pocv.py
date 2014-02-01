#!/usr/bin/python
print ("Content-Type: text/plain;charset=utf-8 \n")

import cv #Import functions from OpenCV
import time

try:
    cam = open('/dev/video0', 'rw')
except IOError:
    print ("ERROR")
    exit(1)

# cv.NamedWindow('a_window', cv.CV_WINDOW_AUTOSIZE)
# pin_path = '/sys/class/misc/sun4i-gpio/pin' 	#path to GPIO pins
# f = open(pin_path + '/ph20', 'w')		#pin with green LED
# f.write('1')					#turn LED on
# f.flush()

capt1 = cv.CaptureFromCAM(0)

#image=cv.LoadImage('/home/debian/img00001.png', cv.CV_LOAD_IMAGE_COLOR) #Load the image
cv.SetCaptureProperty(capt1, cv.CV_CAP_PROP_FRAME_WIDTH, 640)
cv.SetCaptureProperty(capt1, cv.CV_CAP_PROP_FRAME_HEIGHT, 480)
image = cv.QueryFrame(capt1)

font = cv.InitFont(cv.CV_FONT_HERSHEY_COMPLEX_SMALL, 0.8, 0.8, 0, 1, 4) #Creates a font
x = 5 
y = 470 
cv.PutText(image, "Praca ->  " + time.asctime(time.localtime()), (x,y), font, 0xFFEB8F) #Draw the text
# cv.ShowImage('a_window', image) #Show the image
cv.WaitKey(-1)
cv.SaveImage('/home/debian/Git/androxx01/public/images/image.png', image) #Saves the image

# turn LED off !
# f.write('0')
# f.flush()
# f.close()

print ("Done!")
exit(0)
