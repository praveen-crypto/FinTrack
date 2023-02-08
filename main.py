from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
from func import alphabet, get_enrollment_no, img_utils, retrieve_answers
from starlette.responses import RedirectResponse

app = FastAPI()

@app.get("/")
async def root():
    return RedirectResponse(url="/docs")

@app.post("/get_enroll_no/")
async def get_enroll_no(file: UploadFile = File(...)):
    content = await file.read()
    result = ""

    try:
        result = get_enrollment_no.read_enroll_no(content)
    except Exception as e:
        print(e)
        result = "failed to read the numbers"

    return result

@app.post("/get_answer/")
async def get_answer(file: UploadFile = File(...)):
    content = await file.read()
    
    try:
        result = retrieve_answers.read_sheet(content)
        #print(result)
    except Exception as e:
        print(e)
        result = 'unable to process the image'
    
    return result

