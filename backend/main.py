from fastapi import FastAPI, UploadFile, File, Form, Response
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import io
import json
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="PDF Editor Python Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "PDF Editor Python Backend is running!"}

@app.post("/process-pdf")
async def process_pdf(
    file: UploadFile = File(...),
    edits: str = Form(...)  # JSON string of edits
):
    """
    Advanced Rendering: Applies text and drawings to the PDF using Python.
    """
    edit_data = json.loads(edits)
    
    # Read original PDF
    original_pdf = PdfReader(io.BytesIO(await file.read()))
    writer = PdfWriter()
    
    # We process page by page
    for page_idx in range(len(original_pdf.pages)):
        original_page = original_pdf.pages[page_idx]
        page_width = float(original_page.mediabox.width)
        page_height = float(original_page.mediabox.height)
        
        # Create a transparent overlay for this page
        packet = io.BytesIO()
        can = canvas.Canvas(packet, pagesize=(page_width, page_height))
        
        # Apply Text Edits
        for text in edit_data.get('textElements', []):
            if text['page'] == page_idx + 1:
                # Convert browser coordinates to PDF coordinates
                # (PDF 0,0 is bottom-left, Browser 0,0 is top-left)
                can.setFont("Helvetica", text['fontSize'])
                # Adjust Y: height - y - fontSize (to align top)
                pdf_x = text['x'] * (page_width / edit_data['canvasWidth'])
                pdf_y = page_height - (text['y'] * (page_height / edit_data['canvasHeight'])) - text['fontSize']
                can.drawString(pdf_x, pdf_y, text['text'])

        # Apply Drawing Paths
        for path in edit_data.get('paths', []):
            if path['page'] == page_idx + 1:
                # Parse SVG path M x y L x y...
                points = path['d'].replace('M', '').replace('L', '').split()
                if len(points) >= 2:
                    can.setStrokeColor(path['color'])
                    can.setLineWidth(path['strokeWidth'])
                    
                    for i in range(0, len(points) - 2, 2):
                        x1 = float(points[i]) * (page_width / edit_data['canvasWidth'])
                        y1 = page_height - (float(points[i+1]) * (page_height / edit_data['canvasHeight']))
                        x2 = float(points[i+2]) * (page_width / edit_data['canvasWidth'])
                        y2 = page_height - (float(points[i+3]) * (page_height / edit_data['canvasHeight']))
                        can.line(x1, y1, x2, y2)
        
        can.save()
        packet.seek(0)
        
        # Merge Overlay with Original
        overlay_pdf = PdfReader(packet)
        if len(overlay_pdf.pages) > 0:
            original_page.merge_page(overlay_pdf.pages[0])
        
        writer.add_page(original_page)

    output = io.BytesIO()
    writer.write(output)
    output.seek(0)
    
    return Response(
        content=output.getvalue(),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=edited_{file.filename}"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
