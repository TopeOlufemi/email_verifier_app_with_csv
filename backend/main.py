from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from verifier import process_emails

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.post("/verify/")
async def verify_emails(file: UploadFile = None, text_input: str = Form(None)):
    if file:
        content = await file.read()
        emails = content.decode().splitlines()
    elif text_input:
        emails = text_input.strip().split()
    else:
        return {"error": "No input provided"}

    results = process_emails(emails)
    return results
