import cv2
from scipy.spatial import distance as dist
import numpy as np
from imutils import perspective

def sort_contours(cnts, method="left-to-right"):
	# initialize the reverse flag and sort index
	reverse = False
	i = 0
	# handle if we need to sort in reverse
	if method == "right-to-left" or method == "bottom-to-top":
		reverse = True
	# handle if we are sorting against the y-coordinate rather than
	# the x-coordinate of the bounding box
	if method == "top-to-bottom" or method == "bottom-to-top":
		i = 1
	# construct the list of bounding boxes and sort them from top to
	# bottom
	boundingBoxes = [cv2.boundingRect(c) for c in cnts]
	(cnts, boundingBoxes) = zip(*sorted(zip(cnts, boundingBoxes), key=lambda b:b[1][i], reverse=reverse))
	# return the list of sorted contours and bounding boxes

	return (cnts, boundingBoxes)

def draw_contour(image, c, i):
	# compute the center of the contour area and draw a circle
	# representing the center
	M = cv2.moments(c)
	cX = int(M["m10"] / M["m00"])
	cY = int(M["m01"] / M["m00"])
	# draw the countour number on the image
	cv2.putText(image, "#{}".format(i), (cX - 20, cY), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 2)
	# return the image with the contour number drawn on it
	return image

def order_points(pts):
	# sort the points based on their x-coordinates
	xSorted = pts[np.argsort(pts[:, 0]), :]
	# grab the left-most and right-most points from the sorted
	# x-roodinate points
	leftMost = xSorted[:2, :]
	rightMost = xSorted[2:, :]
	# now, sort the left-most coordinates according to their
	# y-coordinates so we can grab the top-left and bottom-left
	# points, respectively
	leftMost = leftMost[np.argsort(leftMost[:, 1]), :]
	(tl, bl) = leftMost
	# now that we have the top-left coordinate, use it as an
	# anchor to calculate the Euclidean distance between the
	# top-left and right-most points; by the Pythagorean
	# theorem, the point with the largest distance will be
	# our bottom-right point
	D = dist.cdist(tl[np.newaxis], rightMost, "euclidean")[0]
	(br, tr) = rightMost[np.argsort(D)[::-1], :]
	# return the coordinates in top-left, top-right,
	# bottom-right, and bottom-left order
	return np.array([tl, tr, br, bl], dtype="float32")

def convert_to_grayscale(image):
	grayscale = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

	return grayscale

def get_doc_from_image(image):
	grayscale_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
	
	blurred_image = cv2.GaussianBlur(grayscale_image, (5, 5), 0)

	kernel = np.ones((9,9),np.uint8)
	morph = cv2.morphologyEx(blurred_image, cv2.MORPH_CLOSE, kernel, iterations = 18)
	
	thresh = cv2.threshold(morph, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]


	canny = cv2.Canny(thresh, 50, 150)

	black = np.zeros_like(image)
	con = np.zeros_like(image)

	# Finding contours for the detected edges.
	contours, hierarchy = cv2.findContours(canny, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)
	
	# Keeping only the largest detected contour.
	page = sorted(contours, key=cv2.contourArea, reverse=True)[:5]
	con = cv2.drawContours(con, page, -1, (0, 255, 255), 3)

	# Loop over the contours.
	for c in page:
		# Approximate the contour.
		epsilon = 0.02 * cv2.arcLength(c, True)
		corners = cv2.approxPolyDP(c, epsilon, True)
		# If our approximated contour has four points
		if len(corners) == 4:
			break

	cropped_image = perspective.four_point_transform(image, corners.reshape(4,2))
	cropped_grayscle_image = perspective.four_point_transform(grayscale_image, corners.reshape(4,2))
	
	return cropped_image


