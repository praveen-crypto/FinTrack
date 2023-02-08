import os
import cv2
import imutils
#import matplotlib.pyplot as plt
import numpy as np
from imutils import perspective
from imutils import contours
from func import img_utils
from func import alphabet

answers = []

#path = os.path.join("omr_sheet\\dark_bg2.jpg")


def read_sheet(image_str):

    nparr = np.frombuffer(image_str, np.uint8)
    
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    doc = img_utils.get_doc_from_image(image)
    #doc = image
    gray = cv2.cvtColor(doc, cv2.COLOR_BGR2GRAY)
    filtered = cv2.GaussianBlur(gray, (5, 5), 0)
    thresh = cv2.threshold(filtered, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]

    x, y = np.shape(thresh)
    x_p = int(x * 0.2)
    y_p = y
    new_thresh = thresh[x_p : x - x_p, 0 : y_p]
    doc_copy = doc[x_p : x - x_p, 0 : y_p]
    cv2.imwrite('output/doc.jpg', doc)

    cnts = cv2.findContours(new_thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)
    cnts = img_utils.sort_contours(cnts, method="top-to-bottom")[0]
    color = (0, 255, 0)

    new_cnt = []
    ar = []

    for index, countour in enumerate(cnts):
        (x, y, w, h) = cv2.boundingRect(countour)
        ar.append(w / float(h))
        
        # Approximate the contour.
        epsilon = 0.02 * cv2.arcLength(countour, True)
        corners = cv2.approxPolyDP(countour, epsilon, True)

        # If our approximated contour has four points
        if len(corners) == 4:
            new_cnt.append(corners)

    new_cnt = img_utils.sort_contours(new_cnt, method="top-to-bottom")[0]

    #Fetch all the five section boxes from the omr sheet
    sections_blk = []
    sections_clr = []

    for ind, cnt in enumerate(new_cnt):
        sections_blk.append(perspective.four_point_transform( new_thresh, cnt.reshape(4,2) ))
        sections_clr.append(perspective.four_point_transform( doc_copy, cnt.reshape(4,2) ))

    section_1 = sections_blk[0]

    cnts, hierarchy = cv2.findContours(section_1.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    #cnts = imutils.grab_contours((cnts, hierarchy))

    questionCnts = []
    hie = []
    ar = []

    for i, c in enumerate(cnts):    
        (x, y, w, h) = cv2.boundingRect(c)
        ar.append(w / float(h)	)
        
        if w >= 100 and h >= 20 and ar[-1] > 1.5 and hierarchy[0][i][0] != -1:#and ar[-1] <= 1:
            #print(w)
            hie.append(hierarchy[0][i])
            questionCnts.append( np.reshape(c, [len(c), 2] )  )

    questionCnts = img_utils.sort_contours(questionCnts, method="top-to-bottom")[0]

    for (q, i) in enumerate(np.arange(0, len(questionCnts), 5)):

        cnts = contours.sort_contours(questionCnts[i:i + 5])[0]
        bubbled = []
        
        # loop over the sorted contours
        for (j, c) in enumerate(cnts):
            # (x, y, w, h) = cv2.boundingRect(c)
            # cv2.drawContours(sections_clr[0], [c], -1, color, 5)
            # cv2.putText(sections_clr[0], str(j), tuple([x, y]), cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 0, 0), 5, cv2.LINE_AA)

            mask = np.zeros(sections_blk[0].shape, dtype="uint8")
            cv2.drawContours(mask, [c], -1, 255, -1)

            mask = cv2.bitwise_and(sections_blk[0], sections_blk[0], mask=mask)
            total = cv2.countNonZero(mask)
            bubbled.append(total)

            if j == 4:            
                indx = bubbled.index(np.max(bubbled))
                answers.append(indx)
                cv2.drawContours(sections_clr[0], [cnts[indx]], -1, color, 3)

    answer_dict = {}

    for indx, ans in enumerate(answers):
        answer_dict[indx+1] = alphabet.letters[ans]

    return answer_dict

#cv2.imwrite('output/sec_contour.jpg', sections_clr[0])


#print(len(questionCnts))
# cv2.drawContours(sections_clr[0], questionCnts, -1, color, 5)
# cv2.imwrite('output/contour.jpg', sections_clr[0])



