import os
import cv2
import imutils
#import matplotlib.pyplot as plt
import numpy as np
from imutils import perspective
from imutils import contours
from func import img_utils



#path = os.path.join("enroll_no_images/2.jpg")

def read_enroll_no(image_str):
	#variables
	color = (0, 0, 255)
	enroll_number = []
	questionCnts = []

	nparr = np.frombuffer(image_str, np.uint8)
	image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

	#gray scale image
	gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
	#cv2.imwrite('output/gray.jpg', gray)

	#filter Image
	filtered = cv2.GaussianBlur(gray, (5, 5), 0)
	#cv2.imwrite('output/filtered.jpg', filtered)

	# apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
	# clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
	# equalized = clahe.apply(filtered)
	#cv2.imwrite('output/equalized.jpg', equalized)

	edged = cv2.Canny(filtered, 75, 200)
	#cv2.imwrite('output/edged.jpg', edged)

	thresh = cv2.threshold(filtered, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]
	#cv2.imwrite('output/thresh.jpg', thresh)

	cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
	cnts = imutils.grab_contours(cnts)
	#cnts = sorted(cnts, key=cv2.contourArea, reverse=True)

	for c in cnts:
		(x, y, w, h) = cv2.boundingRect(c)
		ar = w / float(h)	    
		if w >= 20 and h >= 81 and (ar >= 0.99 and ar <= 1.1):
			questionCnts.append(np.reshape(c, [len(c), 2] ) )

	questionCnts = img_utils.sort_contours(questionCnts)[0]

	for (q, i) in enumerate(np.arange(0, len(questionCnts), 10)):	
		cnts = contours.sort_contours(questionCnts[i:i + 10], method="top-to-bottom")[0]
		bubbled = []
		
		for (j, c) in enumerate(cnts):
			mask = np.zeros(thresh.shape, dtype="uint8")
			cv2.drawContours(mask, [c], -1, 255, -1)
			(x, y, w, h) = cv2.boundingRect(c)

			#cv2.drawContours(gray, [cnts[j]], -1, color, 3)
			#cv2.putText(gray, str(j), tuple([x, y]), cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 0, 0), 5, cv2.LINE_AA)

			mask = cv2.bitwise_and(thresh, thresh, mask=mask)
			total = cv2.countNonZero(mask)
			bubbled.append(total)

			if j == 9:
				ind = bubbled.index(np.max(bubbled))
				enroll_number.append(str(ind))
				#print(np.max(bubbled))
				#cv2.drawContours(gray, [cnts[ind]], -1, color, 3)

	return "".join(enroll_number)

#cv2.imwrite('output/output.jpg', gray )

